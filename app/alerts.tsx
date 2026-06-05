import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Appbar, Card, Text, IconButton, Provider as PaperProvider, MD3LightTheme, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterNav from './footernav';

const DATA = [
  { id: '1', time: '3:20 pm', date: '12/04/2026' },
  { id: '2', time: '6:07 pm', date: '2/03/2026' },
  { id: '3', time: '12:01 am', date: '9/01/2026' },
];

const STORAGE_KEY = '@medicamentos_list';

interface Medication {
  id: string;
  name: string;
  hours: string[];
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [visible, setVisible] = useState(false);
  const [medName, setMedName] = useState('');
  const [hours, setHours] = useState(['08:00 am', '02:00 pm']);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const storedMeds = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMeds !== null) {
        setMedications(JSON.parse(storedMeds));
      } else {
        const initialMeds = [{ id: 'default_1', name: 'Aspirina', hours: ['12:00 pm', '20:00 pm'] }];
        setMedications(initialMeds);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialMeds));
      }
    } catch (error) {
      console.error("Error cargando los medicamentos:", error);
    }
  };

  const showModal = () => setVisible(true);

  const hideModal = () => {
    setVisible(false);
    setMedName('');
    setHours(['08:00 am', '02:00 pm']);
  };

  const addHourSlot = () => setHours([...hours, '']);
  const removeHourSlot = (index: number) => setHours(hours.filter((_, i) => i !== index));
  const updateHourText = (text: string, index: number) => {
    const updatedHours = [...hours];
    updatedHours[index] = text;
    setHours(updatedHours);
  };

  const saveMedication = async () => {
    if (!medName.trim()) return;
    const filteredHours = hours.filter(h => h.trim() !== '');
    const newMed = {
      id: Date.now().toString(),
      name: medName,
      hours: filteredHours
    };

    try {
      const updatedList = [...medications, newMed];
      setMedications(updatedList);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
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
    try {
      const updatedList = medications.filter(med => med.id !== id);
      setMedications(updatedList);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
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
                <Text style={styles.medTitle}>{item.name}</Text>
                <Text style={styles.medTime}>{item.hours.join(', ')}</Text>
              </View>
              {/* Botón para eliminar */}
              <IconButton 
                icon="delete" 
                iconColor="#FF8A8A" 
                size={22} 
                onPress={() => deleteMedication(item.id, item.name)} 
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
          data={DATA}
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

              <Text style={styles.inputLabel}>Horarios de Recordatorios</Text>
              <Button mode="contained" icon='plus' onPress={addHourSlot} style={styles.addHourButton} contentStyle={{ flexDirection: 'row' }}> Agregar Hora</Button>

              {hours.map((hour, index) => (
                <View key={index} style={styles.hourRow}>
                  <TextInput value={hour} onChangeText={(text) => updateHourText(text, index)} mode='outlined' placeholder='00:00 am' style={[styles.input, { flex: 1, marginBottom: 0 }]} outlineColor='#CAC4D0' activeOutlineColor='#004A60' />
                  <IconButton icon='delete-outline' iconColor='#757575' onPress={() => removeHourSlot(index)} />
                </View>
              ))}

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
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    justifyContent: 'space-between',
  },
  title: { marginBottom: 20, fontWeight: 'bold' },
  medsContainer: { marginBottom: 16 },
  medCard: { backgroundColor: '#004A60', marginBottom: 12, width: '100%' },
  medContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  medIcon: { margin: 0 },
  medTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  medTime: { color: 'white', fontSize: 14 },
  sectionTitle: { marginBottom: 16, fontWeight: 'bold', marginTop: 8 },
  fallItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#CAC4D0'
  },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 90, backgroundColor: '#004A60', borderRadius: 50, zIndex: 10 },
  modalContainer: {
    backgroundColor: 'white', padding: 24, margin: 20, borderRadius: 28, maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#1D1B20', marginBottom: 16
  },
  inputLabel: {
    fontSize: 14, color: '#49454F', marginTop: 12, marginBottom: 10
  },
  input: {
    backgroundColor: '#F4EFF4', marginBottom: 8,
  },
  addHourButton: {
    backgroundColor: '#004A60', alignSelf: 'flex-start', borderRadius: 20, marginBottom: 12,
  },
  hourRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 24,
  },
  cancelButton: {
    flex: 1, marginRight: 8, backgroundColor: '#E6E1E5', borderRadius: 20,
  },
  saveButton: {
    flex: 1, marginLeft: 8, backgroundColor: '#004A60', borderRadius: 20,
  },
  medTextWrapper: { marginLeft: 4, flex: 1 },
  deleteMedBtn: { margin: 0, padding: 0 }
});