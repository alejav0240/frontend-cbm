import {therapeuticSessions} from "@/modules/atencion/sesiones/types/session";

export interface group {
    id: string;
    name: string;
    description?: string;
}

export interface institucion {
    id: string;
    name: string;
    address: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    groups: group[];
}

export interface institucionResponse {
    institutions: institucion[];
}

export interface institucionDetails {
    institution: institucion;
}

export interface groupDetails {
    id: string;
    name: string;
    description?: string;
    therapeuticSessions:therapeuticSessions;
}

export interface groupDetailsResponse {
    institutionGroup: groupDetails;
}