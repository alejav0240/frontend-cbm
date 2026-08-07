export interface SubescalaForm {
  id: string;
  nombre?: string | null;
  name?: string | null;
  descripcion?: string | null;
  description?: string | null;
  valorMaximo?: number | null;
  maxValue?: number | null;
}

export interface ValorForm {
  id: string;
  etiqueta?: string | null;
  label?: string | null;
  valor?: number | null;
  value?: number | null;
}

export interface EscalaEvaluacion {
  id: string;
  nombre?: string | null;
  name?: string | null;
  descripcion?: string | null;
  tipoEscala?: string;
  scaleType?: string;
  subescalas?: Array<SubescalaForm> | null;
  subscales?: Array<SubescalaForm> | null;
  valores?: Array<ValorForm> | null;
  values?: Array<ValorForm> | null;
}

export interface NuevaEvaluacion {
  patientId: string;
  type: string;
  date: string;
  score: number;
}

export interface EvaluacionDetallada {
  patient: string;
  type: string;
  date: string;
  scaleId: string;
  score: number | null;
  subscaleScores?: Record<string, number>;
  originalData?: {
    scale?: { id: string };
    subscaleResponses?: Array<{
      subscale: { id: string };
      score: number;
    }>;
  };
}
