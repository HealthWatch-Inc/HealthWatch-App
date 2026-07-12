import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { NotificationProvider, useNotificationBanner } from '../../context/NotificationContext';
import { PacienteProvider } from '../../context/PacienteContext';
import { TelemetriaProvider } from '../../context/TelemetriaContext';

jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb(null);
    return jest.fn();
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PacienteProvider>
    <TelemetriaProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </TelemetriaProvider>
  </PacienteProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('NotificationContext', () => {
  describe('useNotificationBanner', () => {
    it('provee actualizarMedicamentos', () => {
      const { result } = renderHook(() => useNotificationBanner(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.actualizarMedicamentos).toBe('function');
    });

    it('actualizarMedicamentos programa alarmas nativas', async () => {
      const { result } = renderHook(() => useNotificationBanner(), { wrapper });

      const meds = [
        {
          id: 'med-1',
          nombre: 'Paracetamol',
          horas: ['08:00', '20:00'],
          frecuencia: 'daily',
        },
      ];

      await act(async () => {
        await result.current.actualizarMedicamentos(meds);
      });
    });

    it('lanza error si se usa fuera del provider', () => {
      expect(() => renderHook(() => useNotificationBanner())).toThrow(
        'useNotificationBanner debe usarse dentro de NotificationProvider',
      );
    });
  });
});
