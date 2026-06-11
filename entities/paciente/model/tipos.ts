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
  tutor: {
    id: string;
    fullName: string;
    celular: string;
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
    celular: string;
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
  month: string;
  total: number;
}
