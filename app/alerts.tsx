import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar, Card, Text, IconButton, Provider as PaperProvider, MD3LightTheme, FAB, Portal, Modal, TextInput, Button, ActivityIndicator, Menu } from 'react-native-paper';
import FooterNav from './footernav';
import { apiService } from '@/services/apiService';
import { useNotificationBanner } from '@/context/NotificationContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const DATA = [
  { id: '1', time: '3:20 p. m.', date: '12/4/2026' },
  { id: '2', time: '6:07 a. m.', date: '2/3/2026' },
  { id: '3', time: '12:01 p. m.', date: '9/1/2026' },
];

interface Medication {
  id: string;
  nombre: string;
  horas: string;
  frecuencia: string;
}

interface FallEvent {
  id: string;
  time: string;
  date: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { pacienteId } = useLocalSearchParams();
  const { actualizarMedicamentos } = useNotificationBanner();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [falls, setFalls] = useState<FallEvent[]>(DATA);
  const [visible, setVisible] = useState(false);
  const [medName, setMedName] = useState('');
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [frecuencia, setFrecuencia] = useState("Diario");
  const [menuVisible, setMenuVisible] = useState(false);
  const [medicamentoEditado, setMedicamentoEditado] = useState<Medication | null>(null);

  useEffect(() => {
    loadMedications();
    cargarCaidasDetectadas();

    const interval = setInterval(() => {
      cargarCaidasDetectadas();
    }, 5000);

    return () => clearInterval(interval);
  }, [pacienteId]);

  const onChangeTime = (_: any, selectedTime?: Date) => {
    setShowPicker(false);

    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const cargarCaidasDetectadas = async () => {
    if (!pacienteId) return;

    try {
      const response = await apiService.get(
        `/api/pacientes/${pacienteId}/telemetria?limite=50`
      );
      const telemetrias = response.telemetria ?? [];

      const nuevasCaidas = telemetrias
        .filter((item: any) => {
          const ax = Number(item.ax ?? 0);
          const ay = Number(item.ay ?? 0);
          const az = Number(item.az ?? 0);

          return (
            Math.abs(ax) >= 20 ||
            Math.abs(ay) >= 20 ||
            Math.abs(az) <= 6
          );
        })
        .map((item: any) => {
          const rawTime = String(item.time ?? '');
          const timestamp = new Date(rawTime.replace(' ', 'T'));
          const time = isNaN(timestamp.getTime())
            ? rawTime
            : timestamp.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          const date = isNaN(timestamp.getTime())
            ? rawTime
            : timestamp.toLocaleDateString('es-ES');

          return {
            id: rawTime || `${item.ax}-${item.ay}-${item.az}`,
            time,
            date,
          };
        });

      if (nuevasCaidas.length > 0) {
        setFalls((prevFalls) => {
          const combined = [...nuevasCaidas, ...prevFalls];
          const unique = combined.filter(
            (item, index, self) =>
              index === self.findIndex((other) => other.id === item.id)
          );
          return unique;
        });
      }
    } catch (error) {
      console.error('Error cargando caídas detectadas:', error);
    }
  };

  const loadMedications = async () => {
    if (!pacienteId) return;

    try {
      setLoadingMeds(true);
      const response = await apiService.get(`/api/medicamentos/${pacienteId}`);

      const meds = response ?? [];
      setMedications(meds);
      actualizarMedicamentos(meds);
    } catch (error) {
      console.error("Error cargando los medicamentos:", error);
    } finally {
      setLoadingMeds(false);
    }
  };

  const showModal = () => setVisible(true);

  const hideModal = () => {
    setVisible(false);
    setMedName('');
    // setHour('08:00 am');
  };

  const formatHour = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  const createMedication = async () => {
    if (!pacienteId || !medName.trim()) return;
    const medicamento = {
      nombre: medName,
      horas: [formatHour(time)],
      frecuencia: frecuencia,
    };

    try {
      await apiService.post(`/api/medicamentos/${pacienteId}`, medicamento);
      await loadMedications();
      hideModal();
    } catch (error) {
      console.error("Error al guardar el medicamento:", error);
    }
  };

  const editMedication = (medication: Medication) => {
    setMedicamentoEditado(medication);
    setMedName(medication.nombre);

    if (medication.horas.length > 0) {
        const [hour, minute] = medication.horas[0].split(":").map(Number);

        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        setTime(date);
    }
    setFrecuencia(medication.frecuencia);
    setVisible(true);
  };

  const updateMedication = async () => {
    if (!medicamentoEditado) return;

    // Se edita el medicamento
  }

  // Función para eliminar un medicamento con confirmación previa
  const deleteMedication = (id: string, name: string) => {
    const mensaje = `¿Estás seguro de que deseas eliminar los recordatorios para "${name}"?`;

    Alert.alert(
      "Eliminar medicamento",
      mensaje,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => ejecutarEliminacion(id)
        }
      ]
    );
  };

  // Aislamos la lógica de actualización para no repetir código
  const ejecutarEliminacion = async (id: string) => {
    if (!pacienteId) return;

    try {
      await apiService.delete(`/api/medicamentos/${pacienteId}/${id}`);
      setMedications((prevMeds) => prevMeds.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Error al eliminar el medicamento:", error);
    }
  };

  // Componente que contiene todo lo que va ARRIBA de las caídas
  const RenderHeader = () => (
    <View>
      <Text variant="headlineSmall" style={styles.title}>Alertas y Notificaciones</Text>

      {/* Recordatorio de Medicamento */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Recordatorio de Medicamentos</Text>

      <View style={styles.medsContainer}>
        {loadingMeds ? (
          // Sesión Loading Activada
          <View>
            <ActivityIndicator animating={true} color='#004A60' size='small' />
          </View>
        ) : medications.length === 0 ? (
          // Si no hay medicamentos
          <View>
            <Text variant='bodyMedium'>No hay medicamentos programados</Text>
          </View>
        ) : (
          medications.map((item) => (
            <Card key={item.id} style={styles.medCard}>
              <Card.Content style={styles.medContent}>
                <IconButton icon="pill" iconColor="white" size={24} style={styles.medIcon} />
                <View style={styles.medTextWrapper}>
                  <Text style={styles.medTitle}>{item.nombre}</Text>
                  <Text style={styles.medTime}>{item.frecuencia}</Text>
                  <Text style={styles.medTime}>{item.horas}</Text>
                </View>
                {/* Botón para eliminar */}
                <IconButton
                  icon="pencil"
                  iconColor="#ffffff"
                  size={22}
                  onPress={() => editMedication(item)}
                />
                
                <IconButton
                  icon="delete"
                  iconColor="#FF8A8A"
                  size={22}
                  onPress={() => deleteMedication(item.id, item.nombre)}
                  style={styles.deleteMedBtn}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Título de la sección inferior */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Caídas detectadas</Text>
    </View>
  );

  return (
    <PaperProvider theme={MD3LightTheme}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Atrás" />
      </Appbar.Header>

      <View style={styles.container}>
        <FlatList
          data={falls}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={RenderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.fallItem}>
              <Text variant="bodyLarge">{item.time}</Text>
              <Text variant="bodyLarge">{item.date}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium">Aún no se han detectado caídas.</Text>
            </View>
          )}
        />

        <FAB icon="plus" style={styles.fab} color='white' onPress={showModal} />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{medicamentoEditado ? "Editar medicamento":"Agregar medicamento"}</Text>

              <Text style={styles.inputLabel}>Nombre del Medicamento</Text>
              <TextInput placeholder='Ej. Paracetamol' value={medName} onChangeText={setMedName} mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' />

              <Text style={styles.inputLabel}>Horario de Recordatorio</Text>

              <Button
                mode="outlined"
                onPress={() => setShowPicker(true)}
              >
                {time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Button>

              {showPicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTime}
                />
              )}

              <Text style={styles.inputLabel}>Frecuencia de medicamento</Text>

              <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                mode='outlined'
                onPress={()=> setMenuVisible(true)}
                contentStyle={{justifyContent: "space-between"}}>
                  {frecuencia}
                </Button>
              }>
                <Menu.Item
                onPress={() => {
                    setFrecuencia("Diario");
                    setMenuVisible(false);
                }}
                title="Diario" />

                <Menu.Item
                onPress={() => {
                      setFrecuencia("Semanal");
                      setMenuVisible(false);
                }}
                
                title="Semanal"
                />

                <Menu.Item
                onPress={() => {
                      setFrecuencia("Mensual");
                      setMenuVisible(false);
                }}
                
                title="Mensual"
                />
              </Menu>

              <View style={styles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  Cancelar
                </Button>
                <Button mode='contained' onPress={createMedication} style={styles.saveButton}>
                  Guardar
                </Button>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
        <FooterNav activeTab="inicio" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#FEF7FF' },
  header: { backgroundColor: 'transparent', elevation: 0, justifyContent: 'space-between', },
  title: { marginBottom: 20, fontWeight: 'bold' },
  medsContainer: { marginBottom: 16 },
  medCard: { backgroundColor: '#004A60', marginBottom: 12, width: '100%' },
  medContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  medIcon: { margin: 0 },
  medTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  medTime: { color: 'white', fontSize: 14 },
  sectionTitle: { marginBottom: 16, fontWeight: 'bold', marginTop: 8 },
  fallItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#CAC4D0' },
  emptyContainer: { paddingVertical: 24, alignItems: 'center' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 90, backgroundColor: '#004A60', borderRadius: 50, zIndex: 10 },
  modalContainer: { backgroundColor: 'white', padding: 24, margin: 20, borderRadius: 28, maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1D1B20', marginBottom: 16 },
  inputLabel: { fontSize: 14, color: '#49454F', marginTop: 12, marginBottom: 10 },
  input: { backgroundColor: '#F4EFF4', marginBottom: 8, },
  addHourButton: { backgroundColor: '#004A60', alignSelf: 'flex-start', borderRadius: 20, marginBottom: 12, },
  hourRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, },
  cancelButton: { flex: 1, marginRight: 8, backgroundColor: '#E6E1E5', borderRadius: 20, },
  saveButton: { flex: 1, marginLeft: 8, backgroundColor: '#004A60', borderRadius: 20, },
  medTextWrapper: { marginLeft: 4, flex: 1 },
  deleteMedBtn: { margin: 0, padding: 0 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, backgroundColor: '#f7f7f7', borderRadius: 12 },
  loadingText: { marginLeft: 10, color: '#49454f', alignItems: 'center' }
});