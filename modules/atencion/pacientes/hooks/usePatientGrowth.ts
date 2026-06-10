import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_GROWTH } from "@/modules/atencion/pacientes";
import { GrowthResponse } from "@/modules/atencion/pacientes/types/patient";
import { useLoadingStore, LOADING_KEYS } from "@/shared/store/loadingStore";

export function usePatientGrowth() {
  const { start, stop } = useLoadingStore();
  const { data, loading } = useQuery<GrowthResponse>(GET_GROWTH);

  useEffect(() => {
    loading
      ? start(LOADING_KEYS.pacientes.growth)
      : stop(LOADING_KEYS.pacientes.growth);
  }, [loading]);

  return {
    growthData: data?.patientGrowth || [],
    isLoading: loading,
  };
}
