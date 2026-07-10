import { useEffect, useState, useRef ,useContext, createContext } from 'react';
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

// Propiedades nativas para las notificaciones
Notifications.setNotificationHandler({
     handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
     }),
});

interface Medication {
     id: string;
     nombre: string;
     horas: string[];
     frecuencia: string;
}

interface NotificationContextType {
     actualizarMedicamentos: (meds: Medication[]) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationBanner = () => {
     const context = useContext(NotificationContext);

     if (!context) {
          throw new Error('useNotificationBanner debe usarse dentro de NotificationProvider');
     }
     return context;
};

interface NotificationContextProps {
     children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationContextProps) => {
     const { pacienteId } = usePaciente();
     const router = useRouter();
     const fallIdsMostradosRef = useRef<string[]>([]);
     const [time, setTime] = useState(new Date());
     
     const [, setMedications] = useState<Medication[]>([]);
     const { refreshTelemetria } = useTelemetria();

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

     // Mostrar las caídas detectadas
     const cargarCaidasDetectadas = async () => {
         if (!pacienteId) return;
     
         try {
           const response = await apiService.get(
             `/api/pacientes/${pacienteId}/telemetria?limite=50`
           );
           const telemetrias = response.telemetria ?? [];

           const nuevasCaidas = telemetrias
             .filter((item: any) => {
               const ax = Number(item.ax ?? 0);
               const ay = Number(item.ay ?? 0);
               const az = Number(item.az ?? 0);
     
               return (
                 Math.abs(ax) >= 20 ||
                 Math.abs(ay) >= 20 ||
                 Math.abs(az) <= 6
               );
             })
             .map((item: any) => {
               const rawTime = String(item.time ?? '');
               const timestamp = new Date(rawTime.replace(' ', 'T'));
               const time = isNaN(timestamp.getTime())
                 ? rawTime
                 : timestamp.toLocaleTimeString('es-ES', {
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: true
                 });
               const date = isNaN(timestamp.getTime())
                 ? rawTime
                 : timestamp.toLocaleDateString('es-ES');
     
               return {
                 id: rawTime || `${item.ax}-${item.ay}-${item.az}`,
                 time,
                 date,
               };
             });

           const nuevas = nuevasCaidas.filter(
             (item: any) => !fallIdsMostradosRef.current.includes(item.id)
           );
     
                          if (nuevas.length > 0) {
             fallIdsMostradosRef.current = [
               ...fallIdsMostradosRef.current,
               ...nuevas.map((item: any) => item.id),
             ];
     
             await Notifications.scheduleNotificationAsync({
               content: {
                    title: 'Posible caída detectada',
                    body: 'Se ha detectado una posible caída del paciente',
                    sound: true,
               },
               trigger: null,
             });

                              // Forzar actualización inmediata de telemetría para que los
                              // listeners (p. ej. TelemetriaProvider) capturen el nuevo evento.
                              try {
                                   await refreshTelemetria();
                              } catch (e) {
                                   console.error('Error forzando refresh de telemetría:', e);
                              }
           }
         } catch (error) {
           console.error('Error cargando caídas detectadas:', error);
         }
       };

     // Mandar las alarmas nativas
     const actualizarMedicamentos = async (meds: Medication[]) => {
          setMedications(meds);
          await programarAlarmasNativas(meds);
     };

     const configurarCanalAndroid = async () => {
          if (Platform.OS === 'android') {
               await Notifications.setNotificationChannelAsync('medicamentos', {
                    name: 'Recordatorios de Medicamentos',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern:[0, 250, 250, 250],
                    lightColor: '#004a60'
               });
          }
     }

     const obtenerToken = async () => {
          if (!Device.isDevice) {
               console.log("Las modificaciones push requieren un dispositivo físico.");
               return;
          }

          const { status: existingStatus } =
               await Notifications.getPermissionsAsync();

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
     
     // Obtiene el token (para móvil)
     useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
               if (user) {
                    await configurarCanalAndroid();
                    await obtenerToken();
               }
          })

          return unsubscribe;
     }, []);

     // Escuchar notificaciones cuando la app está abierta
     useEffect(() => {
          const subscription =
               Notifications.addNotificationReceivedListener(async (notification) => {
                    console.log("Notificación recibida en primer plano:", notification.request.content.body);

                    try {
                      await refreshTelemetria();
                    } catch (e) {
                      console.error('Error al refrescar telemetría al recibir notificación:', e);
                    }
               });

          return () => subscription.remove();
     }, [refreshTelemetria])


     // Detectar cuando el usuario toca la notificación
     useEffect(() => {
          const subscription =
               Notifications.addNotificationResponseReceivedListener(response => {
                    console.log("El usuario abrió la app tocando la notificación móvil");

                    router.push('/AlertasScreen')
               });

          return () => subscription.remove();
     }, []);

     useEffect(() => {
          
          console.log("Paciente actual:", pacienteId);
          
          if (!pacienteId) return;

          cargarCaidasDetectadas();

          const interval = setInterval(() => {
               cargarCaidasDetectadas();
          }, 5000);

          return () => clearInterval(interval);

     }, [pacienteId]);

     const formatHour = (date: Date) => {
          const h = String(date.getHours()).padStart(2, '0');
          const m = String(date.getMinutes()).padStart(2, '0');
          return `${h}:${m}`;
     }

     return (
          <NotificationContext.Provider value={{ actualizarMedicamentos }}>
               {children}
          </NotificationContext.Provider>
     );
}
