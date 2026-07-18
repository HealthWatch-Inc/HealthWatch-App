export interface Medication {
  id: string;
  nombre: string;
  horas: string[];
  frecuencia: string;
}

export interface FallEvent {
  id: string;
  time: string;
  date: string;
}

export interface CardMedicamentoProps {
  id: string;
  objeto: Medication;
  nombre: string;
  frecuencia: string;
  horas: string[];
  onEdit: (medication: Medication) => void;
  onDelete: (id: string, name: string) => void;
}