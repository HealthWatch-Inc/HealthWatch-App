import { useEffect, useState, useRef, useContext, createContext } from 'react';
import { Platform } from 'react-native';
import { apiService } from '@/services/apiService';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useTelemetria } from './TelemetriaContext';
import { useRouter } from 'expo-router';
import { usePaciente } from './PacienteContext';
import type { Medication, NotificationContextType, NotificationContextProps } from '@/types/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationBanner = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotificationBanner debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: NotificationContextProps) => {
  const { pacienteId } = usePaciente();
  const router = useRouter();
  const [, setMedications] = useState<Medication[]>([]);
  const { refreshTelemetria } = useTelemetria();

  const ultimaCaidaRef = useRef<string | null>(null);
  const ultimaClasificacionRef = useRef<string | null>(null);

  const programarAlarmasNativas = async (meds: Medication[]) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const med of meds) {
      for (const horaStr of med.horas ?? []) {
        const [horas, minutos] = horaStr.split(':').map(Number);

        if (Number.isNaN(horas) || Number.isNaN(minutos)) {
          continue;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Recordatorio de Medicamento",
            body: `Es hora de administrar ${med.nombre}`,
            sound: true,
            data: { tipo: 'medicamento' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: horas,
            minute: minutos,
            channelId: 'medicamentos'
          },
        });
      }
    }
  };

  // Polling para consultar alertas del paciente
  const consultarEstadoAlertas = async () => {
    if (!pacienteId) return;

    try {
      const response = await apiService.get(`/api/pacientes/${pacienteId}`);
      const data = response.paciente ?? response;

      // ==========================================
      // LECTURA DE DATO: CAÍDA
      // ==========================================
      const esCaida = data?.ultima_deteccion_caida === true;
      const probCaida = data?.ultima_probabilidad_caida ?? 0;
      const timeCaida = data?.ultima_actualizacion_caida;
      const nuevaCaida = esCaida && timeCaida && timeCaida !== ultimaCaidaRef.current;

      // ==========================================
      // LECTURA DE DATO: ANOMALÍA CARDÍACA / SALUD
      // ==========================================
      const clasificacion = data?.ultima_clasificacion; // "okay", "warning", "bad"
      const timeML = data?.ultima_actualizacion_ml;
      const esAnomaliaSalud = clasificacion === 'warning' || clasificacion === 'bad';
      const nuevaAnomalia = esAnomaliaSalud && timeML && timeML !== ultimaClasificacionRef.current;

      // ==========================================
      // EVALUACIÓN DE REGLAS Y NOTIFICACIONES
      // ==========================================

      // CASO 1: EMERGENCIA CRÍTICA (Caída + Anomalía Cardíaca/Fisiológica juntas)
      if (nuevaCaida && nuevaAnomalia) {
        ultimaCaidaRef.current = timeCaida;
        ultimaClasificacionRef.current = timeML;

        console.log('[Notificaciones] 🚨 EMERGENCIA COMBINADA: Caída + Anomalía de Salud');

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚨 EMERGENCIA CRÍTICA',
            body: `Se ha detectado una caída provocada por una descompensación/anomalía cardíaca. ¡Revise de inmediato!`,
            sound: true,
            data: { tipo: 'emergencia' },
          },
          trigger: null,
        });
        refreshTelemetria();
        return;
      }

      // CASO 2: SOLO CAÍDA FÍSICA
      if (nuevaCaida) {
        ultimaCaidaRef.current = timeCaida;
        console.log('[Notificaciones] ⚠️ CAÍDA NUEVA DETECTADA');

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚨 Posible caída detectada',
            body: `Se ha detectado una caída con ${(probCaida * 100).toFixed(1)}% de probabilidad.`,
            sound: true,
            data: { tipo: 'caida' },
          },
          trigger: null,
        });
        refreshTelemetria();
      }

      // CASO 3: SOLO ANOMALÍA EN SIGNOS VITALES / CARDÍACA
      if (nuevaAnomalia) {
        ultimaClasificacionRef.current = timeML;
        console.log('[Notificaciones] ⚠️ ALERTA DE SALUD DETECTADA');

        let titulo = '⚠️ Alerta de Signos Vitales';
        let mensaje = 'El paciente presenta signos fuera de rango.';

        if (clasificacion === 'bad') {
          titulo = '🚨 Anomalía Cardíaca / Salud Crítica';
          mensaje = 'El paciente presenta arritmia, taquicardia o estrés severo.';
        } else {
          titulo = '⚠️ Precaución - Signos Inestables';
          mensaje = 'El paciente muestra alteraciones moderadas en sus signos vitales.';
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: titulo,
            body: mensaje,
            sound: true,
            data: { tipo: 'signos' },
          },
          trigger: null,
        });
        refreshTelemetria();
      }

    } catch (error) {
      console.error('[Notificaciones] Error consultando estado:', error);
    }
  };

  useEffect(() => {
    if (!pacienteId) return;

    consultarEstadoAlertas();

    const intervalo = setInterval(() => {
      consultarEstadoAlertas();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [pacienteId]);

  const actualizarMedicamentos = async (meds: Medication[]) => {
    setMedications(meds);
    await programarAlarmasNativas(meds);
  };

  const configurarCanalAndroid = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medicamentos', {
        name: 'Recordatorios de Medicamentos',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#004a60'
      });
    }
  };

  const obtenerToken = async () => {
    if (!Device.isDevice) {
      console.log("Las modificaciones push requieren un dispositivo físico.");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permiso denegado");
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      throw new Error("No se encontró el projectId de Expo.");
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    console.log("Expo Token: ", token);

    await apiService.put("/api/usuarios/expo-token", {
      expo_token: token,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await configurarCanalAndroid();
        await obtenerToken();
      }
    });

    return unsubscribe;
  }, []);

  // Escuchar notificaciones cuando la app está abierta
  useEffect(() => {
    const subscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        const tipo = notification.request.content.data?.tipo as string | undefined;

        if (tipo && ['caida', 'emergencia', 'signos'].includes(tipo)) {
          await refreshTelemetria();
        }
      });

    return () => subscription.remove();
  }, [refreshTelemetria]);

  // Detectar cuando el usuario toca la notificación
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        console.log("El usuario abrió la app tocando la notificación móvil");
        router.push('/AlertasScreen');
      });

    return () => subscription.remove();
  }, []);

  return (
    <NotificationContext.Provider value={{ actualizarMedicamentos }}>
      {children}
    </NotificationContext.Provider>
  );
};