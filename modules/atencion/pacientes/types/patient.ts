// ─── GraphQL / API types ──────────────────────────────────────────────────────

export interface Patient {
    id: string;
    databaseId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    ci: string;
    status: string;
    registrationComplete: boolean;
    diagnosis: string;
    birthDate: string;
    createdAt: string;
    imageUrl?: string;
    tutor: {
        id: number;
        firstName: string;
        celular: number;
    };
    // Clinical notes (populated after registration is complete)
    objetivosGenerales?: string;
    fisico?: string;
    emocional?: string;
    cognitivo?: string;
    social?: string;
    metodosAUsar?: string;
    notas?: string;
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
    name: string;       // = fullName
    idNumber: string;   // = ci
    image?: string;     // = imageUrl
}
