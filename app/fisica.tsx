import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Appbar, Text, Card, Modal, Portal, FAB, Button, TextInput } from 'react-native-paper';
import { ProgressChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import FooterNav from './footernav';
import { useTelemetria } from '../context/TelemetriaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
  Simulación de pasos para actividad física:
  Modelo matemático para procesamiento de señales y suavizar datos, eliminar ruido de alta frecuencia y que pasen las frecuencias por un límite establecido (frecuencia de corte)

  Filtro utilizado: Filtro Exponencial (IIR de un polo)
  Sistema procesador de señales recursivo, depende del valor de entrada como de salida, por un único polo en el plano Z

  Ventaja: Bajo costo computacional, consume menos recursos.

  \(y[n] = \alpha \cdot x[n] + (1 - \alpha)\cdot y[n-1]\)
  
  y[n]: Valor filtrado actual (salida).
  x[n]: Valor crudo o medido actual (entrada).
  y[n-1]: Valor filtrado anterior.
  α: Factor de suavizado (un valor entre 0 y 1).

  Un α cercano a 0 (ej. 0.05) genera un filtrado muy fuerte y lento (ideal para eliminar mucho ruido).
  
  Un α cercano a 1 (ej. 0.8) genera un filtrado rápido que reacciona casi de inmediato a los cambios (ideal para señales dinámicas).
*/

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

export default function ActividadFisicaScreen() {
  const router = useRouter();
  const { pasosConteo, reiniciarPasos } = useTelemetria();
  const [visible, setVisible] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [objetivoTemporal, setObjetivoTemporal] = useState('');

  // Estado de ProgressChart
  const [dataChart, setDataChart] = useState([0]);

  const showModal = () => {
    setObjetivoTemporal(objetivo);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const saveObjetivo = async () => {
    try {
      await AsyncStorage.setItem('@objetivo_pasos', objetivoTemporal);
      setObjetivo(objetivoTemporal);
      hideModal();
    } catch (e) {
      console.error("Error al guardar el objetivo", e);
    }
  };

  useEffect(() => {
    const objNum = parseInt(objetivo, 10);
    if (!isNaN(objNum) && objNum > 0) {
      // Porcentaje de progreso
      const progreso = pasosConteo / objNum;
      setDataChart([Math.min(progreso, 1)])
    } else {
      setDataChart([0]);
    }
  }, [pasosConteo, objetivo]);

  const handleTextChange = (text: string) => {
    // Solo dígitos de 0 a 9
    const cleanNumber = text.replace(/[^0-9]/g, '');
    setObjetivoTemporal(cleanNumber);
  }

  useEffect(() => {
    const cargarObjetivo = async () => {
      try {
        const objetivoGuardado = await AsyncStorage.getItem('@objetivo_pasos');

        if (objetivoGuardado !== null) {
          setObjetivo(objetivoGuardado);
        }
      } catch (e) {
        console.error("Error al cargar el objetivo", e);
      }
    };

    cargarObjetivo();
  }, []);

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

              <Text variant='titleMedium' style={styles.infoText}>Actual: {pasosConteo}</Text>
              <Text variant='titleMedium' style={styles.infoText}>Objetivo: {objetivo ? objetivo : 'Por definir'}</Text>

              <ProgressChart data={dataChart} width={350} height={210} strokeWidth={16} radius={82} chartConfig={chartConfig} hideLegend={false} />
            </Card.Content>
          </Card>

          <Button mode='contained' onPress={reiniciarPasos} style={styles.restartButton} labelStyle={{ color: '#ffffff' }}> Reiniciar conteo de pasos</Button>
        </ScrollView>

        <FAB icon="plus" style={styles.fab} color='white' onPress={showModal} />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Nuevo objetivo</Text>

              <Text style={styles.inputLabel}>Cantidad de pasos final</Text>
              <TextInput keyboardType='numeric' placeholder='Ej. 1000' mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={objetivoTemporal} onChangeText={handleTextChange} />

              <View style={styles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  Cancelar
                </Button>
                <Button mode='contained' onPress={saveObjetivo} style={styles.saveButton}>
                  Guardar
                </Button>
              </View>
            </ScrollView>
          </Modal>
        </Portal>

        <FooterNav activeTab="inicio" />
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff', },
  container: { flex: 1, backgroundColor: '#ffffff', },
  scrollContent: { padding: 16, },
  header: { backgroundColor: '#ffffff', elevation: 0, },
  title: { fontWeight: 'bold', marginBottom: 20, color: '#000', },
  activityCard: { backgroundColor: '#665200', borderRadius: 28, paddingVertical: 8, },
  cardTitle: { color: '#ffffff', fontWeight: '500', marginBottom: 12, marginLeft: 4, },
  cardFlexContainer: {
    flexDirection: 'row', alignItems: 'center',
  },
  textContainer: { marginLeft: 20, justifyContent: 'center', },
  infoText: { color: '#ffffff', fontSize: 22, marginLeft: 4, fontWeight: 'bold', marginBottom: 13 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 90, backgroundColor: '#665200', borderRadius: 50, zIndex: 10 },
  modalContainer: { backgroundColor: 'white', padding: 24, margin: 20, borderRadius: 28, maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1D1B20', marginBottom: 16 },
  inputLabel: { fontSize: 14, color: '#49454F', marginTop: 12, marginBottom: 10 },
  input: { backgroundColor: '#F4EFF4', marginBottom: 8, },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, },
  cancelButton: { flex: 1, marginRight: 8, backgroundColor: '#E6E1E5', borderRadius: 20 },
  restartButton: { flex: 1, marginRight: 8, backgroundColor: '#665200', borderRadius: 20, color: '#ffffff', marginTop: 13 },
  saveButton: { flex: 1, marginLeft: 8, backgroundColor: '#004A60', borderRadius: 20, },
});
