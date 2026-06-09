import { useEffect, useState, useContext, createContext } from 'react';
import { StyleSheet, Platform, Alert, View, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { apiService } from '@/services/apiService';

interface Medication {
  id: string;
  nombre: string;
  horas: string[];
  frecuencia: string;
}


interface NotificationContextType {
  mostrarBanner: (mensaje: string) => void;
  actualizarMedicamentos: (meds: Medication[]) => void;
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
     const [medications, setMedications] = useState<Medication[]>([]);
     const [notificacionesMostradas, setNotificacionesMostradas] = useState<string[]>([]);

     const mostrarBanner = (mensaje: string) => {
          setBannerText(mensaje);
          setBannerVisible(true);

          setTimeout(() => {
               setBannerVisible(false);
          }, 5000);
     };

     const actualizarMedicamentos = (meds: Medication[]) => {
          setMedications(meds);
     }

     useEffect(() => {
          verificarRecordatorios();

          const interval = setInterval(() => {
          verificarRecordatorios();
          }, 60000);

          return () => clearInterval(interval);
     }, [medications, notificacionesMostradas]);

     const verificarRecordatorios = () => {
          const horaActual = new Date()
               .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
               })
               .toLowerCase();

               medications.forEach((med) => {
               const clave = `${med.id}-${horaActual}`;

               if (
                    med.horas.includes(horaActual) &&
                    !notificacionesMostradas.includes(clave)
               ) {

                    if (
                    Platform.OS === 'web' &&
                    Notification.permission === 'granted'
                    ) {
                    new Notification('Recordatorio de Medicamento', {
                         body: `Es hora de administrar ${med.nombre}`,
                    });
                    }

                    mostrarBanner(
                    `Es hora de administrar ${med.nombre}`
                    );

                    setNotificacionesMostradas(prev => [...prev, clave]);
               }
               });
     }

     // Obtiene el token (para móvil)
     useEffect(() => {
          if (Platform.OS !== 'web') {
               obtenerToken();
          }
     }, []);

     // Obtener el token desde la API del navegador
     useEffect(() => {
          if (Platform.OS === 'web' && 'Notification' in window) {
               Notification.requestPermission();
          }
     }, []);

     const obtenerToken = async () => {
          await messaging().requestPermission();

          const token = await messaging().getToken();

          console.log("Token:", token);

          // Enviar a backend
          await apiService.put(`/api/usuarios/fcm-token`, {
               fcm_token: token
          });
     };

     // Escuchar notificaciones cuando la app está abierta
     useEffect(() => {
          if (Platform.OS !== 'web') {
               const unsubscribe = messaging().onMessage(async remoteMessage => {
                    Alert.alert(
                         remoteMessage.notification?.title ?? '',
                         remoteMessage.notification?.body ?? ''
                    );
               });

               return unsubscribe;
          }
     }, []);

     // Detectar cuando el usuario toca la notificación
     useEffect(() => {
          if (Platform.OS !== 'web') {
               messaging().onNotificationOpenedApp(remoteMessage => {
                    console.log('Usuario abrió la notificación');
               });
          }
     }, []);

     return (
          <NotificationContext.Provider value={{mostrarBanner, actualizarMedicamentos}}>
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