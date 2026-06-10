import { PatientFormData } from "@/modules/atencion/pacientes";

export interface Patient {
  id: string;
  databaseId: number;
  fullName: string;
  ci: string;
  status: string;
  registrationComplete: boolean;
  diagnosis: string;
  birthDate: Date;
  createdAt: Date;
  imageUrl?: string;
  tutor: {
    id: string;
    firstName: string;
    celular: string;
  };
}

export interface PatientFilter {
  status?: string;
  search: string;
  page?: number;
  pageSize?: number;
}

export interface PatientDetails {
  id: string;
  databaseId: number;
  fullName: string;
  ci: string;
  birthDate: Date;
  imageUrl?: string;
  notes?: string;
  status: string;
  registrationComplete: boolean;
  diagnosis: string;
  createdAt: Date;
  residence: string;
  tutor: {
    id: string;
    fullName: string;
    celular: string;
  };
  clinicalNotes: {
    id: number;
    category: string;
    content: string;
    createdAt: Date;
  };
  therapeuticSessions: {
    edges: {
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
    };
  };
}

export interface PatientDetailsData {
  data: PatientDetails;
}

export interface SearchPatient {
  id: string;
  fullName: string;
}

export interface SearchPatientData {
  patients: {
    results: SearchPatient[];
  };
}

export interface PatientsData {
  patients: {
    results: Patient[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface GrowthPoint {
  month: string;
  total: number;
}

export interface GrowthResponse {
  patientGrowth: GrowthPoint[];
}

// ─── Normalized / UI types ────────────────────────────────────────────────────

/** Patient shape after normalization in usePatientsViewData */
export interface NormalizedPatient extends Patient {
  name: string; // = fullName
  idNumber: string; // = ci
  image?: string; // = imageUrl
}
// ─── Zod types
export type CreatePatientVars = Omit<
  PatientFormData,
  | "photo"
  | "dob"
  | "idCard"
  | "diagnostico"
  | "residenciaActual"
  | "ciTutor"
  | "tutorPhone"
  | "contactEmail"
> & {
  authorId: string;
  ci?: string;
  birthDate?: string;
  diagnosis?: string;
  residence?: string;
  imageUrl?: string;
  tutorName?: string;
  tutorCi?: string;
  tutorCelular?: string;
  tutorEmail?: string;
};

export type UpdatePatientVars = {
  id: string;
  imageUrl?: string;
  residence?: string;
  diagnosis?: string;
  registrationComplete?: boolean;
};

export type UpdateClinicalNotesVars = {
  patientId: string | number;
  authorId: string;
  notes: { category: string; content?: string }[];
};
