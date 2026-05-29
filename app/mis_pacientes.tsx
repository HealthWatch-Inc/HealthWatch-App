import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { Appbar, Text, Avatar, Surface, TouchableRipple, useTheme, MD3LightTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

// Datos simulados de los pacientes según la imagen
const pacientes = [
  { id: '1', nombre: 'PACIENTE 1' },
  { id: '2', nombre: 'PACIENTE 2' },
  { id: '6', nombre: 'PACIENTE 6' },
  { id: '10', nombre: 'PACIENTE 10' },
  { id: '11', nombre: 'PACIENTE 11' },
  { id: '12', nombre: 'PACIENTE 12' },
];

export default function PacientesScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Navbar / Appbar superior */}
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => {}} size={28} />
        <Appbar.Content 
          title="HealthWatch" 
          titleStyle={styles.headerTitle} 
        />
        <Appbar.Action 
          icon={() => <Avatar.Icon size={36} icon="account" style={{backgroundColor:"#ff8a65"}} />} 
          onPress={() => {}} 
        />
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
          {pacientes.map((paciente) => (
            <Surface 
              key={paciente.id} 
              style={styles.card} 
              elevation={1} // MD3 usa niveles de elevación sutiles
            >
              <TouchableRipple
                onPress={() => router.push('/home')}
                style={styles.ripple}
                accessibilityRole="button"
                accessibilityLabel={`Ver expediente de ${paciente.nombre}`}
                borderless
              >
                <View style={styles.cardContent}>
                  {/* Icono de usuario en un círculo blanco */}
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="account" size={60} color="#00506b" />
                  </View>
                  <Text variant="labelLarge" style={styles.patientName}>
                    {paciente.nombre}
                  </Text>
                </View>
              </TouchableRipple>
            </Surface>
          ))}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.02, // Ligeramente rectangular vertical como la imagen
    backgroundColor: '#00506b', // Color azul oscuro/verdoso del diseño original
    borderRadius: 28, // Bordes muy redondeados característicos de MD3 (Extra Large)
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