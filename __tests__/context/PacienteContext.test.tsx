import React from 'react';
import { render, act, renderHook } from '@testing-library/react-native';
import { PacienteProvider, usePaciente } from '../../context/PacienteContext';

describe('PacienteContext', () => {
  it('provee valores por defecto', () => {
    const { result } = renderHook(() => usePaciente(), {
      wrapper: ({ children }) => (
        <PacienteProvider>{children}</PacienteProvider>
      ),
    });

    expect(result.current.pacienteId).toBeUndefined();
    expect(typeof result.current.setPacienteId).toBe('function');
  });

  it('actualiza pacienteId con setPacienteId', () => {
    const { result } = renderHook(() => usePaciente(), {
      wrapper: ({ children }) => (
        <PacienteProvider>{children}</PacienteProvider>
      ),
    });

    act(() => {
      result.current.setPacienteId('paciente-123');
    });

    expect(result.current.pacienteId).toBe('paciente-123');
  });

  it('setPacienteId acepta undefined', () => {
    const { result } = renderHook(() => usePaciente(), {
      wrapper: ({ children }) => (
        <PacienteProvider>{children}</PacienteProvider>
      ),
    });

    act(() => {
      result.current.setPacienteId('paciente-123');
    });

    act(() => {
      result.current.setPacienteId(undefined);
    });

    expect(result.current.pacienteId).toBeUndefined();
  });

  it('lanza error si usePaciente se usa fuera del provider', () => {
    expect(() => renderHook(() => usePaciente())).toThrow(
      'usePaciente debe usarse dentro de PacienteProvider',
    );
  });
});
