import {useQuery} from "@apollo/client/react";
import {OBTENER_SESIONES} from "./consultas";
import {SesionAgenda} from "../model/tipos-agenda";
import {useMemo} from "react";
import {ObtenerSesionesQuery} from "@/shared/api/generated/graphql";

interface UseAgendaSessionsProps {
  month: Date;
  therapistId?: string;
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function mapStatus(status: string): string {
  switch (status) {
    case "COMPLETA":
      return "Completada";
    case "AGENDADA":
      return "Pendiente";
    case "CONFIRMADA":
      return "Confirmada";
    case "CANCELADA":
      return "Cancelada";
    case "REPROGRAMA":
      return "Reprogramada";
    default:
      return status;
  }
}

export function useAgendaSessions({month, therapistId}: UseAgendaSessionsProps) {
  const year = month.getFullYear();
  const monthNum = month.getMonth();

  const {data, loading, error, refetch} = useQuery<ObtenerSesionesQuery>(
    OBTENER_SESIONES,
    {
      variables: {
        therapistId: therapistId || "",
        page: 1,
        pageSize: 100,
        byCycles: false,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const sesiones = useMemo<SesionAgenda[]>(() => {
    const raw = data?.sessions?.sessions ?? [];
    return raw
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .filter((s) => {
        if (!s.fechaSesion) return false;
        const d = new Date(s.fechaSesion as string);
        return !isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === monthNum;
      })
      .map((s) => {
        const fechaStr = s.fechaSesion as string;
        return {
          id: s.id,
          databaseId: (s as any).databaseId ?? undefined,
          patientId: s.paciente?.id || undefined,
          patientName: s.paciente?.fullName || "Sin paciente",
          therapistId: (s.terapeuta as any)?.id || undefined,
          time: formatTime(fechaStr),
          status: mapStatus(s.estadoSesion),
          therapist: s.terapeuta?.fullName || "Sin terapeuta",
          duration: s.duracionMinutos ? `${s.duracionMinutos} min` : "—",
          durationMinutes: s.duracionMinutos || undefined,
          isTest: false,
          recordingUrl: s.videoUrl || undefined,
          date: formatDate(fechaStr),
          type: s.tipoSesionMostrado || undefined,
          notes: s.notas || undefined,
        };
      });
  }, [data, year, monthNum]);

  return {
    sesiones,
    cargando: loading,
    error,
    refetch,
  };
}
