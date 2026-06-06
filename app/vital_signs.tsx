import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Appbar, Text, Card } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FooterNav from './footernav';
import { useTelemetria } from '../context/TelemetriaContext';

interface Telemetria {
  heart_rate: number;
  spo2: number;
  battery: number;
  ax: number;
  ay: number;
  az: number;
}

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005b70',
    surfaceVariant: '#690909',
  },
};

export default function SignosVitalesScreen() {
  const router = useRouter();

  const { pacienteId } = useLocalSearchParams();
  const { telemetriaActual, setPacienteId } = useTelemetria();

  useEffect(() => {
    setPacienteId(pacienteId as string | undefined);
  }, [pacienteId, setPacienteId]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Atrás" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>Signos vitales</Text>

          <Card style={styles.vitalsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Frecuencia Cardiaca</Text>

              <Text variant="titleMedium" style={styles.cardData}>
                {telemetriaActual?.heart_rate ? `${telemetriaActual.heart_rate} BPM` : '-- BPM'}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.vitalsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Nivel de Oxígeno</Text>
              <Text variant="titleMedium" style={styles.cardData}>
                {telemetriaActual?.spo2 ? `${telemetriaActual.spo2}%` : '--%'}
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>

        <FooterNav activeTab="inicio" />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: {
    backgroundColor: '#ffffff', elevation: 0, //shadowOpacity: 0
  },
  title: { fontWeight: 'bold', marginBottom: 20, color: '#000' },
  vitalsCard: { backgroundColor: '#690909', borderRadius: 28, marginBottom: 24, paddingVertical: 8 },
  cardTitle: { color: '#ffffff', fontWeight: '500', marginBottom: 12, marginLeft: 4 },
  cardData: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 12, marginLeft: 4 },
  whiteChartBackground: { backgroundColor: '#ffffff', borderRadius: 16, padding: 12, height: 140, justifyContent: 'center' },
  chartContainer: { flexDirection: 'row', alignItems: 'center' },
  yAxis: { justifyContent: 'space-between', height: 90, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#E0E0E0' },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 4 },
  axisText: { fontSize: 10, color: '#757575' },
});