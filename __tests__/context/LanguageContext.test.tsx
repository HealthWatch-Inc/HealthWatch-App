import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as i18nModule from '../../utils/i18n';

jest.mock('../../utils/i18n', () => ({
  initI18n: jest.fn(),
  setLocale: jest.fn(),
  t: jest.fn((scope) => scope),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (i18nModule.initI18n as jest.Mock).mockResolvedValue('es');
  (i18nModule.setLocale as jest.Mock).mockResolvedValue(undefined);
});

describe('LanguageContext', () => {
  it('inicializa con español por defecto', async () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    await act(async () => {});
    expect(result.current.language).toBe('es');
    expect(i18nModule.initI18n).toHaveBeenCalledTimes(1);
  });

  it('inicializa con el idioma guardado en AsyncStorage', async () => {
    (i18nModule.initI18n as jest.Mock).mockResolvedValue('en');

    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    await act(async () => {});
    expect(result.current.language).toBe('en');
  });

  it('changeLanguage cambia el idioma y persiste', async () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    await act(async () => {});

    await act(async () => {
      await result.current.changeLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(i18nModule.setLocale).toHaveBeenCalledWith('en');
  });

  it('retorna valores por defecto si se usa fuera del provider', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('es');
    expect(typeof result.current.changeLanguage).toBe('function');
  });
});
