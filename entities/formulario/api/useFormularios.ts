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

  const forms = data?.forms ?? [];
  return {
    formularios: forms.filter((f): f is NonNullable<typeof f> => f != null),
    cargando: loading,
    error,
    refetch,
  };
};
