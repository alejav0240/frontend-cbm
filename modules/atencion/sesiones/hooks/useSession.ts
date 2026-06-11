import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import {
  SesionData,
  filtersData,
} from "@/modules/atencion/sesiones/types/session";
import { GET_SESSIONS } from "@/modules/atencion/sesiones/graphql/query";
import { useLoadingStore } from "@/shared/store/loadingStore";
import {
  CREATE_SESSION,
  UPDATE_SESSION,
  UPDATE_SESSION_PAYMENT,
  DELETE_SESSION,
  ADD_SESSION_RESOURCE,
} from "@/modules/atencion/sesiones/graphql/mutation";

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
  }, [loading]);

  const sessions = useMemo(() => {
    if (!data?.sessions) return [];

    // Filtramos cualquier sesión inválida, nula o indefinida que venga de la API
    return data.sessions.filter(
      (sesion) => sesion !== null && sesion !== undefined,
    );
  }, [data]);

  const [createMutation, { loading: isCreating }] = useMutation(
    CREATE_SESSION,
    { onCompleted: () => refetch() },
  );
  const [updateMutation] = useMutation(UPDATE_SESSION, {
    onCompleted: () => refetch(),
  });
  const [updatePaymentMutation, { loading: isUpdating }] = useMutation(
    UPDATE_SESSION_PAYMENT,
    { onCompleted: () => refetch() },
  );
  const [deleteMutation] = useMutation(DELETE_SESSION, {
    onCompleted: () => refetch(),
  });
  const [addResourceMutation] = useMutation(
      ADD_SESSION_RESOURCE,
      { onCompleted: () => refetch() },
  )

  return {
    sessions,
    addSession: (variables: object) => createMutation({ variables }),
    updateSession: (variables: object) => updateMutation({ variables }),
    updatePayment: (id: string, paymentStatus: string) => updatePaymentMutation({ variables: { id, paymentStatus } }),
    deleteSession: (id: string) => deleteMutation({ variables: { id } }),
    addResourceMutation,
    isCreating,
    isUpdating,
    isLoading: loading,
    error,
    refetch,
  };
}
