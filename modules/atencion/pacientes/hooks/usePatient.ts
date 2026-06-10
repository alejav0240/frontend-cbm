import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import {
    CREATE_PATIENT,
    DELETE_PATIENT,
    GET_PATIENT_DETAILS,
    GET_PATIENTS, SEARCH_PATIENTS,
    UPDATE_CLINICAL_NOTES,
    UPDATE_PATIENT
} from "@/modules/atencion/pacientes";
import { useMemo } from "react";
import {
    CreatePatientVars, PatientDetailsData, PatientFilter,
    PatientsData, SearchPatientData,
    UpdateClinicalNotesVars,
    UpdatePatientVars
} from "@/modules/atencion/pacientes/types/patient";
import { useLoadingStore, LOADING_KEYS } from "@/shared/store/loadingStore";

const K = LOADING_KEYS.pacientes;

export function usePatientDetails(id: string) {
    const { data, loading, error, refetch } = useQuery<PatientDetailsData>(GET_PATIENT_DETAILS, {
        variables: { id },
        skip: !id,
        notifyOnNetworkStatusChange: true
    });

    return { patient: data?.data, isLoading: loading, error, refetch };
}

export function useSearchPatients({
      search = "",
      pageSize = 10
  }:PatientFilter) {
    const { data, loading, error, refetch } = useQuery<SearchPatientData>(SEARCH_PATIENTS, {
        variables: { search, pageSize },
        notifyOnNetworkStatusChange: true
    });

    return { patient: data?.patients.results, isLoading: loading, error, refetch };
}

export function usePatients({
    search = "",
    page = 1,
    status = "Todos",
    pageSize = 8
}:PatientFilter) {
    const { start, stop } = useLoadingStore();

    const { data, error, refetch, loading } = useQuery<PatientsData>(GET_PATIENTS, {
        variables: {
            page,
            pageSize,
            search: search || undefined,
            status: status === "Todos" ? undefined : status.toLowerCase()
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        loading ? start(K.list) : stop(K.list);
    }, [loading]);

    const patients = useMemo(() => data?.patients?.results || [], [data]);

    const [addMutation, { loading: isAdding }] = useMutation(CREATE_PATIENT, { onCompleted: () => refetch() });
    const [updateMutation] = useMutation(UPDATE_PATIENT, { onCompleted: () => refetch() });
    const [updateNotesMutation] = useMutation(UPDATE_CLINICAL_NOTES, { onCompleted: () => refetch() });
    const [deleteMutation] = useMutation<{ deletePatient: { success: boolean; message: string } }>(DELETE_PATIENT, { onCompleted: () => refetch() });

    useEffect(() => {
        isAdding ? start(K.create) : stop(K.create);
    }, [isAdding]);

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
