export interface PasoTarjeta {
  id: string;
  momento: string;
  objetivo: string;
  foco: string;
  recursosMusicales: string;
  enfasisMusical: string;
  enfoque: string;
  mltEnfoque: string;
  duracion: number;
  completed: boolean;
}

export interface PlanTarjeta {
  id: string;
  patientName: string;
  objective: string;
  progress: number;
  status: string;
  steps: PasoTarjeta[];
}
