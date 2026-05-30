import { useMutation, useQuery } from "@apollo/client/react";
import {
    CREATE_PATIENT,
    DELETE_PATIENT,
    GET_PATIENT_DETAILS,
    GET_PATIENTS,
    UPDATE_CLINICAL_NOTES,
    UPDATE_PATIENT
} from "@/modules/atencion/pacientes";
import { useMemo } from "react";
import { PatientsData } from "@/modules/atencion/pacientes/types/patient";
import { PatientFormData } from "@/modules/atencion/pacientes/schemas/schema";

type CreatePatientVars = Omit<PatientFormData, 'photo' | 'dob' | 'idCard' | 'diagnostico' | 'residenciaActual' | 'ciTutor' | 'tutorPhone' | 'contactEmail'> & {
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

type UpdatePatientVars = {
    id: string;
    imageUrl?: string;
    residence?: string;
    diagnosis?: string;
    registrationComplete?: boolean;
};

type UpdateClinicalNotesVars = {
    patientId: string;
    authorId: string;
    notes: { category: string; content?: string }[];
};

export function usePatientDetails(id: string) {
    const { data, loading, error, refetch } = useQuery(GET_PATIENT_DETAILS, {
        variables: { id },
        skip: !id,
        notifyOnNetworkStatusChange: true
    });

    return {
        patient: data?.patient,
        isLoading: loading,
        error,
        refetch,
    };
}

export function usePatients(
    filterTerm: string = "",
    page: number = 1,
    status: string = "Todos",
    pageSize: number = 8
) {
    const { data, error, refetch, loading } = useQuery<PatientsData>(GET_PATIENTS, {
        variables: {
            page,
            pageSize,
            search: filterTerm || undefined,
            status: status === "Todos" ? undefined : status.toLowerCase()
        },
        notifyOnNetworkStatusChange: true,
    });

    const patients = useMemo(() => data?.patients?.results || [], [data]);

    const [addMutation, { loading: isAdding }] = useMutation(CREATE_PATIENT, { onCompleted: () => refetch() });
    const [updateMutation] = useMutation(UPDATE_PATIENT, { onCompleted: () => refetch() });
    const [updateNotesMutation] = useMutation(UPDATE_CLINICAL_NOTES, { onCompleted: () => refetch() });
    const [deleteMutation] = useMutation<{ deletePatient: { success: boolean; message: string } }>(DELETE_PATIENT, { onCompleted: () => refetch() });

    return {
        patients,
        totalCount: data?.patients?.totalCount || 0,
        totalPages: data?.patients?.totalPages || 0,
        currentPage: data?.patients?.currentPage || 0,
        addPatient: (vars: CreatePatientVars) => addMutation({ variables: vars }),
        updatePatient: (vars: UpdatePatientVars) => updateMutation({ variables: vars }),
        updateClinicalNotes: (vars: UpdateClinicalNotesVars) => updateNotesMutation({ variables: vars }),
        deletePatient: (id: string) => deleteMutation({ variables: { id } }),
        isAdding,
        isLoading: loading,
        error,
        refetch
    };
}
