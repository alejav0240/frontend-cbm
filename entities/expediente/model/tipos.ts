export interface ExpedienteResumen {
  id: string;
  patientId: string;
  patientName: string;
  cycleNumber: number;
  totalSessions: number;
  completedSessions: number;
  status: string;
  paymentSummary: {
    paid: number | null;
    pending: number | null;
    exempt: number | null;
  } | null;
  sessionsList: Array<{
    id: string;
    sessionDate: string;
    sessionStatus: string;
  }>;
  startDate: string;
  lastSessionDate: string;
}
