import { useQuery } from "@apollo/client/react";
import { OBTENER_CRECIMIENTO_PACIENTES } from "./consultas";
import { PuntoCrecimiento } from "../model/tipos";
import { ObtenerCrecimientoPacientesQuery } from "@/shared/api/generated/graphql";

export const usePacienteCrecimiento = () => {
  const { data, loading, error } = useQuery<ObtenerCrecimientoPacientesQuery>(
    OBTENER_CRECIMIENTO_PACIENTES,
  );

  return {
    datosCrecimiento: data?.patientGrowth || [],
    cargando: loading,
    error,
  };
};
