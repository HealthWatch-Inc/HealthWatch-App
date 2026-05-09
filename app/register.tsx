import { Colors, globalStyles } from '@/constants/styles';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    try {
      await authService.register(email, password);
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Botón Volver */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={[globalStyles.title, styles.centerText]}>Crear cuenta</Text>

          <View style={globalStyles.form}>
            {/* Email */}
            <View style={globalStyles.inputWrapper}>
              <View style={globalStyles.inputContainer}>
                <View style={{flex: 1}}>
                  <Text style={globalStyles.inputLabel}>Correo</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="example@email.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
              <Text style={globalStyles.helperText}>Ingrese un correo válido</Text>
            </View>

            {/* Password */}
            <View style={globalStyles.inputWrapper}>
              <View style={globalStyles.inputContainer}>
                <View style={{flex: 1}}>
                  <Text style={globalStyles.inputLabel}>Contraseña</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="****************"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>
              <Text style={globalStyles.helperText}>Mínimo 8 caracteres</Text>
            </View>

            <TouchableOpacity 
              style={[globalStyles.button, loading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? 'Creando...' : 'Crear'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={globalStyles.linkContainer} 
              onPress={() => router.push('/')}
            >
              <Text style={globalStyles.linkText}>
                ¿Ya tiene una cuenta? <Text style={globalStyles.linkTextBold}>Iniciar sesión.</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});