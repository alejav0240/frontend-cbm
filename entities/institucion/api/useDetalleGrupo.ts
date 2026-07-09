import { useQuery } from "@apollo/client/react";
import { OBTENER_DETALLE_GRUPO } from "./consultas";
import { DetalleGrupo } from "../model/tipos";
import { useMemo } from "react";

interface GetGroupDetailResponse {
  institutionGroup: {
    id: string;
    name: string;
    description: string | null;
    therapeuticSessions: Array<{
      id: string;
      sessionNumber: number;
      sessionDate: string;
      sessionStatus: string;
      paymentStatus: string;
      durationMinutes: number | null;
      therapist: { fullName: string | null } | null;
      notes: string | null;
    } | null> | null;
  } | null;
}

export const useDetalleGrupo = (id: string) => {
  const { data, loading, error } = useQuery<GetGroupDetailResponse>(
    OBTENER_DETALLE_GRUPO,
    { variables: { id }, skip: !id },
  );

  const grupo = useMemo((): DetalleGrupo | null => {
    if (!data?.institutionGroup) return null;
    const g = data.institutionGroup;
    return {
      id: g.id,
      nombre: g.name,
      descripcion: g.description,
      sesiones: (g.therapeuticSessions || [])
        .filter(Boolean)
        .map((s) => ({
          id: s!.id,
          numeroSesion: s!.sessionNumber,
          fechaSesion: s!.sessionDate,
          estadoSesion: s!.sessionStatus,
          estadoPago: s!.paymentStatus,
          duracionMinutos: s!.durationMinutes,
          terapeuta: s!.therapist,
          notas: s!.notes,
        })),
    };
  }, [data]);

  return { grupo, cargando: loading, error };
};
