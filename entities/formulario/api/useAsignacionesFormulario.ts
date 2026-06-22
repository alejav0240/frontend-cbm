import { useQuery } from "@apollo/client/react";
import { OBTENER_ASIGNACIONES_FORMULARIO } from "./consultas";
import type {
  ObtenerAsignacionesFormularioQuery,
  ObtenerAsignacionesFormularioQueryVariables,
} from "@/shared/api/generated/graphql";

export const useAsignacionesFormulario = (patientId?: string) => {
  const { data, loading, error, refetch } = useQuery<
    ObtenerAsignacionesFormularioQuery,
    ObtenerAsignacionesFormularioQueryVariables
  >(OBTENER_ASIGNACIONES_FORMULARIO, {
    variables: { patientId },
    skip: !patientId,
    notifyOnNetworkStatusChange: true,
  });

  return {
    asignaciones: data?.formAssignments ?? [],
    cargando: loading,
    error,
    refetch,
  };
};
