import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
  List,
  IconButton,
  TextInput,
  Switch,
} from 'react-native-paper';
import { t } from '../utils/i18n';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme, LightColors, DarkColors, getGlobalStyles } from '@/constants/styles';

// Definición de tipos para las filas de datos
interface SettingRowProps {
  label: string;
  value: string;
  colors: typeof LightColors;
}

interface Usuario {
  uid: string;
  nombre_completo: string,
  correo: string;
  rol: string;
  telefono: string;
}

const SettingRow = ({ label, value, colors }: SettingRowProps) => {
  const localStyles = createStyles(colors);
  return (
    <View style={getGlobalStyles(colors).row}>
      <Text variant="bodyMedium" style={{ color: colors.textSecondaryMaterial }}>{label}</Text>
      <Surface style={localStyles.valueContainer} elevation={0}>
        <Text variant="bodyMedium" style={{ color: colors.textMain }}>{value}</Text>
      </Surface>
    </View>
  )
};

export default function AjustesScreen() {
  const router = useRouter();
  const { isDark, Colors, theme, globalStyles, toggleTheme } = useTheme();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { language, changeLanguage } = useLanguage();
  const [langDialogVisible, setLangDialogVisible] = useState(false);
  const [editPhoneVisible, setEditPhoneVisible] = useState(false);
  const [telefono, setTelefono] = useState("");

  const activeColors = Colors;
  const activeTheme = theme;
  const styles = createStyles(activeColors);

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

  const guardarTelefono = async () => {
    try {
      await apiService.put("/api/usuarios/telefono", {
        telefono,
      });
      setUsuario(prev => prev ? { ...prev, telefono, } : prev);
      setEditPhoneVisible(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <PaperProvider key={`${language}-${isDark}`} theme={activeTheme}>
      <View style={[globalStyles.container, { backgroundColor: activeColors.backgroundSettings }]}>
        <Appbar.Header style={globalStyles.header}>
          <Appbar.BackAction onPress={() => router.back()} iconColor={activeColors.textMain} />
          <Appbar.Content title={t('settings.back')} titleStyle={{ color: activeColors.textMain }} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={globalStyles.content}>
          <Text variant="headlineSmall" style={globalStyles.title}>{t('settings.title')}</Text>

          {/* Sección Perfil */}
          <Text variant="titleMedium" style={styles.sectionHeader}>{t('settings.profile')}</Text>
          <SettingRow label={t('settings.user')} value={usuario?.nombre_completo || "Cargando"} colors={activeColors} />
          <SettingRow label={t('settings.role')} value={usuario?.rol || "Cargando"} colors={activeColors} />

          <View style={globalStyles.row}>
            <Text variant='bodyMedium' style={{ color: activeColors.textSecondaryMaterial }}>
              {t('settings.contact')}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{usuario?.telefono ?? "Cargando"}</Text>

              <IconButton icon="pencil" size={18} onPress={() => setEditPhoneVisible(true)} />
            </View>
          </View>
          <Portal>
            <Dialog visible={editPhoneVisible} onDismiss={() => setEditPhoneVisible(false)}>
              <Dialog.Title>{t('settings.edit_phone')}</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Número" value={telefono} keyboardType='phone-pad' onChangeText={setTelefono} />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setEditPhoneVisible(false)}>{t('settings.cancel')}</Button>
                <Button onPress={guardarTelefono}>{t('settings.accept')}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Divider style={[globalStyles.divider, { backgroundColor: activeColors.textSecondaryMaterial }]} />

          {/* Sección Preferencias */}
          <Text variant="titleMedium" style={styles.sectionHeader}>{t('settings.preferences')}</Text>

          {/* Fila de Idioma */}
          <View style={globalStyles.row}>
            <Text variant="bodyMedium" style={{ color: activeColors.textSecondaryMaterial }}>{t('settings.language')}</Text>
            <Button mode="text" onPress={() => setLangDialogVisible(true)}>{language === 'es' ? 'Español' : 'English'}</Button>
          </View>

          {/* Selección de Modo Oscuro */}
          <View style={globalStyles.row}>
            <Text variant='bodyMedium' style={{ color: activeColors.textSecondaryMaterial }}>
              {isDark ? 'Modo Oscuro' : 'Modo Claro'}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              color={activeColors.primary}
            />
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

          <Divider style={[globalStyles.divider, { backgroundColor: activeColors.textSecondaryMaterial }]} />

          {/* Botón Acción */}
          <Button
            mode="contained"
            style={[globalStyles.button, { backgroundColor: "#E42C2C", paddingVertical: 16, }]}
            onPress={() => router.push('/InicioSesionScreen')}
          >
            {t('settings.logout')}
          </Button>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

// Convertimos los estilos locales en una función para inyectar la paleta de colores activa
const createStyles = (colors: typeof LightColors) => StyleSheet.create({
  mainTitle: {
    fontWeight: 'bold',
    marginBottom: 20
  },
  sectionHeader: {
    marginBottom: 15,
    fontWeight: '600'
  },
  valueContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 4
  },
});