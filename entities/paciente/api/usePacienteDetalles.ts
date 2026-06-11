import { useQuery } from "@apollo/client/react";
import { OBTENER_DETALLES_PACIENTE } from "./consultas";

export const usePacienteDetalles = (id: string) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_DETALLES_PACIENTE, {
    variables: { id },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  return {
    paciente: data?.patient,
    cargando: loading,
    error,
    refetch,
  };
};
