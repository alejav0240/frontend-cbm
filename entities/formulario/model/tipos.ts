export interface FormQuestion {
  id: string;
  question: string;
  questionType: string;
  isRequired: boolean;
  orderIndex: number;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string | null;
  questions: FormQuestion[];
}

export interface FormAssignment {
  id: string;
  templateId: string | undefined;
  assignedToRole: string;
  assignedAt: string;
  status: "Completado" | "Activo";
  patientName: string;
}

export interface FormResponse {
  id: string;
  assignmentId: string;
  templateId: string | undefined;
  submittedBy: string | undefined;
  patientName: string | undefined;
  submittedAt: string;
  status: "Revisado";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: any[];
}
