import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Appbar, Text, Card } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FooterNav from './Footernav';
import { useTelemetria } from '../context/TelemetriaContext';
import { usePaciente } from '@/context/PacienteContext';
import { t } from '../utils/i18n';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005b70',
    surfaceVariant: '#690909',
  },
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(256, 256, 256, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  fontFamily: 'Arial Black',
  propsForLabels: {
    fontFamily: 'Arial Black',
  }
};

interface ChartData {
  labels: string[],
  datasets: {
    data: number[],
  }[];
}

type TelemetriaKey = "heart_rate" | "spo2";

const initialChartState: ChartData = {
  labels: [],
  datasets: [{data: []}],
};

export default function SignosVitalesScreen() {
  const router = useRouter();

  const { pacienteId } = useLocalSearchParams();
  const { telemetriaActual} = useTelemetria();
  const { setPacienteId } = usePaciente();


  // Estados por cada gráfico
  const [heartRateData, setHeartRateData] = useState<ChartData>(initialChartState);
  const [spo2Data, setSpo2Data] = useState<ChartData>(initialChartState);


  const actualizarGrafico = (
    tipo: TelemetriaKey, 
    setChartState: React.Dispatch<React.SetStateAction<ChartData>>
  ) => {
    if (!telemetriaActual) return;

    const nuevoValor = telemetriaActual[tipo];
    const nuevaHora = telemetriaActual.time.slice(11, 19);

    setChartState((prev) => {
      const newLabels = [...prev.labels, nuevaHora];
      const newData = [...prev.datasets[0].data, nuevoValor];

      // Mantiene los últimos 4 puntos (ajusta según tu necesidad, tu comentario decía 20)
      if (newLabels.length > 4) {
        newLabels.shift();
        newData.shift();
      }

      return {
        labels: newLabels,
        datasets: [{ data: newData }],
      };
    });
  };

  // Un Effect dispara los 2 gráficos
  useEffect(() => {
    if (telemetriaActual) {
      actualizarGrafico('heart_rate', setHeartRateData);
      actualizarGrafico('spo2', setSpo2Data);
    }
  }, [telemetriaActual]);
  

  useEffect(() => {
    setPacienteId(pacienteId as string | undefined);
  }, [pacienteId, setPacienteId]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t('common.back')} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>{t('vitals.title')}</Text>

          <Card style={styles.vitalsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>{t('vitals.heart_rate')}</Text>

              <Text variant="titleMedium" style={styles.cardData}>
                {telemetriaActual?.heart_rate ? `${telemetriaActual?.heart_rate.toFixed(2)} ${t('vitals.bpm')}` : `-- ${t('vitals.bpm')}`}
              </Text>

              {heartRateData.labels.length > 0 && (
                <LineChart data={heartRateData}
                width={350}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
                />
              )}
            </Card.Content>
          </Card>

          <Card style={styles.vitalsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>{t('vitals.oxygen_level')}</Text>
              <Text variant="titleMedium" style={styles.cardData}>
                {telemetriaActual?.spo2 ? `${telemetriaActual.spo2}${t('vitals.percent')}` : `--${t('vitals.percent')}`}
              </Text>

              {spo2Data.labels.length > 0 && (
                <LineChart data={spo2Data}
                width={350}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
                />
              )}
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
  header: { backgroundColor: '#ffffff', elevation: 0 },
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