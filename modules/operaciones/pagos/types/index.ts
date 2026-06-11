import {SearchPatient} from "@/modules/atencion/pacientes/types/patient";
import {StyledString} from "next/dist/build/swc/types";

export interface discount{
    id: string;
    name: string;
    value: string;//todo revisar si hay que cambiar a number
    type: string;
    description: string;
}

export interface discountResponse{
    discounts: discount[];
}

export interface payment{
    id: string;
    sessionsCount: number;
    pricePerSession: string;
    amountPaid: string;
    totalAmount: number;
    debt: number;
    paymentMethod: string;
    paymentDate: Date;
    paymentStatus: string;
    patient: SearchPatient;
    discount: discount;
}

export interface paymentResponse {
    payments: {
        objects:payment[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
};

export interface paymentFilters {
    patientId: string, //es el id codificado en base 
    paymentStatus: string,
    search: string,
    page: number,
    pageSize: number,
}