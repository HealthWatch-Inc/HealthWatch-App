import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import {
  Provider as PaperProvider,
  Appbar,
  Text,
  Card,
  Modal,
  Portal,
  FAB,
  Button,
  TextInput,
  IconButton
} from 'react-native-paper';
import { ProgressChart } from 'react-native-chart-kit';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FooterNav from '../components/Footernav';
import { useTelemetria } from '../context/TelemetriaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';
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

const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function ActividadFisicaScreen() {
  const router = useRouter();
  const { theme, Colors, globalStyles, chartConfig } = useTheme();
  const { pacienteId } = useLocalSearchParams();
  const pacienteIdParam = Array.isArray(pacienteId) ? pacienteId[0] : pacienteId;
  const { pasosConteo, reiniciarPasos } = useTelemetria();
  const [visible, setVisible] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [objetivoTemporal, setObjetivoTemporal] = useState('');
  const [dataChart, setDataChart] = useState([0]);

  const styles = StyleSheet.create({
    scrollContent: {
      padding: 8,
    },
    modalInputLabel: {
      marginTop: 12,
      marginBottom: 10,
    },
    activityCard: {
      backgroundColor: '#665200',
      borderRadius: 28,
      paddingVertical: 8,
    },
    cardTitle: {
      color: Colors.white_text,
      fontWeight: '500',
      marginBottom: 12,
      marginLeft: 4,
    },
    cardFlexContainer: {
      flexDirection: 'row', alignItems: 'center',
    },
    deleteIcon: {
      margin: 0
    },
    textContainer: {
      marginLeft: 20,
      justifyContent: 'center',
    },
    infoText: {
      color: Colors.white_text,
      fontSize: 18,
      marginLeft: 4,
      fontWeight: 'bold',
      marginBottom: 13
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 90,
      backgroundColor: '#665200',
      borderRadius: 50,
      zIndex: 10
    },
    inputLabel: {
      fontSize: 14,
      color: '#49454F',
      marginTop: 12,
      marginBottom: 10
    },
    cancelButton: {
      flex: 1,
      marginRight: 8,
      backgroundColor: '#E6E1E5',
      borderRadius: 20
    },
    restartButton: {
      flex: 1,
      marginRight: 8,
      backgroundColor: '#665200',
      borderRadius: 20,
      color: Colors.white_text,
      marginTop: 13
    },
    saveButton: {
      flex: 1,
      marginLeft: 8,
      backgroundColor: Colors.primary,
      borderRadius: 20,
    },
  });

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
    <PaperProvider theme={theme}>
      <SafeAreaView style={[globalStyles.container, { backgroundColor: Colors.backgroundSettings }]}>

        {/* Barra Superior con botón para regresar */}
        <Appbar.Header style={[globalStyles.header, { backgroundColor: Colors.backgroundSettings }]}>
          <Appbar.BackAction onPress={() => router.back()} iconColor={Colors.black} />
          <Appbar.Content
            title={t('common.back')}
            titleStyle={{ color: Colors.black }} />
        </Appbar.Header>

        <ScrollView style={globalStyles.content}>
          <Text variant="headlineMedium" style={[globalStyles.title, { marginBottom: 20 }]}>
            {t('fitness.title')}
          </Text>

          {/* Tarjeta de Pasos (Estilo mostaza/marrón de la imagen) */}
          <AnimatedCard style={styles.activityCard} entering={FadeIn.duration(800)}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Pasos
                </Text>

                <Text variant='titleMedium' style={styles.infoText}>Actual: {pasosConteo}</Text>
                <View style={globalStyles.row}>
                  <Text variant='titleMedium' style={styles.infoText}>Objetivo: {objetivo ? objetivo : 'Por definir'}</Text>
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor={Colors.white_text}
                    onPress={() => borrarObjetivoConfirm()}
                    style={styles.deleteIcon}
                  />
                </View>

                <ProgressChart data={dataChart} width={350} height={210} strokeWidth={16} radius={82} chartConfig={chartConfig} hideLegend={false} />
              </Card.Content>
          </AnimatedCard>

          <Button mode='contained' onPress={reiniciarPasos} style={styles.restartButton} labelStyle={{ color: Colors.white_text }}>{t('fitness.restart')}</Button>
        </ScrollView>

        <FAB icon="plus" style={styles.fab} color='white' onPress={showModal} />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={globalStyles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[globalStyles.modalTitle, { fontSize: 20 }]}>{t('fitness.new_goal')}</Text>

              <Text style={[globalStyles.inputLabel, styles.modalInputLabel]}>{t('fitness.step_goal_label')}</Text>
              <TextInput keyboardType='numeric' placeholder={t('fitness.example_goal')} mode='outlined' style={globalStyles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={objetivoTemporal} onChangeText={handleTextChange} />

              <View style={globalStyles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  {t('common.cancel')}
                </Button>
                <Button mode='contained' onPress={saveObjetivo} style={styles.saveButton} textColor={Colors.white_text}>
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