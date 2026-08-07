export interface EvaluacionExportarFila {
  id: string;
  paciente: string;
  escala: string;
  fecha: string;
  tipo: string;
  puntaje: number | null;
  dimensiones: string;
}

export interface EvaluacionSubescalaDTO {
  nombre: string;
  puntaje: number;
  maximo: number | null;
}

export interface EvaluacionDetalleDTO {
  paciente: string;
  escala: string;
  fecha: string;
  tipo: string;
  puntaje: number | null;
  subescalas: EvaluacionSubescalaDTO[];
  valorSeleccionado: string | null;
}
