import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Appbar, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import FooterNav from './footernav';

// --- PANTALLA PRINCIPAL: Actividad Física ---
export default function ActividadFisicaScreen() {
  const router = useRouter();

  // Datos reflejados en la imagen
  const pasosActuales = 2500;
  const pasosObjetivo = 4300;

  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Barra Superior con botón para regresar */}
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Atrás" />
        </Appbar.Header>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>
            Actividad Física
          </Text>

          {/* Tarjeta de Pasos (Estilo mostaza/marrón de la imagen) */}
          <Card style={styles.activityCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Pasos
              </Text>
              
              <View style={styles.cardFlexContainer}>
                {/* Lado Derecho: Textos Informativos */}
                <View style={styles.textContainer}>
                  <Text variant="bodyLarge" style={styles.infoText}>
                    Actual: <Text style={styles.boldText}>{pasosActuales}</Text>
                  </Text>
                  <Text variant="bodyLarge" style={styles.infoText}>
                    Objetivo: <Text style={styles.boldText}>{pasosObjetivo}</Text>
                  </Text>
                </View>
              </View>

            </Card.Content>
          </Card>
        </ScrollView>
        
        <FooterNav activeTab="inicio" />
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 0,
    // shadowOpacity: 0,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  activityCard: {
    backgroundColor: '#665200', // Tono ocre / marrón verdoso exacto de tu captura
    borderRadius: 28, // Curvatura estándar Material Design 3
    paddingVertical: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 16,
    marginLeft: 4,
  },
  cardFlexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteRingBackground: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  centerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 18,
    marginVertical: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#ffffff'
  },
});