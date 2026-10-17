export interface SesionAgenda {
  id: string;
  patientName: string;
  patientId?: string;
  cycleNumber?: number | null;
  therapistId?: string;
  time: string;
  status: string;
  therapist: string;
  duration: string;
  durationMinutes?: number;
  isTest: boolean;
  recordingUrl?: string;
  date: string;
  type?: string;
  notes?: string;
  databaseId?: number;
}
