import { Platform, StyleSheet } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Paleta base de Modo Claro
export const LightColors = {
  primary: '#005063',
  inputBg: '#EAE6F0',
  textMain: '#1A1A1A',
  textSecondary: '#666',
  textLight: '#444',
  white: '#FFF',
  white_text: '#FFE',
  black: '#000',
  logoBg: '#F0F4F5',
  cardBrown: "#665200",
  backgroundSettings: '#FEF7FF',
  navItem: '#FEF7FE',
  background: "#F9F9F9",
  textSecondaryMaterial: '#49454F',
  inputLabel: '#161518',
  inputLogin: '#161518',
  cancel: "#E6E1E5",
  danger: "#B3261E",
  modal: '#1D1B20',
};

// Paleta adaptada para Modo Oscuro
export const DarkColors = {
  primary: '#007A96',
  inputBg: '#2D2930',
  textMain: '#E6E1E5',
  textSecondary: '#A8A29E',
  textLight: '#CCC',
  white: '#1A1A1A',
  white_text: '#FFE',
  black: '#FFF',
  logoBg: '#1F2425',
  cardBrown: "#806600",
  backgroundSettings: '#121212',
  navItem: '#d6d5d5',
  background: "#1C1C1C",
  textSecondaryMaterial: '#CAC4D0',
  inputLabel: '#161518',
  inputLogin: '#ffe',
  cancel: '#36343B',
  danger: '#B3261E',
  modal: '#2B2930',
};

// Temas completos para React Native Paper
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: LightColors.backgroundSettings,
    surface: LightColors.backgroundSettings,
    onSurface: LightColors.black,
    onSurfaceVariant: LightColors.black,
    primary: LightColors.primary,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: DarkColors.backgroundSettings,
    surface: DarkColors.backgroundSettings,
    onSurface: DarkColors.black, // En MD3DarkTheme esto mapea al texto principal claro
    onSurfaceVariant: DarkColors.black,
    primary: DarkColors.primary,
  },
};

export const getChartConfig = (isDark: boolean) => ({
  backgroundGradientFrom: isDark ? "#121212" : "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: isDark ? "#1C1C1C" : "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif-condensed',
  propsForLabels: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif-condensed',
  }
});

export const getGlobalStyles = (Colors: typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  form: {
    width: '100%',
  },
  header: {
    backgroundColor: Colors.white,
    elevation: 0, shadowOpacity: 0,
    borderBottomWidth: 0
  },
  inputWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: Colors.textMain,
  },
  inputContainer: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.inputLabel,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.backgroundSettings,
    marginTop: 2,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 20
  },
  buttonText: {
    color: Colors.white_text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 90,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    zIndex: 10
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 28,
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.modal,
    // marginBottom: 16
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    marginTop: 16,
    backgroundColor: '#CAC4D0'
  },
  avatar: {
    backgroundColor: '#ff8a65',
    marginRight: 16,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: '400',
    color: Colors.textMain,
  },
})
