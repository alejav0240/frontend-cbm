import { useQuery } from "@apollo/client/react";
import { OBTENER_FORMULARIOS } from "./consultas";
import type { ObtenerFormulariosQuery } from "@/shared/api/generated/graphql";

export const useFormularios = () => {
  const { data, loading, error, refetch } = useQuery<ObtenerFormulariosQuery>(
    OBTENER_FORMULARIOS,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    formularios: data?.forms ?? [],
    cargando: loading,
    error,
    refetch,
  };
};
