import { useQuery } from "@apollo/client/react";
import { OBTENER_ESCALAS } from "./consultas";
import type { ObtenerEscalasQuery } from "@/shared/api/generated/graphql";

export const useEscalas = () => {
  const { data, loading, error, refetch } = useQuery<ObtenerEscalasQuery>(
    OBTENER_ESCALAS,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    escalas: data?.scales?.results ?? [],
    cargando: loading,
    error,
    refetch,
  };
};
