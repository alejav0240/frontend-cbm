import {SearchPatient} from "@/modules/atencion/pacientes/types/patient";

export interface PlanStep{
    id: string;
    moment: string;
    durationMinutes: number;
    objective: string,
    focus: string,
    musicalResources: string,
    musicalEmphasis: string,
    approach: string,
    mltMethod: string,
    orderIndex: number,
    isCompleted: boolean
}

export interface Plan {
    id: string;
    mainObjective: string;
    startDate: string;
    endDate?: string;
    progressPercent: number;
    status: string;
    patient: SearchPatient;
    steps: PlanStep[];
}

export interface PlanData {
    interventionPlans: {
        results: Plan[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface PlanFilters {
    page: number;
    pageSize: number;
    patientId: number
    search: string;
}