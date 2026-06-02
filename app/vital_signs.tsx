import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Appbar, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import FooterNav from './footernav'; // Asegúrate de que la ruta sea correcta

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005b70',
    surfaceVariant: '#690909',
  },
};

const CustomChart = () => {
  const points = "M10,60 L25,50 L40,70 L55,55 L70,75 L85,45 L100,55 L115,35 L130,80 L145,40 L160,78 L175,78 L190,42 L205,65 L220,38 L235,52 L250,75 L265,30 L280,68 L295,25 L310,50 L325,48 L340,32 L355,20 L370,10";
  return (
    <View style={styles.chartContainer}>
      <View style={styles.yAxis}>
        <Text style={styles.axisText}>1</Text>
        <Text style={styles.axisText}>0.5</Text>
        <Text style={styles.axisText}>0</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Svg height="100" width="100%">
          <Line x1="0" y1="10" x2="380" y2="10" stroke="#E0E0E0" strokeWidth="1" />
          <Line x1="0" y1="50" x2="380" y2="50" stroke="#E0E0E0" strokeWidth="1" />
          <Line x1="0" y1="90" x2="380" y2="90" stroke="#E0E0E0" strokeWidth="1" />
          <Path d={points} fill="none" stroke="#D32F2F" strokeWidth="2" />
          <Circle cx="370" cy="10" r="3" fill="#D32F2F" />
          <Circle cx="355" cy="20" r="3" fill="#D32F2F" />
        </Svg>
        <View style={styles.xAxis}>
          <Text style={styles.axisText}>18:00</Text>
          <Text style={styles.axisText}>18:30</Text>
          <Text style={styles.axisText}>19:00</Text>
          <Text style={styles.axisText}>19:30</Text>
          <Text style={styles.axisText}>20:00</Text>
        </View>
      </View>
    </View>
  );
};

export default function SignosVitalesScreen() {
  const router = useRouter();

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
              <View style={styles.whiteChartBackground}>
                <CustomChart />
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.vitalsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Nivel de Oxígeno</Text>
              <View style={styles.whiteChartBackground}>
                <CustomChart />
              </View>
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
  header: { backgroundColor: '#ffffff', elevation: 0, shadowOpacity: 0 },
  title: { fontWeight: 'bold', marginBottom: 20, color: '#000' },
  vitalsCard: { backgroundColor: '#690909', borderRadius: 28, marginBottom: 24, paddingVertical: 8 },
  cardTitle: { color: '#ffffff', fontWeight: '500', marginBottom: 12, marginLeft: 4 },
  whiteChartBackground: { backgroundColor: '#ffffff', borderRadius: 16, padding: 12, height: 140, justifyContent: 'center' },
  chartContainer: { flexDirection: 'row', alignItems: 'center' },
  yAxis: { justifyContent: 'space-between', height: 90, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#E0E0E0' },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 4 },
  axisText: { fontSize: 10, color: '#757575' },
});