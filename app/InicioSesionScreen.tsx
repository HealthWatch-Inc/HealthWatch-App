import { Colors, globalStyles } from '@/constants/styles';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      await AsyncStorage.setItem('@user_credential', email);
      router.push('/MisPacientesScreen');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      const user = await authService.googleLogin();
      if (user?.email) {
        await AsyncStorage.setItem('@user_credential', user.email);
      }
      router.push('/MisPacientesScreen');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="watch-outline" size={80} color={Colors.primary} />
            </View>
            <Text style={styles.brandName}>HEALTHWATCH</Text>
            <Text style={styles.brandSlogan}>
              Cuidado y Salud para el Adulto Mayor
            </Text>
          </View>

          <View style={globalStyles.form}>
            <Text style={[globalStyles.title, styles.centerText]}>Iniciar Sesión</Text>

            {/* Input Correo */}
            <View style={globalStyles.inputWrapper}>
              <View style={globalStyles.inputContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.inputLabel}>Correo</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="example@email.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <Text style={globalStyles.helperText}>
                Ingrese un correo válido
              </Text>
            </View>

            {/* Input Contraseña */}
            <View style={globalStyles.inputWrapper}>
              <View style={globalStyles.inputContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.inputLabel}>Contraseña</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="**************"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>
              <Text style={globalStyles.helperText}>Mínimo 8 caracteres</Text>
            </View>

            {/* Botón Ingresar */}
            <TouchableOpacity
              style={[globalStyles.button, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? "Cargando..." : "Ingresar"}
              </Text>
            </TouchableOpacity>

            {/* Registro */}
            <Link href="/CrearCuentaScreen" asChild>
              <TouchableOpacity style={globalStyles.linkContainer}>
                <Text style={globalStyles.linkText}>
                  ¿No tienes una cuenta?{" "}
                  <Text style={globalStyles.linkTextBold}>
                    Crea una nueva.
                  </Text>
                </Text>
              </TouchableOpacity>
            </Link>
            <View style={styles.googleLoginWrapper}>
              <TouchableOpacity
                style={[styles.googleButton, loading && { opacity: 0.7 }]}
                onPress={handleLoginGoogle}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Image
                  source={require('../assets/logos/google.png')}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.googleLabel}>Inicia sesión con Google</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f4f5',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  brandSlogan: {
    fontSize: 12,
    color: '#888',
  },
  googleLoginWrapper: {
    alignItems: 'center',
    marginTop: 25,
  },
  googleButton: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.52)',
    elevation: 2,
  },
  googleLogo: {
    width: 48,
    height: 48,
  },
  googleLabel: {
    marginTop: 10,
    color: Colors.textMain,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});
