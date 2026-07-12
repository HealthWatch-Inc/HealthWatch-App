import i18n, { initI18n, setLocale, t } from '../../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../utils/i18n', () => {
  const actual = jest.requireActual('../../utils/i18n');
  return actual;
});

describe('i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('t()', () => {
    it('devuelve traducción en español como default', () => {
      i18n.locale = 'es';
      expect(t('common.back')).toBe('Atrás');
      expect(t('common.save')).toBe('Guardar');
      expect(t('auth.login_title')).toBe('Iniciar Sesión');
      expect(t('settings.title')).toBe('Ajustes');
    });

    it('devuelve traducción en inglés', () => {
      i18n.locale = 'en';
      expect(t('common.back')).toBe('Back');
      expect(t('common.save')).toBe('Save');
      expect(t('auth.login_title')).toBe('Sign In');
      expect(t('settings.title')).toBe('Settings');
    });

    it('devuelve mensaje de missing si no encuentra traducción (fallback)', () => {
      i18n.locale = 'es';
      const result = t('nonexistent.key');
      expect(result).toContain('nonexistent.key');
    });

    it('no interpola con llaves simples (formato i18n-js usa dobles llaves)', () => {
      i18n.locale = 'es';
      const result = t('patients.age_years', { age: 75 });
      expect(result).toBe('Edad: {age} años');
    });

    it('devuelve todas las claves de common', () => {
      i18n.locale = 'es';
      const keys = ['back', 'close', 'cancel', 'save', 'edit', 'add', 'delete', 'error', 'success', 'ok', 'loading', 'not_defined', 'yes', 'no', 'confirmation'];
      keys.forEach((key) => {
        const translation = t(`common.${key}`);
        expect(translation).not.toBe(`common.${key}`);
        expect(translation.length).toBeGreaterThan(0);
      });
    });

    it('traduce correctamente con locale en inglés', () => {
      i18n.locale = 'en';
      expect(t('fitness.title')).toBe('Physical activity');
      expect(t('alerts.title')).toBe('Alerts and Notifications');
      expect(t('contacts.title')).toBe('Emergency contacts');
      expect(t('vitals.title')).toBe('Vital signs');
    });
  });

  describe('initI18n()', () => {
    it('usa el idioma guardado en AsyncStorage si existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en');
      const locale = await initI18n();
      expect(locale).toBe('en');
      expect(i18n.locale).toBe('en');
    });

    it('usa el idioma del dispositivo si no hay guardado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const locale = await initI18n();
      expect(locale).toBe('es');
    });

    it('retorna "es" si AsyncStorage falla', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      const locale = await initI18n();
      expect(locale).toBe('es');
      expect(i18n.locale).toBe('es');
    });

    it('setea default locale a es', () => {
      expect(i18n.defaultLocale).toBe('es');
    });

    it('tiene enableFallback activado', () => {
      expect(i18n.enableFallback).toBe(true);
    });
  });

  describe('setLocale()', () => {
    it('cambia el locale y persiste en AsyncStorage', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await setLocale('en');
      expect(i18n.locale).toBe('en');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app_language', 'en');
    });
  });
});
