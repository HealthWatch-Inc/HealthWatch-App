import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Appbar,
  Card,
  Text,
  IconButton,
  Provider as PaperProvider,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Menu
} from 'react-native-paper';
import FooterNav from '../components/Footernav';
import { apiService } from '@/services/apiService';
import { useNotificationBanner } from '@/context/NotificationContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePaciente } from '@/context/PacienteContext';
import { useTheme } from '@/context/ThemeContext';
import { t } from '../utils/i18n';

const DATA = [
  { id: '1', time: '3:20 p. m.', date: '12/4/2026' },
  { id: '2', time: '6:07 a. m.', date: '2/3/2026' },
  { id: '3', time: '12:01 p. m.', date: '9/1/2026' },
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
  const { theme, Colors, globalStyles, } = useTheme();
  const { actualizarMedicamentos } = useNotificationBanner();
  const { setPacienteId } = usePaciente();
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
    console.log("LOAD EFFECT")

    if (!pacienteId) return;

    setPacienteId(String(pacienteId));
    loadMedications();

  }, [pacienteId, setPacienteId]);

  const onChangeTime = (event: any, selectedTime?: Date) => {
    console.log("onChangeTime");
    console.log("event:", event.type);

    if (selectedTime) {
      console.log("Nueva hora:", selectedTime.toLocaleTimeString());
    }

    if (event?.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedTime) {
      cambiarHora(selectedTime, "DateTimePicker");
      setShowPicker(false);
    }
  };

  const loadMedications = async () => {
    if (!pacienteId) {
      setMedications([]);
      await actualizarMedicamentos([]);
      setLoadingMeds(false);
      return;
    }

    try {
      setLoadingMeds(true);
      const response = await apiService.get(`/api/medicamentos/${pacienteId}`);

      const meds = Array.isArray(response) ? response : [];
      setMedications(meds);
      await actualizarMedicamentos(meds);
    } catch (error) {
      console.error("Error cargando los medicamentos:", error);
      setMedications([]);
      await actualizarMedicamentos([]);
    } finally {
      setLoadingMeds(false);
    }
  };

  const cambiarHora = (date: Date, origen: string) => {
    console.log("setTime desde", origen, formatHour(date));
    setTime(date);
  };

  const showModal = () => {
    setShowPicker(false);
    setVisible(true);
  };

  const abrirSelectorHora = () => {
    setShowPicker(true);
  };

  const hideModal = () => {
    setVisible(false);
    setShowPicker(false);
    setMedicamentoEditado(null);
    setMedName('');
    setFrecuencia('daily');
    cambiarHora(new Date(), "hideModal");
    setMenuVisible(false);
  };

  const formatHour = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  const guardarMedicamento = async () => {
    if (!pacienteId || !medName.trim()) {
      Alert.alert(t('common.error'), t('alerts.incomplete_data'));
      return;
    }

    const medicamento = {
      nombre: medName.trim(),
      horas: [formatHour(time)],
      frecuencia,
    };

    try {
      if (medicamentoEditado) {
        await apiService.put(`/api/medicamentos/${pacienteId}/${medicamentoEditado.id}`, medicamento);
      } else {
        await apiService.post(`/api/medicamentos/${pacienteId}`, medicamento);
      }

      await loadMedications();
      hideModal();
    } catch (error) {
      console.error("Error al guardar el medicamento:", error);
      Alert.alert(t('common.error'), t('alerts.error_save'));
    }
  };

  const editMedication = (medication: Medication) => {
    console.log("EDIT", medication.horas[0]);

    setMedicamentoEditado(medication);
    setMedName(medication.nombre);

    if (medication.horas?.length > 0) {
      const [hour, minute] = medication.horas[0].split(":").map(Number);
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      setTime(date);
    } else {
      setTime(new Date());
    }

    const frequencyMap: Record<string, string> = {
      Diario: 'daily',
      Semanal: 'weekly',
      Mensual: 'monthly',
      daily: 'daily',
      weekly: 'weekly',
      monthly: 'monthly',
    };
    setFrecuencia(frequencyMap[medication.frecuencia] ?? 'daily');
    setVisible(true);
  };

  const updateMedication = async () => {
    await guardarMedicamento();
  };

  // Función para eliminar un medicamento con confirmación previa
  const deleteMedication = (id: string, name: string) => {
    const mensaje = t('alerts.delete_medication_message', { name });

    Alert.alert(
      t('alerts.delete_medication_title'),
      mensaje,
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.delete'),
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
      await loadMedications();
    } catch (error) {
      console.error("Error al eliminar el medicamento:", error);
      Alert.alert(t('common.error'), t('alerts.error_delete'));
    }
  };

  const styles = StyleSheet.create({
    medsContainer: {
      marginBottom: 16
    },
    medCard: {
      backgroundColor: Colors.primary,
      marginBottom: 12,
      width: '100%'
    },
    medContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8
    },
    medIcon: {
      margin: 0
    },
    medTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    medTime: {
      color: 'white',
      fontSize: 14
    },
    medTextWrapper: {
      marginLeft: 4,
      flex: 1
    },
    deleteMedBtn: {
      margin: 0,
      padding: 0
    },
    sectionTitle: {
      marginBottom: 16,
      fontWeight: 'bold',
      marginTop: 8
    },
    fallItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#CAC4D0'
    },
    emptyContainer: {
      paddingVertical: 24,
      alignItems: 'center'
    },
  });

  const CardMedicamento = ({ id, objeto, nombre, frecuencia, horas }: { id: string, objeto: Medication, nombre: string, frecuencia: string, horas: string[] }) => {
    return (
      <>
        <Card key={id} style={styles.medCard}>
          <Card.Content style={styles.medContent}>
            <IconButton icon="pill" iconColor="white" size={24} style={styles.medIcon} />
            <View style={styles.medTextWrapper}>
              <Text style={styles.medTitle}>{nombre}</Text>
              <Text style={styles.medTime}>{frecuencia}</Text>
              <Text style={styles.medTime}>{horas}</Text>
            </View>
            {/* Botón para eliminar */}
            <IconButton
              icon="pencil"
              iconColor="#ffffff"
              size={22}
              onPress={() => editMedication(objeto)}
            />

            <IconButton
              icon="delete"
              iconColor="#FF8A8A"
              size={22}
              onPress={() => deleteMedication(id, nombre)}
              style={styles.deleteMedBtn}
            />
          </Card.Content>
        </Card>
      </>
    )
  }

  const RenderHeader = () => (
    <View>
      <Text variant="headlineSmall" style={globalStyles.title}>{t('alerts.title')}</Text>

      {/* Recordatorio de Medicamento */}
      <Text variant="titleMedium" style={styles.sectionTitle}>{t('alerts.medication_reminder')}</Text>

      <View style={styles.medsContainer}>
        {loadingMeds ? (
          // Sesión Loading Activada
          <View>
            <ActivityIndicator animating={true} color={Colors.primary} size='small' />
          </View>
        ) : medications.length === 0 ? (
          // Si no hay medicamentos
          <View>
            <Text variant='bodyMedium'>{t('alerts.no_medications')}</Text>
          </View>
        ) : (
          medications.map((item) => (
            <CardMedicamento key={item.id} id={item.id} objeto={item} nombre={item.nombre} frecuencia={item.frecuencia} horas={item.horas} />
          ))
        )}
      </View>

      {/* Título de la sección inferior */}
      <Text variant="titleMedium" style={styles.sectionTitle}>{t('alerts.falls_detected')}</Text>
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header style={globalStyles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('common.back')} />
      </Appbar.Header>

      <View style={globalStyles.container}>
        <FlatList
          data={falls}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={RenderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyles.content}
          renderItem={({ item }) => (
            <View style={styles.fallItem}>
              <Text variant="bodyLarge">{item.time}</Text>
              <Text variant="bodyLarge">{item.date}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium">{t('alerts.no_falls')}</Text>
            </View>
          )}
        />

        <FAB icon="plus" style={globalStyles.fab} color='white' onPress={showModal} />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={globalStyles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={globalStyles.modalTitle}>{medicamentoEditado ? t('alerts.edit_medication') : t('alerts.add_medication')}</Text>

              <Text style={globalStyles.inputLabel}>{t('alerts.medication_name')}</Text>
              <TextInput placeholder={t('alerts.example_medication')} value={medName} onChangeText={setMedName} mode='outlined' style={globalStyles.input} outlineColor='#CAC4D0' activeOutlineColor={Colors.primary} />

              <Text style={globalStyles.inputLabel}>{t('alerts.reminder_time')}</Text>

              <Button
                mode="outlined"
                onPress={abrirSelectorHora}
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

              <Text style={globalStyles.inputLabel}>{t('alerts.frequency')}</Text>

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode='outlined'
                    onPress={() => setMenuVisible(true)}
                    contentStyle={{ justifyContent: "space-between" }}>
                    {t(`alerts.${frecuencia}`)}
                  </Button>
                }>
                <Menu.Item
                  onPress={() => {
                    setFrecuencia('daily');
                    setMenuVisible(false);
                  }}
                  title={t('alerts.daily')}
                />

                <Menu.Item
                  onPress={() => {
                    setFrecuencia('weekly');
                    setMenuVisible(false);
                  }}
                  title={t('alerts.weekly')}
                />

                <Menu.Item
                  onPress={() => {
                    setFrecuencia('monthly');
                    setMenuVisible(false);
                  }}
                  title={t('alerts.monthly')}
                />
              </Menu>

              <View style={globalStyles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={[globalStyles.button, { backgroundColor: Colors.cancel }]} labelStyle={{ color: '#49454f' }}>
                  {t('common.cancel')}
                </Button>
                <Button mode='contained' onPress={guardarMedicamento} style={[globalStyles.button, { backgroundColor: Colors.primary }]}>
                  {medicamentoEditado ? t('common.save') : t('common.add')}
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