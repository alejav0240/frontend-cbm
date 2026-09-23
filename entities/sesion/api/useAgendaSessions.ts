import { useQuery } from "@apollo/client/react";
import { OBTENER_SESIONES } from "./consultas";
import { SesionAgenda } from "../model/tipos-agenda";
import { useMemo } from "react";
import { ObtenerSesionesQuery } from "@/shared/api/generated/graphql";

export interface UseAgendaSessionsProps {
  month: Date;
  selectedDate?: Date; // fecha seleccionada para las vistas por hora/terapeuta
  therapistId?: string;
  range?: "month" | "today";
  skip?: boolean;
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--:--";
    // Bolivia es UTC-4, mostramos la hora local del sistema
    // getUTCHours - 4 = hora Bolivia
    const utcH = date.getUTCHours();
    const boliviaH = (utcH - 4 + 24) % 24;
    const m = String(date.getUTCMinutes()).padStart(2, "0");
    return `${String(boliviaH).padStart(2, "0")}:${m}`;
  } catch {
    return "--:--";
  }
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    // Convertimos a hora Bolivia (UTC-4) para obtener el día correcto
    const boliviaMs = date.getTime() - 4 * 60 * 60 * 1000;
    const boliviaDate = new Date(boliviaMs);
    const y = boliviaDate.getUTCFullYear();
    const m = String(boliviaDate.getUTCMonth() + 1).padStart(2, "0");
    const d = String(boliviaDate.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
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
    case "CONFIRMA":
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

type RawSession = NonNullable<
  NonNullable<ObtenerSesionesQuery["sessions"]>["sessions"]
>[number];

function mapToSesionAgenda(s: NonNullable<RawSession>): SesionAgenda {
  const fechaStr = s.fechaSesion as string | null | undefined;
  return {
    id: s.id,
    databaseId: (s as { databaseId?: number }).databaseId ?? undefined,
    patientId: s.paciente?.id || undefined,
    patientName: s.paciente?.fullName || "Sin paciente",
    therapistId: s.terapeuta?.id || undefined,
    time: fechaStr ? formatTime(fechaStr) : "--:--",
    status: mapStatus(s.estadoSesion),
    therapist: s.terapeuta?.fullName || "Sin terapeuta",
    duration: s.duracionMinutos ? `${s.duracionMinutos} min` : "—",
    durationMinutes: s.duracionMinutos || undefined,
    isTest: false,
    recordingUrl: s.videoUrl || undefined,
    date: fechaStr ? formatDate(fechaStr) : "",
    type: s.tipoSesionMostrado || undefined,
    notes: s.notas || undefined,
  };
}

export function useAgendaSessions({
  month,
  selectedDate,
  therapistId,
  range = "month",
  skip = false,
}: UseAgendaSessionsProps) {
  const todayStr = useMemo(() => {
    const year = month.getFullYear();
    const monthNumber = String(month.getMonth() + 1).padStart(2, "0");
    const day = String(month.getDate()).padStart(2, "0");
    return `${year}-${monthNumber}-${day}`;
  }, [month]);

  // ── Rango 3 meses: mes anterior, actual y siguiente ──────────────────────
  const dateFrom3m = useMemo(() => {
    // Primer día del mes anterior
    if (range === "today") return todayStr;
    const d = new Date(Date.UTC(month.getFullYear(), month.getMonth() - 1, 1));
    return d.toISOString().split("T")[0];
  }, [month, range, todayStr]);

  const dateTo3m = useMemo(() => {
    // Último día del mes siguiente
    if (range === "today") return todayStr;
    const d = new Date(Date.UTC(month.getFullYear(), month.getMonth() + 2, 0));
    return d.toISOString().split("T")[0];
  }, [month, range, todayStr]);

  // Query 1: sesiones con fecha en ventana de 3 meses (para calendario)
  const query3m = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: {
      therapistId: therapistId || "",
      dateFrom: dateFrom3m,
      dateTo: dateTo3m,
      includeNoDate: false,
      page: 1,
      pageSize: range === "today" ? 50 : 500,
      byCycles: false,
    },
    skip,
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // ── Query 2: sesiones AGENDADA sin fecha → panel "Sin programar" ─────────
  const querySinFecha = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: {
      therapistId: therapistId || "",
      sessionStatus: "AGENDADA",
      page: 1,
      pageSize: 50,
      byCycles: false,
    },
    skip: skip || range === "today",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // dateStr para la query del día: usamos la fecha local del selectedDate
  // tal como la ve el usuario (no UTC), ya que el backend filtra por session_date__date
  // que compara en UTC, y las sesiones se guardan con offset -04:00 correcto.
  const dateStr = useMemo(() => {
    if (!selectedDate) return null;
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const queryDia = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: {
      therapistId: therapistId || "",
      dateFrom: dateStr,
      dateTo: dateStr,
      includeNoDate: false,
      page: 1,
      pageSize: 100,
      byCycles: false,
    },
    skip: skip || !dateStr || range === "today",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // ── Sesiones del mes actual para el calendario ───────────────────────────
  const sesiones = useMemo<SesionAgenda[]>(() => {
    const raw = (query3m.data?.sessions?.sessions ?? []).filter(
      (s): s is NonNullable<typeof s> => s !== null,
    );
    return raw
      .filter((s) => {
        if (!s.fechaSesion) return false;
        const d = new Date(s.fechaSesion as string);
        if (isNaN(d.getTime())) return false;
        // Comparamos en hora Bolivia (UTC-4)
        const boliviaMs = d.getTime() - 4 * 60 * 60 * 1000;
        const boliviaDate = new Date(boliviaMs);
        if (range === "today")
          return formatDate(s.fechaSesion as string) === todayStr;
        return (
          boliviaDate.getUTCFullYear() === month.getFullYear() &&
          boliviaDate.getUTCMonth() === month.getMonth()
        );
      })
      .map(mapToSesionAgenda)
      .sort((a, b) => {
        const cmp = a.date.localeCompare(b.date);
        return cmp !== 0 ? cmp : a.time.localeCompare(b.time);
      });
  }, [query3m.data, month, range, todayStr]);

  // ── Todas las sesiones de los 3 meses (para HourlyView / TherapistView) ──
  // Incluye cualquier fecha del rango, no solo el mes actual
  const todasSesiones3m = useMemo<SesionAgenda[]>(() => {
    const raw = (query3m.data?.sessions?.sessions ?? []).filter(
      (s): s is NonNullable<typeof s> => s !== null && !!s.fechaSesion,
    );
    return raw.map(mapToSesionAgenda).sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return cmp !== 0 ? cmp : a.time.localeCompare(b.time);
    });
  }, [query3m.data]);

  // ── Sesiones del día seleccionado (query dedicada) ───────────────────────
  const sesionesDia = useMemo<SesionAgenda[]>(() => {
    const raw = (queryDia.data?.sessions?.sessions ?? []).filter(
      (s): s is NonNullable<typeof s> => s !== null,
    );
    return raw
      .map(mapToSesionAgenda)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [queryDia.data]);

  // ── Sin fecha: solo AGENDADA sin fecha asignada ──────────────────────────
  const sesionesSinFecha = useMemo<SesionAgenda[]>(() => {
    const raw = (querySinFecha.data?.sessions?.sessions ?? []).filter(
      (s): s is NonNullable<typeof s> => s !== null,
    );
    return raw.filter((s) => !s.fechaSesion).map(mapToSesionAgenda);
  }, [querySinFecha.data]);

  const refetch = () => {
    query3m.refetch();
    if (range !== "today") querySinFecha.refetch();
    if (dateStr) queryDia.refetch();
  };

  return {
    sesiones, // mes actual → CalendarView
    todasSesiones3m, // 3 meses → para búsquedas/filtros si se necesita
    sesionesDia, // día seleccionado → HourlyView / TherapistView
    sesionesSinFecha, // sin fecha → sidebar panel
    cargando: query3m.loading,
    cargandoDia: queryDia.loading,
    error: query3m.error,
    refetch,
  };
}
