import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Appbar, Text, Card, Modal, Portal, FAB, Button, TextInput, IconButton } from 'react-native-paper';
import { ProgressChart } from 'react-native-chart-kit';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FooterNav from './Footernav';
import { useTelemetria } from '../context/TelemetriaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/apiService';
import { t } from '../utils/i18n';

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
  const { pacienteId } = useLocalSearchParams();
  const pacienteIdParam = Array.isArray(pacienteId) ? pacienteId[0] : pacienteId;
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
    const objetivoNumerico = objetivoTemporal.trim();

    if (!objetivoNumerico) {
      Alert.alert(t('common.error'), t('fitness.incomplete_steps'));
      return;
    }

    try {
      if (pacienteIdParam) {
        await apiService.put(`/api/actividad-fisica/${pacienteIdParam}`, {
          pasos_diarios: Number(objetivoNumerico),
        });
      }

      await AsyncStorage.setItem('@objetivo_pasos', objetivoNumerico);
      setObjetivo(objetivoNumerico);
      hideModal();
    } catch (e) {
      console.error('Error al guardar el objetivo', e);
      Alert.alert(t('common.error'), t('fitness.error_save_goal'));
    }
  };

  const borrarObjetivo = async () => {
    try {
      if (pacienteIdParam) {
        await apiService.delete(`/api/actividad-fisica/${pacienteIdParam}`);
      }

      await AsyncStorage.removeItem('@objetivo_pasos');
      setObjetivo('');
      setDataChart([0]);
      Alert.alert(t('common.success') ?? 'Éxito', t('fitness.goal_deleted') ?? 'Objetivo eliminado');
    } catch (e) {
      console.error('Error al eliminar objetivo', e);
      Alert.alert(t('common.error') ?? 'Error', t('fitness.error_delete_goal') ?? 'No se pudo eliminar el objetivo');
    }
  }

  const borrarObjetivoConfirm = () => {
    Alert.alert(
      t('common.confirmation') ?? 'Confirmar',
      t('fitness.confirm_delete_goal') ?? '¿Eliminar el objetivo de pasos?',
      [
        { text: t('common.cancel') ?? 'Cancelar', style: 'cancel' },
        { text: t('common.delete') ?? 'Eliminar', style: 'destructive', onPress: borrarObjetivo }
      ]
    );
  }

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
        if (pacienteIdParam) {
          const response = await apiService.get(`/api/actividad-fisica/${pacienteIdParam}`);
          const pasos = response?.pasos_diarios;

          if (typeof pasos === 'number' && pasos > 0) {
            const valor = String(pasos);
            setObjetivo(valor);
            await AsyncStorage.setItem('@objetivo_pasos', valor);
            return;
          }
        }

        const objetivoGuardado = await AsyncStorage.getItem('@objetivo_pasos');

        if (objetivoGuardado !== null) {
          setObjetivo(objetivoGuardado);
        }
      } catch (e) {
        console.error('Error al cargar el objetivo', e);
      }
    };

    cargarObjetivo();
  }, [pacienteIdParam]);

  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaView style={styles.safeArea}>

        {/* Barra Superior con botón para regresar */}
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t('common.back')} />
        </Appbar.Header>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>
            {t('fitness.title')}
          </Text>

          {/* Tarjeta de Pasos (Estilo mostaza/marrón de la imagen) */}
          <Card style={styles.activityCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Pasos
              </Text>

              <Text variant='titleMedium' style={styles.infoText}>Actual: {pasosConteo}</Text>
              <View style={styles.goalRow}>
                <Text variant='titleMedium' style={styles.infoText}>Objetivo: {objetivo ? objetivo : 'Por definir'}</Text>
                <IconButton
                  icon="delete"
                  size={20}
                  iconColor='#ffffff'
                  onPress={() => borrarObjetivoConfirm()}
                  style={styles.deleteIcon}
                />
              </View>

              <ProgressChart data={dataChart} width={350} height={210} strokeWidth={16} radius={82} chartConfig={chartConfig} hideLegend={false} />
            </Card.Content>
          </Card>

          <Button mode='contained' onPress={reiniciarPasos} style={styles.restartButton} labelStyle={{ color: '#ffffff' }}>{t('fitness.restart')}</Button>
        </ScrollView>

        <FAB icon="plus" style={styles.fab} color='white' onPress={showModal} />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{t('fitness.new_goal')}</Text>

              <Text style={styles.inputLabel}>{t('fitness.step_goal_label')}</Text>
              <TextInput keyboardType='numeric' placeholder={t('fitness.example_goal')} mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={objetivoTemporal} onChangeText={handleTextChange} />

              <View style={styles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  {t('common.cancel')}
                </Button>
                <Button mode='contained' onPress={saveObjetivo} style={styles.saveButton}>
                  {t('common.save')}
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
  goalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deleteIcon: { margin: 0 },
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