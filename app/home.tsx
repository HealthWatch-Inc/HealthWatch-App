import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Appbar, 
  Avatar, 
  Card,
  Provider as PaperProvider 
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FooterNav from './footernav';
import { apiService } from '@/services/apiService';

interface Telemetria {
  heart_rate: number;
  spo2: number;
  battery: number;
  ax: number;
  ay: number;
  az: number;
}

const App = () => {
  const router = useRouter();
  const { pacienteId, nombre } = useLocalSearchParams();

  const [telemetrias, setTelemetrias] = useState<Telemetria[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cargar telemetrías desde la API
  useEffect(() => {
    const cargarTelemetria = async () => {
      try {
        if (!pacienteId) return;

        const response = await apiService.get(
          `/api/pacientes/${pacienteId}/telemetria`
        );

        setTelemetrias(response.telemetria ?? []);

        // console.log(
        //   'Telemetría del paciente:',
        //   response.telemetria
        // );

        // console.log(
        //   'Total de registros de telemetría:',
        //   response.total_registros
        // );
      } catch (error) {
        console.log('Error cargando telemetría', error);
      }
    };

    cargarTelemetria();
  }, [pacienteId]);

  // Simulación de tiempo real
  useEffect(() => {
    if (telemetrias.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        (prev + 1) % telemetrias.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [telemetrias]);

  // Registro actual mostrado en pantalla
  const telemetriaActual =
    telemetrias.length > 0
      ? telemetrias[currentIndex]
      : null;

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Header / Appbar */}
        <Appbar.Header style={styles.header}>
          <Appbar.Action icon="menu" onPress={() => {}} />
          <Appbar.Content title="HealthWatch" titleStyle={styles.headerTitle} />
          <TouchableOpacity 
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Avatar.Icon 
              size={40} 
              icon="account" 
              style={styles.avatar} 
              color="white"
            />
          </TouchableOpacity>
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Bienvenida */}
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Paciente: {nombre || 'Paciente'}
          </Text>

          {/* Sección: Panel del usuario */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Panel del usuario
          </Text>
          
          <View style={styles.grid}>
            {/* Tarjeta Signos Vitales */}
            <Card style={[styles.card, { backgroundColor: '#801a1a' }]} onPress={() => router.push('/vital_signs')}>
              <Card.Content>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Signos vitales</Text>
                <Text variant="titleLarge" style={styles.cardValue}>{telemetriaActual?.heart_rate ?? '--'}</Text>
              </Card.Content>
            </Card>

            {/* Tarjeta Actividad física */}
            <Card style={[styles.card, { backgroundColor: '#7a6200' }]} onPress={() => router.push('/fisica')}>
              <Card.Content>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Actividad física</Text>
                <Text variant="titleLarge" style={styles.cardValue}>+ 500</Text>
              </Card.Content>
            </Card>

            {/* Tarjeta Alertas */}
            <Card style={[styles.card, { backgroundColor: '#003e5c' }]} onPress={() => router.push('/alerts')}>
              <Card.Content>
                <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Alertas y Notificaciones</Text>
              </Card.Content>
            </Card>

            {/* Tarjeta Contacto */}
            <Card style={[styles.card, { backgroundColor: '#6a0050' }]} onPress={() => router.push('/contact')}>
              <Card.Content>
                <MaterialCommunityIcons name="bell-ring-outline" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Contacto de emergencia</Text>
              </Card.Content>
            </Card>
          </View>

          {/* Sección: Datos del dispositivo */}
          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>
            Datos del dispositivo
          </Text>
          
          <Card style={[styles.wideCard, { backgroundColor: '#3d7a3d' }]}>
            <Card.Content style={styles.wideCardContent}>
              <MaterialCommunityIcons name="battery-70" size={24} color="white" />
              <View style={{ marginLeft: 12 }}>
                <Text variant="labelLarge" style={styles.cardLabel}>Batería del reloj</Text>
                <Text variant="titleLarge" style={styles.cardValue}>{telemetriaActual?.battery || 0}%</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        <FooterNav activeTab="inicio" />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    justifyContent: 'space-between',
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: '400',
    color: '#1a1a1a'
  },
  avatar: {
    backgroundColor: '#ff8a65',
    marginRight: 16,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 120,
    marginBottom: 16,
    borderRadius: 28, // Estilo redondeado de Material 3
    justifyContent: 'center',
  },
  wideCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#2e7d32',
  },
  wideCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardLabel: {
    color: 'white',
    marginTop: 8,
    lineHeight: 16,
  },
  cardValue: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomNav: {
    height: 80,
    backgroundColor: '#004d61',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#ffffffaa',
    fontWeight: '500',
  },
  navTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeIndicator: {
    height: 3,
    width: 30,
    backgroundColor: 'white',
    marginTop: 4,
    borderRadius: 2,
  },
});

export default App;