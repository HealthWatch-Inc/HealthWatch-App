import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar, Card, Text, IconButton, Provider as PaperProvider, MD3LightTheme, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import FooterNav from './footernav';
import { apiService } from '@/services/apiService';
import { useNotificationBanner } from '@/context/NotificationContext';

const DATA = [
  { id: '1', time: '03:20 p. m.', date: '12/4/2026' },
  { id: '2', time: '06:07 a. m.', date: '2/3/2026' },
  { id: '3', time: '012:01 p. m.', date: '9/1/2026' },
];

interface Medication {
  id: string;
  nombre: string;
  horas: string[];
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
  const [medications, setMedications] = useState<Medication[]>([]);
  const [falls, setFalls] = useState<FallEvent[]>(DATA);
  const [visible, setVisible] = useState(false);
  const [medName, setMedName] = useState('');
  const [hour, setHour] = useState('08:00 am');
  const { actualizarMedicamentos } = useNotificationBanner();

  useEffect(() => {
    loadMedications();
    cargarCaidasDetectadas();

    const interval = setInterval(() => {
      cargarCaidasDetectadas();
    }, 5000);

    return () => clearInterval(interval);
  }, [pacienteId]);

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
      const response = await apiService.get(`/api/medicamentos/${pacienteId}`);

      console.log(response)
      
      const meds = response ?? [];

      setMedications(meds);
      actualizarMedicamentos(meds);

    } catch (error) {
      console.error("Error cargando los medicamentos:", error);
    }
  };

  const showModal = () => setVisible(true);

  const hideModal = () => {
    setVisible(false);
    setMedName('');
    setHour('08:00 am');
  };

  const saveMedication = async () => {
    if (!pacienteId || !medName.trim()) return;
    const medicamento = {
      nombre: medName,
      horas: [hour],
      frecuencia: 'Diario',
    };

    try {
      await apiService.post(`/api/medicamentos/${pacienteId}`, medicamento);
      await loadMedications();
      hideModal();
    } catch (error) {
      console.error("Error al guardar el medicamento:", error);
    }
  };

  // Función para eliminar un medicamento con confirmación previa
  const deleteMedication = (id: string, name: string) => {
    const mensaje = `¿Estás seguro de que deseas eliminar los recordatorios para "${name}"?`;

    // Ejecución si estás en Web
    if (Platform.OS === 'web') {
      const respuestaWeb = window.confirm(mensaje);
      if (respuestaWeb) {
        ejecutarEliminacion(id);
      }
    } else {
      // Ejecución si estás en Móvil (iOS / Android)
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
    }
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
        {medications.map((item) => (
          <Card key={item.id} style={styles.medCard}>
            <Card.Content style={styles.medContent}>
              <IconButton icon="pill" iconColor="white" size={24} style={styles.medIcon} />
              <View style={styles.medTextWrapper}>
                <Text style={styles.medTitle}>{item.nombre}</Text>
                <Text style={styles.medTime}>{item.horas.join(', ')}</Text>
              </View>
              {/* Botón para eliminar */}
              <IconButton
                icon="delete"
                iconColor="#FF8A8A"
                size={22}
                onPress={() => deleteMedication(item.id, item.nombre)}
                style={styles.deleteMedBtn}
              />
            </Card.Content>
          </Card>
        ))}
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
              <Text style={styles.modalTitle}>Nuevo medicamento</Text>

              <Text style={styles.inputLabel}>Nombre del Medicamento</Text>
              <TextInput placeholder='Ej. Paracetamol' value={medName} onChangeText={setMedName} mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' />

              <Text style={styles.inputLabel}>Horario de Recordatorio</Text>

              <TextInput value={hour} onChangeText={setHour} mode="outlined" placeholder="08:00 am" style={styles.input} outlineColor="#CAC4D0" activeOutlineColor="#004A60" />

              <Text style={styles.inputLabel}>Frecuencia</Text>
              <TextInput value='Diario' mode='outlined' editable={false} right={<TextInput.Icon icon='chevron-down' />} style={styles.input} outlineColor='#CAC4D0' />

              <View style={styles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  Cancelar
                </Button>
                <Button mode='contained' onPress={saveMedication} style={styles.saveButton}>
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
  deleteMedBtn: { margin: 0, padding: 0 }
});