import { useQuery } from "@apollo/client/react";
import { OBTENER_CRECIMIENTO_PACIENTES } from "./consultas";
import { PuntoCrecimiento } from "../model/tipos";

export const usePacienteCrecimiento = () => {
  const { data, loading, error } = useQuery<any>(OBTENER_CRECIMIENTO_PACIENTES);

  return {
    datosCrecimiento: data?.patientGrowth || [],
    cargando: loading,
    error,
  };
};
