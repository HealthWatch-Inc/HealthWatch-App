import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Appbar, Text, Avatar, Surface, TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { apiService } from '@/services/apiService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { auth } from '@/config/firebase';
import { useTheme } from '@/context/ThemeContext';

interface Usuario {
  uid: string;
  nombre_completo: string,
  correo: string;
  rol: string;
  telefono: string;
}

export default function PacientesScreen() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const { Colors, globalStyles, isDark } = useTheme();

  const styles = StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    welcomeContainer: {
      marginVertical: 10,
    },
    loadingText: {
      width: '100%',
      textAlign: 'center',
      color: Colors.modal,
      marginVertical: 20,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      aspectRatio: 1,
    },
    card: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: Colors.primary,
      borderRadius: 28,
      marginBottom: 16,
      overflow: 'hidden',
    },
    ripple: {
      flex: 1,
    },
    cardContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    patientName: {
      color: Colors.white,
      fontWeight: '700',
      letterSpacing: 0.5,
      textAlign: 'center',
    },
  });

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        if (!auth.currentUser) return;
        const lista = await apiService.get('/api/pacientes/');
        setPacientes(lista.pacientes ?? []);
      } catch (error) {
        console.log('Error cargando pacientes', error);
      } finally {
        setCargando(false);
      }
    };
    cargarPacientes();
  }, []);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await apiService.get("/api/usuarios/me");
        setUsuario(perfil);
      } catch (error) {
        console.error('Error cargando usuario en settings:', error);
      }
    };
    cargarPerfil();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={Colors.white} />

      {/* Navbar / Appbar superior */}
      <Appbar.Header style={globalStyles.header}>
        <Appbar.Action icon="menu" onPress={() => { }} />

        <Appbar.Content
          title="HealthWatch"
          titleStyle={globalStyles.headerTitle}
        />

        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
              router.push({ pathname: '/AjustesScreen' });
            }, 1);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ir a configuración de cuenta"
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
        {/* Sección de Bienvenida */}
        <View>
          <Text variant="headlineLarge" style={globalStyles.title}>
            Usuario: {usuario?.nombre_completo}
          </Text>
          <Text variant="titleMedium" style={[globalStyles.title, {fontSize: 18}]}>
            Mis pacientes
          </Text>
        </View>

        {/* Grid de Pacientes */}
        <View style={styles.gridContainer}>
          {cargando ? (
            <Text variant="bodyLarge" style={styles.loadingText}>
              Cargando tus pacientes...
            </Text>
          ) : pacientes.length === 0 ? (
            <Text variant="bodyLarge" style={styles.loadingText}>
              No se encontraron pacientes registrados.
            </Text>
          ) : (
            // pacientes.map((paciente) => (
            //   <Surface
            //     key={paciente.id}
            //     style={styles.card}
            //     elevation={1}
            //   >
            //     <TouchableRipple
            //       onPress={() =>
            //         router.push({
            //           pathname: '/PrincipalScreen',
            //           params: {
            //             pacienteId: paciente.id,
            //             nombre: paciente.nombre_completo || 'Paciente desconocido'
            //           }
            //         })
            //       }
            //       style={styles.ripple}
            //       accessibilityRole="button"
            //       accessibilityLabel={`Ver expediente de ${paciente.nombre_completo || 'paciente'}`}
            //       borderless
            //     >
            //       <View style={styles.cardContent}>
            //         {/* Icono de usuario en un círculo blanco */}
            //         <View style={styles.iconContainer}>
            //           <MaterialCommunityIcons name="account" size={60} color={Colors.primary} />
            //         </View>
            //         <Text variant="labelLarge" style={styles.patientName}>
            //           {paciente.nombre_completo || 'Paciente desconocido'}
            //         </Text>
            //         <Text variant="labelLarge" style={styles.patientName}>
            //           Edad: {paciente.edad} años
            //         </Text>
            //       </View>
            //     </TouchableRipple>
            //   </Surface>
            // ))

            pacientes.map((paciente, index) => (
              <Animated.View
                key={paciente.id}
                entering={FadeInDown
                  .delay(index * 120)
                  .duration(500)}
                style={{ width: '48%' }}
              >
                <Surface
                  style={styles.card}
                  elevation={0}
                >
                  <TouchableRipple
                    onPress={() =>
                      router.push({
                        pathname: '/PrincipalScreen',
                        params: {
                          pacienteId: paciente.id,
                          nombre: paciente.nombre_completo || 'Paciente desconocido'
                        }
                      })
                    }
                    style={styles.ripple}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                          name="account"
                          size={60}
                          color={Colors.primary}
                        />
                      </View>

                      <Text style={styles.patientName}>
                        {paciente.nombre_completo}
                      </Text>

                      <Text style={styles.patientName}>
                        Edad: {paciente.edad} años
                      </Text>
                    </View>
                  </TouchableRipple>
                </Surface>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}