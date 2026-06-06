import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';

export interface Telemetria {
  heart_rate: number;
  spo2: number;
  battery: number;
  ax: number;
  ay: number;
  az: number;
}

interface TelemetriaContextValue {
  telemetrias: Telemetria[];
  telemetriaActual: Telemetria | null;
  pacienteId?: string;
  setPacienteId: (id: string | undefined) => void;
}

const TelemetriaContext = createContext<TelemetriaContextValue | undefined>(undefined);

export const TelemetriaProvider = ({ children }: { children: ReactNode }) => {
  const [pacienteId, setPacienteId] = useState<string | undefined>(undefined);
  const [telemetrias, setTelemetrias] = useState<Telemetria[]>([]);

  useEffect(() => {
    if (!pacienteId) {
      setTelemetrias([]);
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    const cargarTelemetria = async () => {
      try {
        const response = await apiService.get(
          `/api/pacientes/${pacienteId}/telemetria`
        );

        setTelemetrias(response.telemetria ?? []);
      } catch (error) {
        console.log('Error cargando telemetría en TelemetriaProvider', error);
      }
    };

    cargarTelemetria();
    interval = setInterval(cargarTelemetria, 1000);

    return () => clearInterval(interval);
  }, [pacienteId]);

  const telemetriaActual =
    telemetrias.length > 0 ? telemetrias[telemetrias.length - 1] : null;

  return (
    <TelemetriaContext.Provider
      value={{ telemetrias, telemetriaActual, pacienteId, setPacienteId }}
    >
      {children}
    </TelemetriaContext.Provider>
  );
};

export const useTelemetria = () => {
  const context = useContext(TelemetriaContext);
  if (!context) {
    throw new Error('useTelemetria debe usarse dentro de TelemetriaProvider');
  }
  return context;
};
