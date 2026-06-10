import { SessionFormData } from "@/modules/atencion/sesiones/schemas/schema";

export interface SesionType {
    id: string;
    createdAt: Date;
    durationMinutes: number;
    cycleNumber: number;
    notes: string[];
    paymentStatus: string;
    paymentStatusDisplay: string;
    sessionDate: Date;
    sessionNumber: number;
    sessionStatus: string;
    sessionType: string;
    sessionTypeDisplay: string;
    videoUrl?: string;
    group?: {
        id: string;
        description: string;
        name: string;
        institution: { name: string };
    };
    patient?: { id: string; fullName: string };
    therapist: { fullName: string };
}

export interface SesionData {
    sessions: SesionType[];
}

export interface filtersData {
    patientId: string;
    paymentStatus: string;
    sessionStatus: string;
    therapistId: string;
    sessionType: string;
}

export interface NormalizedSession {
    id: string;
    patientId: string | null;
    patientName: string;
    institutionName?: string;
    sessionNum: number;
    date: string;
    time: string;
    status: string;
    statusDisplay: string;
    payment: string;
    paymentDisplay: string;
    duration: string;
    therapist: string;
    type: string;
    notes: string;
    recordingUrl?: string;
}

export type CreateSessionVars = Pick<SessionFormData, 'patientId' | 'therapistId' | 'sessionType' | 'durationMinutes' | 'notes'> & {
    sessionDate: string;
};

export type UpdateSessionVars = {
    id: string;
    notes?: string;
    durationMinutes?: number;
    videoUrl?: string;
    sessionStatus?: string;
};

export interface FilterConfig {
    key: string;
    label: string;
    type: 'select' | 'date-range' | 'text';
    options?: { value: string; label: string }[];
}
