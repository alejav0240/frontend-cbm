import {SearchPatient} from '@/modules/atencion/pacientes/types/patient';

export interface Question{
    id: string;
    question: string;
    questionType: string;
    isRequired: boolean;
    orderIndex: number;
}
export interface Form {
    id: string;
    name: string;
    description: string;
    questions: Question[];
}
export interface FormDataResponse {
    forms: Form[];
}
export interface FormFilter {
    search: string;
}

export interface Response {
    id: string;
    response: string;
    respondedAt: string;
    question:{
        id: string;
        question: string;
    }
}

export interface FormAsignment {
    id: string;
    createdAt: string;
    form: Form;
    assignedTo:SearchPatient;
    assignedBy:SearchPatient;
    patient:SearchPatient;
    responses:Response[];
}