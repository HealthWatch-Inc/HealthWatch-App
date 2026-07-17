import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  lightTheme,
  darkTheme,
  LightColors,
  DarkColors,
  getGlobalStyles,
  getChartConfig,
} from '@/constants/styles';

// Clave de persistencia
const THEME_STORAGE_KEY = '@theme_mode';

// Modo del dispositivo para forzar manualmente
export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  themeMode: ThemeMode;
  isDark: boolean;
  theme: typeof lightTheme;
  Colors: typeof LightColors;
  globalStyles: ReturnType<typeof getGlobalStyles>;
  chartConfig: ReturnType<typeof getChartConfig>;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isLoadingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  useEffect(() => {
    const cargarPreferencia = async () => {
      try {
        const guardado = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (guardado === 'light' || guardado === 'dark' || guardado === 'system') {
          setThemeModeState(guardado);
        }
      } catch (e) {
        console.error('Error al cargar la preferencia de tema', e)
      } finally {
        setIsLoadingTheme(false);
      }
    };

    cargarPreferencia();
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch((e) =>
      console.error('Error al guardar la preferencia de tema', e)
    );
  };

  const toggleTheme = () => {
    const actualEsOscuro = 
      themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
    setThemeMode(actualEsOscuro ? 'light' : 'dark');
  };

  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const value = useMemo<ThemeContextType>(() => {
    const Colors = isDark ? DarkColors : LightColors;
    return {
      themeMode,
      isDark,
      theme: isDark ? darkTheme : lightTheme,
      Colors,
      globalStyles: getGlobalStyles(Colors),
      chartConfig: getChartConfig(isDark),
      toggleTheme,
      setThemeMode,
      isLoadingTheme,
    };
  }, [isDark, themeMode, isLoadingTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
}