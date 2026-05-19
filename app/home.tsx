import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { 
  Text, 
  Appbar, 
  Avatar, 
  Card,
  Provider as PaperProvider 
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Header / Appbar */}
        <Appbar.Header style={styles.header}>
          <Appbar.Action icon="menu" onPress={() => {}} />
          <Appbar.Content title="HealthWatch" titleStyle={styles.headerTitle} />
          <Avatar.Icon size={40} icon="account" style={styles.avatar} color="white" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Bienvenida */}
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Bienvenido, Usuario
          </Text>

          {/* Sección: Panel del usuario */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Panel del usuario
          </Text>
          
          <View style={styles.grid}>
            {/* Tarjeta Signos Vitales */}
            <Card style={[styles.card, { backgroundColor: '#801a1a' }]}>
              <Card.Content>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Signos vitales</Text>
                <Text variant="titleLarge" style={styles.cardValue}>+ 2.9</Text>
              </Card.Content>
            </Card>

            {/* Tarjeta Actividad física */}
            <Card style={[styles.card, { backgroundColor: '#7a6200' }]}>
              <Card.Content>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Actividad física</Text>
                <Text variant="titleLarge" style={styles.cardValue}>+ 500</Text>
              </Card.Content>
            </Card>

            {/* Tarjeta Alertas */}
            <Card style={[styles.card, { backgroundColor: '#003e5c' }]}>
              <Card.Content>
                <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>Alertas y Notificaciones</Text>
              </Card.Content>
            </Card>

            {/* Tarjeta Contacto */}
            <Card style={[styles.card, { backgroundColor: '#6a0050' }]}>
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
                <Text variant="titleLarge" style={styles.cardValue}>70%</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Bottom Navigation (Simulada con estilo Material 3) */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <Text style={styles.navTextActive}>Inicio</Text>
            <View style={styles.activeIndicator} />
          </View>
          <View style={styles.navItem}>
            <Text style={styles.navText}>Mis Datos</Text>
          </View>
        </View>
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