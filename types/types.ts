import { LightColors } from '@/constants/styles';
import { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native';

// Medicamentos
export interface Medication {
  id: string;
  nombre: string;
  horas: string[];
  frecuencia: string;
}

// Caídas
export interface FallEvent {
  id: string;
  time: string;
  date: string;
  probabilidad?: number;
  notificada?: boolean;
}

// Card de Medicamentos
export interface CardMedicamentoProps {
  id: string;
  objeto: Medication;
  nombre: string;
  frecuencia: string;
  horas: string[];
  onEdit: (medication: Medication) => void;
  onDelete: (id: string, name: string) => void;
}

// Tipos para filas de datos
export interface SettingRowProps {
  label: string;
  value: string;
  colors: typeof LightColors;
}

// Usuario
export interface Usuario {
  uid: string;
  nombre_completo: string,
  correo: string;
  rol: string;
  telefono: string;
}

// Contacto
export interface Contacto {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

// Gráficos estadísticos
export interface ChartData {
  labels: string[],
  datasets: {
    data: number[],
  }[];
}

// Animaciones para los cards
export interface AnimatedCardProps {
  children: ReactNode;
  background?: string;
  onPress?: (event: GestureResponderEvent) => void;
  delay?: number;
  fullWidth?: boolean;
}

// Pie de página
export interface FooterNavProps {
  activeTab: 'inicio' | 'datos' | 'pacientes';
}

// Contexto de Lenguaje
export interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
}

// Contexto de Notificaciones
export interface NotificationContextType {
  actualizarMedicamentos: (meds: Medication[]) => Promise<void>;
}

// Props de notificaciones
export interface NotificationContextProps {
  children: React.ReactNode;
}

// Contexto de paciente
export interface PacienteContextValue {
  pacienteId?: string;
  setPacienteId: (id: string | undefined) => void;
}

// Datos de telemetría
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

// Contexto de telemetría
export interface TelemetriaContextValue {
  telemetrias: Telemetria[];
  telemetriaActual: Telemetria | null;
  pasosConteo: number;
  reiniciarPasos: () => Promise<void>;
  refreshTelemetria: () => Promise<void>;
  pacienteId?: string;
}