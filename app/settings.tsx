import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Appbar,
  Text,
  Button,
  Divider,
  Surface,
  Provider as PaperProvider,
  MD3LightTheme
} from 'react-native-paper';
import { useRouter } from 'expo-router';

// Definición de tipos para las filas de datos
interface SettingRowProps {
  label: string;
  value: string;
}

const SettingRow = ({ label, value }: SettingRowProps) => (
  <View style={styles.row}>
    <Text variant="bodyMedium" style={styles.label}>{label}</Text>
    <Surface style={styles.valueContainer} elevation={0}>
      <Text variant="bodyMedium">{value}</Text>
    </Surface>
  </View>
);

export default function AjustesScreen() {
  const router = useRouter();

  return (
    <PaperProvider theme={MD3LightTheme}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Atrás" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.mainTitle}>Ajustes</Text>

        {/* Sección Perfil */}
        <Text variant="titleMedium" style={styles.sectionHeader}>Perfil</Text>
        <SettingRow label="Usuario" value="Elizabeth García" />
        <SettingRow label="Rol" value="Cuidador" />
        <SettingRow label="Num o correo" value="example@email.com" />
        <Divider style={styles.divider} />

        {/* Sección Seguridad */}
        <Text variant="titleMedium" style={styles.sectionHeader}>Seguridad</Text>
        <SettingRow label="Contraseña" value="************" />
        <SettingRow label="Nueva Contraseña" value="************" />
        <Divider style={styles.divider} />

        {/* Sección Preferencias */}
        <Text variant="titleMedium" style={styles.sectionHeader}>Preferencias</Text>
        <View style={styles.row}>
          <Text variant="bodyMedium" style={styles.label}>Idioma</Text>
          <Text variant="bodyMedium" style={styles.linkText}>Seleccionar &gt;</Text>
        </View>
        <Divider style={styles.divider} />

        {/* Botón Acción */}
        <Button
          mode="contained"
          buttonColor="#E42C2C"
          style={styles.logoutButton}
          onPress={() => router.push('/')}
        >
          Cerrar Sesión
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FEF7FF' },
  header: {
    backgroundColor: 'transparent', elevation: 0, justifyContent: 'space-between',
  },
  mainTitle: { fontWeight: 'bold', marginBottom: 20 },
  sectionHeader: { marginBottom: 15, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  label: { color: '#49454F' },
  valueContainer: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F1F1F1', borderRadius: 4 },
  linkText: { color: '#49454F', fontWeight: '500' },
  divider: { marginVertical: 16 },
  logoutButton: { marginTop: 30, borderRadius: 25, paddingVertical: 4 }
});