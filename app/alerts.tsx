import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Appbar, Card, Text, IconButton, Provider as PaperProvider, MD3LightTheme, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import FooterNav from './footernav';

const DATA = [
  { id: '1', time: '3:20 pm', date: '12/04/2026' },
  { id: '2', time: '6:07 pm', date: '2/03/2026' },
  { id: '3', time: '12:01 am', date: '9/01/2026' },
];

export default function NotificationsScreen() {
  const router = useRouter();

  // Estado para Modal y Formulario
  const [visible, setVisible] = useState(false);
  const [medName, setMedName] = useState('');
  const [hours, setHours] = useState(['08:00 am', '02:00 pm']);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Manipular horas dinámicamente
  const addHourSlot = () => setHours([...hours, '']);
  const removeHourSlot = (index: any) => setHours(hours.filter((_, i) => i !== index));
  const updateHourText = (text: any, index: any) => {
    const updatedHours = [...hours];
    updatedHours[index] = text;
    setHours(updatedHours);
  };

  return (
    <PaperProvider theme={MD3LightTheme}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Atrás" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>Alertas y Notificaciones</Text>

        {/* Recordatorio de Medicamento */}
        <Card style={styles.medCard}>
          <Card.Content style={styles.medContent}>
            <IconButton icon="pill" iconColor="white" size={24} />
            <View>
              <Text style={styles.medTitle}>Recordatorio de Medicamento</Text>
              <Text style={styles.medTime}>12:00 pm, 20:00pm</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Lista de Caídas */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Caídas detectadas</Text>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.fallItem}>
              <Text variant="bodyLarge">{item.time}</Text>
              <Text variant="bodyLarge">{item.date}</Text>
            </View>
          )}
        />

        {/* Botón flotante para agregar medicamento */}
        <FAB icon="plus" style={styles.fab} color='white' onPress={showModal} />

        {/* Modal Nuevo Medicamento */}
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

              {/* Inputs de Horas Dinámicos */}
              {hours.map((hour, index) => (
                <View key={index} style={styles.hourRow}>
                  <TextInput value={hour} onChangeText={(text) => updateHourText(text, index)} mode='outlined' placeholder='00:00 am' style={[styles.input, { flex: 1, marginBottom: 0 }]} outlineColor='#CAC4D0' activeOutlineColor='#004A60' />

                  <IconButton icon='delete-outline' iconColor='#757575' onPress={() => removeHourSlot(index)} />
                </View>
              ))}

              <Text style={styles.inputLabel}>Frecuencia</Text>
              <TextInput value='Diario' mode='outlined' editable={false} right={<TextInput.Icon icon='chevron-down' />} style={styles.input} outlineColor='#CAC4D0' />

              {/* Acciones del Modal */}
              <View style={styles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  Cancelar
                </Button>

                <Button mode='contained' onPress={hideModal} style={styles.saveButton}>
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
  container: { flex: 1, padding: 16, backgroundColor: '#FEF7FF' },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    justifyContent: 'space-between',
  },
  title: { marginBottom: 20, fontWeight: 'bold' },
  medCard: { backgroundColor: '#004A60', marginBottom: 24 },
  medContent: { flexDirection: 'row', alignItems: 'center' },
  medTitle: { color: 'white', fontWeight: 'bold' },
  medTime: { color: 'white' },
  sectionTitle: { marginBottom: 16 },
  fallItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#CAC4D0'
  },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 90, backgroundColor: '#004A60', borderRadius: 50, },
  modalContainer: {
    backgroundColor: 'white', padding: 24, margin: 20, borderRadius: 28, maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#1D1B20', marginBottom: 16
  },
  inputLabel: {
    fontSize: 14, color: '#49454F', marginTop: 12, marginBottom: 4
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
});