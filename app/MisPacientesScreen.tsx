import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Appbar, Text, Avatar, Surface, TouchableRipple, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { apiService } from '@/services/apiService';
import { auth } from '@/config/firebase';

export default function PacientesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        if (!auth.currentUser) return;
        const lista = await apiService.get('/api/pacientes/');
        setPacientes(lista.pacientes ?? []);
      } catch (error) {
        console.log('Error cargando pacientes', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPacientes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Navbar / Appbar superior */}
      <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={() => {}} />

      <Appbar.Content
        title="HealthWatch"
        titleStyle={styles.headerTitle}
      />

      <TouchableOpacity
        onPress={() => {
          setTimeout(() => {
            router.push({ pathname: '/AjustesScreen' });
          }, 1);
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Ir a configuración de cuenta"
      >
        <Avatar.Icon
          size={40}
          icon="account"
          style={{
            backgroundColor: '#ff8a65',
            marginRight: 16,
          }}
          // Le indicamos que el avatar interno es puramente decorativo
          importantForAccessibility="no" 
        />
      </TouchableOpacity>
    </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección de Bienvenida */}
        <View style={styles.welcomeContainer}>
          <Text variant="headlineLarge" style={styles.welcomeText}>
            Bienvenido/a
          </Text>
          <Text variant="titleMedium" style={styles.subtitleText}>
            Mis pacientes
          </Text>
        </View>

        {/* Grid de Pacientes */}
        <View style={styles.gridContainer}>
          {cargando ? (
            <Text variant="bodyLarge" style={styles.loadingText}>
              Cargando tus pacientes...
            </Text>
          ) : pacientes.length === 0 ? (
            <Text variant="bodyLarge" style={styles.loadingText}>
              No se encontraron pacientes registrados.
            </Text>
          ) : (
            pacientes.map((paciente) => (
              <Surface 
                key={paciente.id} 
                style={styles.card} 
                elevation={1} // MD3 usa niveles de elevación sutiles
              >
                <TouchableRipple
                  onPress={() => 
                    router.push({
                      pathname: '/PrincipalScreen',
                      params: { 
                        pacienteId: paciente.id,
                        nombre: paciente.nombre_completo || 'Paciente desconocido' 
                      }
                    })
                  }
                  style={styles.ripple}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver expediente de ${paciente.nombre_completo || 'paciente'}`}
                  borderless
                >
                  <View style={styles.cardContent}>
                    {/* Icono de usuario en un círculo blanco */}
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons name="account" size={60} color="#00506b" />
                    </View>
                    <Text variant="labelLarge" style={styles.patientName}>
                      {paciente.nombre_completo || 'Paciente desconocido'}
                    </Text>
                    <Text variant="labelLarge" style={styles.patientName}>
                      Edad: {paciente.edad} años
                    </Text>
                  </View>
                </TouchableRipple>
              </Surface>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Cálculo del ancho para mantener un grid de 2 columnas exactas con espaciado
const widthScreen = Dimensions.get('window').width;
const cardWidth = (widthScreen - 86) / 2; // 48 es el total de padding lateral e intermedio

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fondo limpio característico de MD3
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 0, // Sin sombra marcada abajo del header en MD3 plano
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1d1b20',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  welcomeContainer: {
    marginVertical: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#1d1b20',
    marginBottom: 16,
  },
  subtitleText: {
    fontWeight: 'bold',
    color: '#1d1b20',
  },
  loadingText: {
    width: '100%',
    textAlign: 'center',
    color: '#1d1b20',
    marginVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    aspectRatio: 1,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#00506b',
    borderRadius: 28,
    marginBottom: 16,
    overflow: 'hidden',
  },
  ripple: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});