export interface SesionExportarFila {
  id: string;
  numeroSesion: number;
  pacienteNombre: string;
  institucionNombre?: string;
  fecha: string;
  hora: string;
  terapeuta: string;
  tipo: string;
  estado: string;
  pago: string;
  duracion: string;
  notas?: string;
  videoUrl?: string;
  fechaCreacion?: string;
}

export interface SesionDetalladaDTO {
  id: string;
  databaseId: number;
  sessionNumber: number;
  sessionDate: string;
  durationMinutes: number;
  cycleNumber: number;
  notes: string;
  createdAt: string;
  pacienteNombre: string;
  therapistName: string;
  resources: string[];
  inventory: Array<{ name: string; room?: string }>;
  scaleEvaluations: Array<{
    id: string;
    evaluatedAt: string;
    totalScore: number;
    scaleName: string;
    subscaleResponses: Array<{
      name: string;
      score: number;
      maxValue?: number;
    }>;
    valueResponses: Array<{ label: string; value: number }>;
  }>;
  formAssignments: Array<{
    createdAt: string;
    completionRatio: number;
    responses: Array<{ question: string; response: string }>;
  }>;
  planSteps: Array<{
    id: string;
    isCompleted: boolean;
    actualDuration?: number;
    moment?: string;
    objective?: string;
    focus?: string;
    musicalResources?: string;
    musicalEmphasis?: string;
    mltMethod?: string;
    durationMinutes?: number;
    approach?: string;
  }>;
}
