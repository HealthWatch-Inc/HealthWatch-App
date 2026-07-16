import { Platform, StyleSheet } from 'react-native';
import { MD3LightTheme } from 'react-native-paper';

export const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(256, 256, 256, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  fontFamily: 'Arial Black',
  propsForLabels: {
    fontFamily: 'Arial Black',
  }
}

export const Colors = {
  primary: '#005063',
  inputBg: '#EAE6F0',
  textMain: '#1a1a1a',
  textSecondary: '#666',
  textLight: '#444',
  white: '#fff',
  black: '#000',
  logoBg: '#f0f4f5',
  cardBrown: "#665200",
  backgroundSettings: '#FEF7FF',
  textSecondaryMaterial: '#49454F',
  cancel: "#E6E1E5",
  danger: "#B3261E",
  modal: '#1D1B20',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: Colors.backgroundSettings,
    surface: Colors.backgroundSettings,
    onSurface: Colors.black,
    onSurfaceVariant: Colors.black,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    fontSize: 28,
    fontWeight: '700', 
    marginBottom: 30, 
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
    color: Colors.textSecondaryMaterial,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.backgroundSettings,
    marginTop: 2,
    marginBottom: 8,
    minHeight: 24,
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
    marginTop: 10,
    ...Platform.select({
      android: { elevation: 3 },
    }),
  },
  buttonText: {
    color: Colors.white,
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
    marginBottom: 16
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
});