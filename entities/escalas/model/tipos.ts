export interface Evaluacion {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  score: number | null;
  status: string;
  scaleId: string;
  scaleName: string;
  subscaleResponses: Array<{
    id: string;
    score: number;
    subscaleId: string;
    subscaleName: string;
  }>;
}
