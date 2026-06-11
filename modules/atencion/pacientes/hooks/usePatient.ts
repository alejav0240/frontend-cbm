import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import {
  GET_PATIENT_DETAILS,
  GET_PATIENTS,
  SEARCH_PATIENTS,
} from "@/modules/atencion/pacientes";
import {
  PatientDetailsData,
  PatientFilter,
  PatientsData,
  SearchPatientData,
} from "@/modules/atencion/pacientes/types/patient";
import { useLoadingStore, LOADING_KEYS } from "@/shared/store/loadingStore";

const K = LOADING_KEYS.pacientes;

export function usePatientDetails(id: string) {
  const { data, loading, error, refetch } = useQuery<PatientDetailsData>(
    GET_PATIENT_DETAILS,
    {
      variables: { id },
      skip: !id,
      notifyOnNetworkStatusChange: true,
    },
  );

  return { patient: data?.data, isLoading: loading, error, refetch };
}

export function useSearchPatients({
  search = "",
  pageSize = 10,
}: PatientFilter) {
  const { data, loading, error, refetch } = useQuery<SearchPatientData>(
    SEARCH_PATIENTS,
    {
      variables: { search, pageSize },
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    patient: data?.patients.results,
    isLoading: loading,
    error,
    refetch,
  };
}

export function usePatients({
  search = "",
  page = 1,
  status = "Todos",
  pageSize = 8,
}: PatientFilter) {
  const { start, stop } = useLoadingStore();

  const { data, error, refetch, loading } = useQuery<PatientsData>(
    GET_PATIENTS,
    {
      variables: {
        page,
        pageSize,
        search: search || undefined,
        status: status === "Todos" ? undefined : status.toLowerCase(),
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    loading ? start(K.list) : stop(K.list);
  }, [loading, start]);

  const patients = useMemo(() => data?.patients?.results || [], [data]);

  return {
    patients,
    totalCount: data?.patients?.totalCount || 0,
    totalPages: data?.patients?.totalPages || 0,
    currentPage: data?.patients?.currentPage || 0,
    isLoading: loading,
    error,
    refetch,
  };
}
