import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Appbar,
  Avatar,
  Card,
  Provider as PaperProvider
} from 'react-native-paper';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FooterNav from '../components/Footernav';
import { useTelemetria } from '../context/TelemetriaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePaciente } from '@/context/PacienteContext';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AnimatedCard from '@/components/AnimatedCard';
import { useTheme } from '@/context/ThemeContext';
import { t } from '../utils/i18n';

const App = () => {
  const router = useRouter();
  const { pacienteId, nombre } = useLocalSearchParams();
  const { telemetriaActual } = useTelemetria();
  const { setPacienteId } = usePaciente();
  const { theme, Colors, globalStyles } = useTheme();

  // Estado para objetivo y pasos en la pantalla Home
  const [objetivoHome, setObjetivoHome] = useState('');
  const [pasosHome, setPasosHome] = useState(0);

  useEffect(() => {
    setPacienteId(pacienteId as string | undefined);
  }, [pacienteId, setPacienteId]);

  useFocusEffect(
    useCallback(() => {
      const obtenerDatosPersistidos = async () => {
        try {
          const objGuardado = await AsyncStorage.getItem('@objetivo_pasos');
          const pasosGuardados = await AsyncStorage.getItem('@pasos_conteo');

          if (objGuardado !== null && objGuardado !== '') {
            setObjetivoHome(objGuardado);
          } else {
            setObjetivoHome('');
          }

          if (pasosGuardados !== null) {
            setPasosHome(parseInt(pasosGuardados, 10));
          } else {
            setPasosHome(0);
          }
        } catch (e) {
          console.error("Error al leer AsyncStorage en Home", e);
        }
      };

      obtenerDatosPersistidos();
    }, [])
  );

  console.log("telemetriaActual:", telemetriaActual);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={globalStyles.container}>
        {/* Header / Appbar */}
        <Appbar.Header style={globalStyles.header}>
          <Appbar.Action icon="menu" onPress={() => { }} />
          <Appbar.Content title={t('patients.app_name')} titleStyle={globalStyles.headerTitle} />
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/AjustesScreen' })}
            activeOpacity={0.7}
          >
            <Avatar.Icon
              size={40}
              icon="account"
              style={globalStyles.avatar}
              color="white"
            />
          </TouchableOpacity>
        </Appbar.Header>

        <ScrollView style={globalStyles.content}>
          <Text variant="headlineMedium" style={globalStyles.title}>
            {t('home.patient_label')}: {nombre || t('patients.unknown_patient')}
          </Text>

          {/* Sección: Panel del usuario */}
          <Text variant="titleMedium" style={[globalStyles.title, { fontSize: 18 }]}>
            {t('home.user_panel')}
          </Text>

          <View style={styles.grid}>
            <AnimatedCard
              onPress={() => {
                router.push({
                  pathname: "/SignosVitalesScreen",
                  params: { pacienteId, nombre }
                });
              }}
              background={"#801a1a"}
              delay={0}
            >
              <Card.Content>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>{t('home.vital_signs')}</Text>
                <Text variant="titleLarge" style={styles.cardValue}>{telemetriaActual?.heart_rate.toFixed(2) ?? '--'}</Text>
              </Card.Content>
            </AnimatedCard>

            {/* Tarjeta Actividad física */}
            <AnimatedCard
              onPress={() =>
                router.push("/ActividadFisicaScreen")
              }
              background={"#7a6200"}
              delay={100}
            >
              <Card.Content>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>{t('home.physical_activity')}</Text>
                <Text variant="titleLarge" style={styles.cardValue}>{t('fitness.goal')}: {objetivoHome || t('fitness.not_defined')} </Text>
              </Card.Content>
            </AnimatedCard>

            <AnimatedCard
              onPress={() => router.push({
                pathname: '/AlertasScreen',
                params: { pacienteId, nombre }
              })}
              background={"#003e5c"}
              delay={200}
            >
              <Card.Content>
                <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>{t('home.alerts_notifications')}</Text>
              </Card.Content>
            </AnimatedCard>

            <AnimatedCard
              onPress={() => router.push({
                pathname: '/ContactosScreen',
                params: { pacienteId }
              })}
              background={"#6a0050"}
              delay={300}
            >
              <Card.Content>
                <MaterialCommunityIcons name="bell-ring-outline" size={24} color="white" />
                <Text variant="labelLarge" style={styles.cardLabel}>{t('home.emergency_contact')}</Text>
              </Card.Content>
            </AnimatedCard>
          </View>

          {/* Sección: Datos del dispositivo */}
          <Text variant="titleMedium" style={[globalStyles.title, { marginTop: 24 }]}>
            {t('home.device_data')}
          </Text>

          <AnimatedCard
            background="#3d7a3d"
            delay={400}
            fullWidth
          >
            <Card.Content style={styles.wideCardContent}>
              <MaterialCommunityIcons name="battery-70" size={24} color="white" />
              <View style={{ marginLeft: 12 }}>
                <Text variant="labelLarge" style={styles.cardLabel}>
                  {t('home.watch_battery')}
                </Text>
                <Text variant="titleLarge" style={styles.cardValue}>
                  {telemetriaActual?.battery || 0}%
                </Text>
              </View>
            </Card.Content>
          </AnimatedCard>
        </ScrollView>
        <FooterNav activeTab="inicio" />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    height: 120,
    marginBottom: 16,
    borderRadius: 28,
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
});

export default App;