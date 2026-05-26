import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { 
  Provider as PaperProvider, 
  MD3LightTheme, 
  Appbar, 
  Text, 
  Card, 
  BottomNavigation 
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';

// Configuración del tema Material Design 3 personalizado
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005b70', // Color del navbar inferior activo
    surfaceVariant: '#690909', // Color guinda de las tarjetas
  },
};

// --- COMPONENTE DEL GRÁFICO (Mockup SVG Simulado) ---
const CustomChart = () => {
  // Simulación de puntos para el gráfico de la imagen
  const points = "M10,60 L25,50 L40,70 L55,55 L70,75 L85,45 L100,55 L115,35 L130,80 L145,40 L160,78 L175,78 L190,42 L205,65 L220,38 L235,52 L250,75 L265,30 L280,68 L295,25 L310,50 L325,48 L340,32 L355,20 L370,10";
  
  return (
    <View style={styles.chartContainer}>
      {/* Eje Y e indicaciones de escala (0, 0.5, 1) */}
      <View style={styles.yAxis}>
        <Text style={styles.axisText}>1</Text>
        <Text style={styles.axisText}>0.5</Text>
        <Text style={styles.axisText}>0</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Svg height="100" width="100%">
          {/* Líneas de cuadrícula de fondo */}
          <Line x1="0" y1="10" x2="380" y2="10" stroke="#E0E0E0" strokeWidth="1" />
          <Line x1="0" y1="50" x2="380" y2="50" stroke="#E0E0E0" strokeWidth="1" />
          <Line x1="0" y1="90" x2="380" y2="90" stroke="#E0E0E0" strokeWidth="1" />
          
          {/* Línea del Gráfico */}
          <Path d={points} fill="none" stroke="#D32F2F" strokeWidth="2" />
          
          {/* Algunos nodos/puntos clave */}
          <Circle cx="370" cy="10" r="3" fill="#D32F2F" />
          <Circle cx="355" cy="20" r="3" fill="#D32F2F" />
        </Svg>
        
        {/* Eje X (Tiempos) */}
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

// --- PANTALLA PRINCIPAL ("Signos Vitales") ---
const SignosVitalesScreen = () => {
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text variant="headlineMedium" style={styles.title}>
        Signos vitales
      </Text>

      {/* Tarjeta: Frecuencia Cardíaca */}
      <Card style={styles.vitalsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Frecuencia Cardiaca
          </Text>
          <View style={styles.whiteChartBackground}>
            <CustomChart />
          </View>
        </Card.Content>
      </Card>

      {/* Tarjeta: Nivel de Oxígeno */}
      <Card style={styles.vitalsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Nivel de Oxígeno
          </Text>
          <View style={styles.whiteChartBackground}>
            <CustomChart />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// --- COMPONENTE RAÍZ CON NAVIGATION ---
export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'inicio', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'datos', title: 'Mis Datos', focusedIcon: 'file-document', unfocusedIcon: 'file-document-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    inicio: SignosVitalesScreen,
    datos: SignosVitalesScreen, // Duplicado para fines demostrativos del tab
  });

  const router = useRouter();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Top App Bar (Header) */}
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Atrás" />
        </Appbar.Header>

        {/* Navegación y Contenido */}
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={styles.bottomBar}
          activeColor="#fff"
          inactiveColor="#b0bec5"
          theme={{ colors: { secondaryContainer: 'transparent' } }} // Remueve la píldora de selección MD3 para ajustarse al mock
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 0, // Remueve sombra en Android
    shadowOpacity: 0, // Remueve sombra en iOS
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '400',
  },
  title: {
    fontWeight: '500',
    marginBottom: 20,
    color: '#000',
  },
  vitalsCard: {
    backgroundColor: '#690909', // Color rojo oscuro / guinda
    borderRadius: 28, // Esquinas redondeadas estilo MD3
    marginBottom: 24,
    paddingVertical: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 12,
    marginLeft: 4,
  },
  whiteChartBackground: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    height: 140,
    justifyContent: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 90,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  axisText: {
    fontSize: 10,
    color: '#757575',
  },
  bottomBar: {
    backgroundColor: '#005b70', // Color azul petróleo inferior
    height: 70,
  },
  
});