import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Appbar,
  Text,
  Button,
  Divider,
  Surface,
  Provider as PaperProvider,
  Portal,
  Dialog,
  RadioButton,
  List
} from 'react-native-paper';
import { t } from '../utils/i18n';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';

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
  const [usuario, setUsuario] = useState('');
  const { language, changeLanguage } = useLanguage();
  const [langDialogVisible, setLangDialogVisible] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const saved = await AsyncStorage.getItem('@user_credential');
        if (saved) {
          setUsuario(saved);
        }
      } catch (error) {
        console.error('Error cargando usuario en settings:', error);
      }
    };
    cargarUsuario();
  }, []);

  return (
    <PaperProvider key={language}>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('settings.back')} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.mainTitle}>{t('settings.title')}</Text>

        {/* Sección Perfil */}
        <Text variant="titleMedium" style={styles.sectionHeader}>{t('settings.profile')}</Text>
        <SettingRow label={t('settings.user')} value="José García" />
        <SettingRow label={t('settings.role')} value={t('settings.caregiver')} />
        <SettingRow label={t('settings.contact')} value={usuario || t('settings.not_registered')} />
        <Divider style={styles.divider} />

        {/* Sección Seguridad */}
        <Text variant="titleMedium" style={styles.sectionHeader}>{t('settings.security')}</Text>
        <SettingRow label={t('settings.password')} value="************" />
        <SettingRow label={t('settings.new_password')} value="************" />
        <Divider style={styles.divider} />

        {/* Sección Preferencias */}
        <Text variant="titleMedium" style={styles.sectionHeader}>{t('settings.preferences')}</Text>
        <View style={styles.row}>
          <Text variant="bodyMedium" style={styles.label}>{t('settings.language')}</Text>
          <Button mode="text" onPress={() => setLangDialogVisible(true)}>{language === 'es' ? 'Español' : 'English'}</Button>
        </View>
        <Portal>
          <Dialog visible={langDialogVisible} onDismiss={() => setLangDialogVisible(false)}>
            <Dialog.Title>{t('settings.select_language')}</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group value={language} onValueChange={async (val) => {
                await changeLanguage(val);
                setLangDialogVisible(false);
              }}>
                <List.Item title="Español" description="Español (predeterminado)" left={() => <RadioButton value="es" />} />
                <List.Item title="English" description="English" left={() => <RadioButton value="en" />} />
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setLangDialogVisible(false)}>{t('settings.accept')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Divider style={styles.divider} />

        {/* Botón Acción */}
        <Button
          mode="contained"
          buttonColor="#E42C2C"
          style={styles.logoutButton}
          onPress={() => router.push('/InicioSesionScreen')}
        >
          {t('settings.logout')}
        </Button>
      </ScrollView>
      </View>
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