import { z } from "zod";

export interface Paciente {
  id: string;
  databaseId: number;
  fullName: string;
  firstName: string;
  ci: string;
  status: string;
  registrationComplete: boolean;
  diagnosis: string;
  birthDate: Date;
  createdAt: Date;
  imageUrl?: string;
  residence?: string | null;
  tutor: {
    id: string;
    firstName: string;
    celular: string;
    email?: string;
  };
}

export interface PacienteFiltro {
  status?: string;
  search: string;
  page?: number;
  pageSize?: number;
}

export interface PacienteDetalles extends Paciente {
  notes?: string;
  residence: string;
  tutor: {
    id: string;
    fullName: string;
    firstName: string;
    celular: string;
    email?: string;
  };
  clinicalNotes: Array<{
    id: number;
    category: string;
    content: string;
    createdAt: Date;
  }>;
  therapeuticSessions: {
    edges: Array<{
      node: {
        id: string;
        sessionNumber: number;
        sessionDate: Date;
        sessionStatus: string;
        paymentStatusDisplay: string;
        therapist: {
          fullName: string;
        };
        videoUrl?: string;
        notes?: string;
      };
    }>;
  };
}

export interface PacienteNormalizado extends Paciente {
  nombre: string;
  cedula: string;
  foto?: string;
}

export interface PuntoCrecimiento {
  month: string | null;
  total: number | null;
}

export interface PacienteDetalleSerializado {
  id: string;
  databaseId?: number | null;
  name: string;
  fullName: string | null;
  image?: string | null;
  imageUrl?: string | null;
  age: string;
  birthDate?: string | null;
  idNumber: string;
  ci?: string | null;
  status: string;
  registrationComplete: boolean;
  residence?: string | null;
  residenciaActual?: string | null;
  diagnostico?: string | null;
  diagnosis?: string | null;
  createdAt?: string | null;
  notes?: string | null;
  notas?: string | null;
  tutor?: string;
  tutorPhone?: string;
  contactEmail?: string;
  tutorRaw?: {
    id: string;
    fullName?: string | null;
    celular?: string;
  } | null;
  clinicalNotesRaw?: Array<{
    id: string;
    category: string;
    content: string;
    createdAt: string;
  }>;
  objetivosGenerales: string;
  fisico: string;
  emocional: string;
  cognitivo: string;
  social: string;
  metodosAUsar: string;
  tipoTratamiento: string;
  duracion: string;
  frecuenciaSesiones: string;
  cuestionario: {
    referenciasMusicales: {
      q1: string;
      q2: string;
      q3: string;
      q4: string;
      q5: string;
      q6: string;
      q7: string;
      q8: string;
    };
    referenciasGenerales: {
      q9: string;
      q10: string;
      q11: string;
      q12: string;
      q13: string;
      q14: string;
    };
    referenciasFamiliares: {
      q15: string;
      q16: string;
      q17: string;
      q18: string;
    };
  };
  progressData: Array<{
    session: string;
    atencion: number;
    social: number;
  }>;
}
