import { Platform, StyleSheet } from 'react-native';

export const Colors = {
  primary: '#005063',
  background: '#fff',
  inputBg: '#EAE6F0',
  textMain: '#1a1a1a',
  textSecondary: '#666',
  textLight: '#444',
  white: '#fff',
  logoBg: '#f0f4f5',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    width: '100%',
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
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    color: '#000',
    marginTop: 2,
    minHeight: Platform.OS === 'ios' ? 24 : 30,
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
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
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
});