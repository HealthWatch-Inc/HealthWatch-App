import { Colors, globalStyles } from '@/constants/styles';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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
      router.push('/home');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await authService.googleLogin();
      router.push('/home');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <Text style={globalStyles.title}>Iniciar sesión</Text>

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
            <Link href="/register" asChild>
              <TouchableOpacity style={globalStyles.linkContainer}>
                <Text style={globalStyles.linkText}>
                  ¿No tiene cuenta?{" "}
                  <Text style={globalStyles.linkTextBold}>
                    Crear una nueva.
                  </Text>
                </Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={globalStyles.linkContainer}
              onPress={handleLoginGoogle}
            >
              <Text style={globalStyles.linkText}>
                Ingresar con Google{" "}
                <Text style={globalStyles.linkTextBold}>aquí.</Text>
              </Text>
            </TouchableOpacity>
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
});
