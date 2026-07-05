import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { apiService } from '@/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Telemetria {
  time: string;
  heart_rate: number;
  spo2: number;
  battery: number;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
}

interface TelemetriaContextValue {
  telemetrias: Telemetria[];
  telemetriaActual: Telemetria | null;
  pasosConteo: number;
  reiniciarPasos: () => Promise<void>;
  pacienteId?: string;
  setPacienteId: (id: string | undefined) => void;
}

const TelemetriaContext = createContext<TelemetriaContextValue | undefined>(undefined);

export const TelemetriaProvider = ({ children }: { children: ReactNode }) => {
  const [pacienteId, setPacienteId] = useState<string | undefined>(undefined);
  const [telemetrias, setTelemetrias] = useState<Telemetria[]>([]);
  const [pasosConteo, setPasosConteo] = useState(0);

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

        console.log(response.telemetria);

        setTelemetrias(response.telemetria ?? []);
      } catch (error) {
        console.log('Error cargando telemetría en TelemetriaProvider', error);
      }
    };

    cargarTelemetria();
    interval = setInterval(cargarTelemetria, 1000);

    return () => clearInterval(interval);
  }, [pacienteId]);

  // Cargar datos al iniciar la pantalla
  useEffect(() => {
    const cargarDatosPersistidos = async () => {
      try {
        const pasosGuardados = await AsyncStorage.getItem('@pasos_conteo');

        if (pasosGuardados !== null) setPasosConteo(parseInt(pasosGuardados, 10));

      } catch (e) {
        console.error("Error al cargar los datos locales", e);
      }
    }

    cargarDatosPersistidos();
  }, []);

  // Guardar pasos automáticamente cuando cambien
  useEffect(() => {
    const guardarPasos = async () => {
      try {
        await AsyncStorage.setItem('@pasos_conteo', pasosConteo.toString());
      } catch (e) {
        console.error("Error al guardar pasos", e);
      }
    };

    guardarPasos();

  }, [pasosConteo]);

  const filtroExponencial = (valor: number, ref: React.MutableRefObject<number>, alpha = 0.3) => {
    ref.current = alpha * valor + (1 - alpha) * ref.current;
    return ref.current;
  }

  const reiniciarPasos = async () => {
    setPasosConteo(0);

    try {
      await AsyncStorage.setItem(
        "@pasos_conteo",
        "0"
      );
    } catch (e) {
      console.log(e);
    }
  };

  //Constante para el Filtro de Aceleración y Giroscopio
  const UMBRAL_SUBIDA = 1.2;
  const UMBRAL_BAJADA = 0.6;
  const TIEMPO_MINIMO = 300;
  const GRAVEDAD = 9.81;

  // Estado del filtro
  const acelAnterior = useRef(0);
  const giroAnterior = useRef(0);
  const ultimoPaso = useRef(0); // Último paso detectado
  const arribaUmbral = useRef(false); //Para detectar el cruce del umbral

  const telemetriaActual =
    telemetrias.length > 0 ? telemetrias[telemetrias.length - 1] : null;

  useEffect(() => {
    if (!telemetriaActual) return;

    const { ax = 0, ay = 0, az = 0, gx = 0, gy = 0, gz = 0 } = telemetriaActual;

    // Magnitud de aceleración y giro
    const aceleracion = Math.sqrt(ax * ax + ay * ay + az * az);

    // Eliminar gravedad
    const movimiento = Math.abs(aceleracion - GRAVEDAD);

    // Magnitud de giroscopio
    const giro = Math.sqrt(gx * gx + gy * gy + gz * gz);

    // Filtrado
    const acelFiltrada = filtroExponencial(movimiento, acelAnterior, 0.3);

    // Calibración
    // console.log({
    //   acel: aceleracion.toFixed(2),
    //   movimiento: acelFiltrada.toFixed(2),
    //   pasos: pasosConteo
    // })

    const ahora = Date.now();

    // Detectar inicio del pico
    if (!arribaUmbral.current && acelFiltrada > UMBRAL_SUBIDA) {
      arribaUmbral.current = true;

      if (ahora - ultimoPaso.current > TIEMPO_MINIMO) {
        ultimoPaso.current = ahora;
        console.log("Paso detectado")
        setPasosConteo((prev) => prev + 1);
      }
    }

    // Reiniciar al bajar el pico
    if (acelFiltrada < UMBRAL_BAJADA) {
      arribaUmbral.current = false;
    }

    // console.log({
    //   acelFiltrada,
    //   arriba: arribaUmbral.current
    // });

  }, [telemetriaActual]);

  return (
    <TelemetriaContext.Provider
      value={{
        telemetrias,
        telemetriaActual,
        pasosConteo,
        reiniciarPasos,
        pacienteId,
        setPacienteId
      }}
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
