import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { OBTENER_CICLOS_PACIENTE } from "./consultas";
import type { ObtenerCiclosPacienteQuery } from "@/shared/api/generated/graphql";

export type CicloCompleto = NonNullable<
  NonNullable<ObtenerCiclosPacienteQuery["patientCycles"]>[number]
>;

export type SesionCicloCompleta = NonNullable<
  NonNullable<CicloCompleto["sessions"]>[number]
>;

/**
 * Devuelve TODOS los ciclos del paciente con sus sesiones completas
 * (terapeuta, recursos, materiales y evaluaciones con subescalas/valores).
 * Se usa para el informe clínico.
 */
export function useCiclosCompletos(pacienteId?: string) {
  const { data, loading, error, refetch } =
    useQuery<ObtenerCiclosPacienteQuery>(OBTENER_CICLOS_PACIENTE, {
      variables: { patientId: pacienteId },
      skip: !pacienteId,
      notifyOnNetworkStatusChange: true,
    });

  const ciclos = useMemo(
    () =>
      (data?.patientCycles ?? []).filter((c): c is CicloCompleto => c !== null),
    [data],
  );

  const sesiones = useMemo(
    () =>
      ciclos
        .flatMap((c) => c.sessions ?? [])
        .filter((s): s is SesionCicloCompleta => s !== null),
    [ciclos],
  );

  return { ciclos, sesiones, cargando: loading, error, refetch };
}
