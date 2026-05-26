import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Appbar, Card, Text, IconButton, Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { FooterNav } from './footernav';

const DATA = [
  { id: '1', time: '3:20 pm', date: '12/04/2026' },
  { id: '2', time: '6:07 pm', date: '2/03/2026' },
  { id: '3', time: '12:01 am', date: '9/01/2026' },
];

export default function NotificationsScreen() {
  const router = useRouter();
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
  fallItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#CAC4D0' }
});