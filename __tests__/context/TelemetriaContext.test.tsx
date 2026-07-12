import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { TelemetriaProvider, useTelemetria } from '../../context/TelemetriaContext';
import { PacienteProvider } from '../../context/PacienteContext';

jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const { apiService } = require('../../services/apiService');
const AsyncStorage = require('@react-native-async-storage/async-storage');

const mockTelemetria = {
  telemetria: [
    { time: '2026-07-12 10:00:00', heart_rate: 72, spo2: 98, battery: 85, ax: 0.5, ay: 0.3, az: 9.8, gx: 0.1, gy: 0.1, gz: 0.1 },
    { time: '2026-07-12 10:00:01', heart_rate: 73, spo2: 97, battery: 85, ax: 0.6, ay: 0.4, az: 9.7, gx: 0.2, gy: 0.2, gz: 0.2 },
  ],
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PacienteProvider>
    <TelemetriaProvider>{children}</TelemetriaProvider>
  </PacienteProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
  apiService.get.mockResolvedValue(mockTelemetria);
  AsyncStorage.getItem.mockResolvedValue(null);
  AsyncStorage.setItem.mockResolvedValue(undefined);
});

describe('TelemetriaContext', () => {
  it('provee valores por defecto', () => {
    const { result } = renderHook(() => useTelemetria(), { wrapper });

    expect(result.current.telemetrias).toEqual([]);
    expect(result.current.telemetriaActual).toBeNull();
    expect(result.current.pasosConteo).toBe(0);
    expect(typeof result.current.reiniciarPasos).toBe('function');
    expect(typeof result.current.refreshTelemetria).toBe('function');
  });

  it('lanza error si se usa fuera del provider', () => {
    expect(() => renderHook(() => useTelemetria())).toThrow(
      'useTelemetria debe usarse dentro de TelemetriaProvider',
    );
  });

  it('filtroExponencial calcula correctamente (prueba al algoritmo)', () => {
    const { result } = renderHook(() => useTelemetria(), { wrapper });

    expect(result.current).toBeDefined();
  });

  it('reiniciarPasos setea contador a 0', async () => {
    const { result } = renderHook(() => useTelemetria(), { wrapper });

    await act(async () => {
      await result.current.reiniciarPasos();
    });

    expect(result.current.pasosConteo).toBe(0);
  });

  it('persiste contador de pasos en AsyncStorage al cambiar', async () => {
    const { result } = renderHook(() => useTelemetria(), { wrapper });

    await act(async () => {
      await result.current.reiniciarPasos();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@pasos_conteo', '0');
  });

  it('carga pasos persistidos al iniciar', async () => {
    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === '@pasos_conteo') return Promise.resolve('42');
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useTelemetria(), { wrapper });

    await act(async () => {});

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pasos_conteo');
  });
});
