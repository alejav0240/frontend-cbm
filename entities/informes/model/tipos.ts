export interface TherapyReport {
  id: string;
  title: string;
  patientName: string;
  date: string;
  status: string;
  tutorName: string;
  therapistName: string;
  content: string;
  reportUrl: string;
}

export interface TherapyReportFilters {
  patientId?: string;
}
