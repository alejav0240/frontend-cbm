import { useQuery } from "@apollo/client/react";
import { OBTENER_DETALLES_PACIENTE } from "./consultas";
import { ObtenerDetallesPacienteQuery } from "@/shared/api/generated/graphql";
import { serializarDetallesPaciente } from "@/entities/paciente";
import { PacienteDetalleSerializado } from "../model/tipos";

export const usePacienteDetalles = (id: string) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerDetallesPacienteQuery>(OBTENER_DETALLES_PACIENTE, {
      variables: { id },
      skip: !id,
      notifyOnNetworkStatusChange: true,
    });

  const pacienteSerializado: PacienteDetalleSerializado | undefined =
    data?.patient ? serializarDetallesPaciente(data.patient) : undefined;

  return {
    paciente: pacienteSerializado,
    cargando: loading,
    error,
    refetch,
  };
};
