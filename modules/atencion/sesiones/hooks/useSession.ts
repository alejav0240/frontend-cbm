import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import {
  SesionData,
  filtersData,
} from "@/modules/atencion/sesiones/types/session";
import { GET_SESSIONS } from "@/modules/atencion/sesiones/graphql/query";
import { useLoadingStore } from "@/shared/store/loadingStore";

const LOADING_KEY = "sesiones.list";

export function useSessions(filters: filtersData) {
  const { start, stop } = useLoadingStore();

  const { data, error, refetch, loading } = useQuery<SesionData>(GET_SESSIONS, {
    variables: {
      patientId: filters.patientId || "",
      paymentStatus: filters.paymentStatus || "",
      sessionStatus: filters.sessionStatus || "",
      therapistId: filters.therapistId || "",
      sessionType: filters.sessionType || "",
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    loading ? start(LOADING_KEY) : stop(LOADING_KEY);
  }, [loading, start, stop]);

  const sessions = useMemo(() => {
    if (!data?.sessions) return [];

    return data.sessions.filter(
      (sesion) => sesion !== null && sesion !== undefined,
    );
  }, [data]);

  return {
    sessions,
    isLoading: loading,
    error,
    refetch,
  };
}
