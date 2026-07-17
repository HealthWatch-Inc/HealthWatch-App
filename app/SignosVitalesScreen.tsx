import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, Appbar, Text, Card } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FooterNav from '../components/Footernav';
import { useTelemetria } from '../context/TelemetriaContext';
import { usePaciente } from '@/context/PacienteContext';
import { useTheme } from '@/context/ThemeContext';
import { t } from '../utils/i18n';

interface ChartData {
  labels: string[],
  datasets: {
    data: number[],
  }[];
}

type TelemetriaKey = "heart_rate" | "spo2";

const initialChartState: ChartData = {
  labels: [],
  datasets: [{ data: [] }],
};

export default function SignosVitalesScreen() {
  const router = useRouter();
  const { pacienteId } = useLocalSearchParams();
  const { telemetriaActual } = useTelemetria();
  const { setPacienteId } = usePaciente();
  const {theme, Colors, globalStyles, chartConfig } = useTheme();

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

  const styles = StyleSheet.create({
    scrollContent: {
      padding: 8,
      paddingBottom: 100
    },
    vitalsCard: {
      backgroundColor: '#690909',
      borderRadius: 28,
      marginBottom: 24,
      paddingVertical: 8
    },
    cardTitle: {
      color: Colors.white,
      fontWeight: '500',
      marginBottom: 12,
      marginLeft: 4
    },
    cardData: {
      color: Colors.white,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
      marginLeft: 4
    },
  });

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

  const CardVitals = ({ titulo, dato, chart, unidad }: { titulo: string, dato: number | undefined, chart: ChartData, unidad: string }) => {
    return (
      <>
        <Card style={styles.vitalsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>{titulo}</Text>

            <Text variant="titleMedium" style={styles.cardData}>
              {dato ? `${dato.toFixed(2)} ${unidad}` : `-- ${unidad}`}
            </Text>

            {chart.labels.length > 0 && (
              <LineChart data={chart}
                width={350}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            )}
          </Card.Content>
        </Card>
      </>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={globalStyles.container}>
        <Appbar.Header style={globalStyles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t('common.back')} />
        </Appbar.Header>

        <ScrollView style={globalStyles.content}>
          <Text variant="headlineMedium" style={globalStyles.title}>{t('vitals.title')}</Text>
          <CardVitals titulo={t('vitals.heart_rate')} dato={telemetriaActual?.heart_rate} chart={heartRateData} unidad='BPM' />
          <CardVitals titulo={t('vitals.oxygen_level')} dato={telemetriaActual?.spo2} chart={spo2Data} unidad='%' />
        </ScrollView>

        <FooterNav activeTab="inicio" />
      </SafeAreaView>
    </PaperProvider>
  );
}