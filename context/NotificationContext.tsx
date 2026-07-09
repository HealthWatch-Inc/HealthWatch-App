import { useEffect, useState, useContext, createContext } from 'react';
import { StyleSheet, Platform, Alert, View, Text } from 'react-native';
import { apiService } from '@/services/apiService';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

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
     mostrarBanner: (mensaje: string) => void;
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
     // Variables para el banner de notificación
     const [bannerVisible, setBannerVisible] = useState(false);
     const [bannerText, setBannerText] = useState('');
     const [, setMedications] = useState<Medication[]>([]);
     const [notificacionesMostradas, setNotificacionesMostradas] = useState<string[]>([]);

     const mostrarBanner = (mensaje: string) => {
          setBannerText(mensaje);
          setBannerVisible(true);
          setTimeout(() => setBannerVisible(false), 5000);
     };

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

     // Mandar las alarmas nativas
     const actualizarMedicamentos = async (meds: Medication[]) => {
          setMedications(meds);
          await programarAlarmasNativas(meds);
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

     // Escuchar notificaciones cuando la app está abierta
     useEffect(() => {
          const subscription =
               Notifications.addNotificationReceivedListener(notification => {
                    console.log("Notificación recibida en primer plano:", notification.request.content.body)
               });

          return () => subscription.remove();
     })

     // Detectar cuando el usuario toca la notificación
     useEffect(() => {
          const subscription =
               Notifications.addNotificationResponseReceivedListener(response => {
                    console.log("El usuario abrió la app tocando la notificación móvil");

                    // router.push(/contactosScreen)
               });

          return () => subscription.remove();
     }, []);

     return (
          <NotificationContext.Provider value={{ mostrarBanner, actualizarMedicamentos }}>
               {children}
               {bannerVisible && (
                    <View style={styles.banner}>
                         <Text style={styles.bannerText}>
                              {bannerText}
                         </Text>
                    </View>
               )}
          </NotificationContext.Provider>
     );
}

const styles = StyleSheet.create({
     banner: {
          position: 'absolute',
          top: 50,
          left: 20,
          right: 20,
          backgroundColor: '#004A60',
          padding: 16,
          borderRadius: 12,
          elevation: 5,
          zIndex: 999,
     },

     bannerText: {
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
     },
});