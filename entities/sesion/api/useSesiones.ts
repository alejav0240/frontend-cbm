import { useMutation, useQuery } from "@apollo/client/react";
import { OBTENER_CICLOS, OBTENER_SESIONES } from "./consultas";
import { CREAR_CICLO } from "./mutaciones";
import { SesionFiltros, SesionNormalizada } from "../model/tipos";
import { useMemo } from "react";
import {
  ObtenerCiclosQuery,
  ObtenerSesionesQuery,
  CreateCycleMutation,
  CreateCycleMutationVariables,
} from "@/shared/api/generated/graphql";

export const useSesiones = (filtros: SesionFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerSesionesQuery>(
    OBTENER_SESIONES,
    {
      variables: {
        patientId: filtros.pacienteId || "",
        paymentStatus: filtros.estadoPago || "",
        sessionStatus: filtros.estadoSesion || "",
        therapistId: filtros.terapeutaId || "",
        sessionType: filtros.tipoSesion || "",
        dateFrom: filtros.fechaDesde || null,
        dateTo: filtros.fechaHasta || null,
        includeNoDate: false,
        page: filtros.page || 1,
        pageSize: filtros.pageSize || 10,
        byCycles: filtros.verCiclo || false,
        search: filtros.busqueda || "",
      },
      skip: filtros.skip,
      notifyOnNetworkStatusChange: true,
    },
  );

  const sesionesNormalizadas: SesionNormalizada[] = useMemo(() => {
    if (!data?.sessions?.sessions) return [];

    return (
      data.sessions.sessions
        // 1. Filtramos los elementos null que puedan venir en el array del backend
        .filter((s): s is NonNullable<typeof s> => s !== null)
        // 2. Transformamos y normalizamos directamente a 'SesionNormalizada'
        .map((s) => {
          // Aseguramos de manera segura que las notas sean un string plano antes de asignarlo
          const notasFormateadas = Array.isArray(s.notas)
            ? s.notas.join("\n")
            : s.notas || "Sin notas";

          // Parseamos la fecha solo si existe y es válida.
          // Usamos UTC explícito para evitar desfases de zona horaria:
          // el backend envía DateTime con timezone (ej: "2026-08-15T10:00:00+00:00"),
          // y new Date() lo interpreta correctamente en ISO 8601.
          const fechaRaw = s.fechaSesion as string | null | undefined;
          const fechaObjeto = fechaRaw ? new Date(fechaRaw) : null;
          const esFechaValida =
            fechaObjeto !== null && !isNaN(fechaObjeto.getTime());

          const fechaMostrada = esFechaValida
            ? new Intl.DateTimeFormat("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "America/La_Paz",
              }).format(fechaObjeto!)
            : "Sin fecha";

          const horaMostrada = esFechaValida
            ? new Intl.DateTimeFormat("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/La_Paz",
              }).format(fechaObjeto!)
            : "--:--";

          const estadoMostradoMap: Record<string, string> = {
            COMPLETA: "Completada",
            AGENDADA: "Pendiente",
            CONFIRMA: "Confirmada",
            REPROGRAMA: "Reprogramada",
            CANCELADA: "Cancelada",
          };
          const estadoNormalizado = String(s.estadoSesion ?? "").toUpperCase();

          return {
            id: s.id,
            databaseId: (s as { databaseId?: number }).databaseId ?? undefined,
            pacienteId: s.paciente?.id || null,
            pacienteNombre: s.paciente?.fullName || "Sin paciente",
            institucionNombre:
              s.grupo?.institucion?.nombre || "Sin institución",
            numeroSesion: s.numeroSesion || 0,
            fecha: fechaMostrada,
            hora: horaMostrada,
            estado: estadoNormalizado,
            estadoMostrado:
              estadoMostradoMap[estadoNormalizado] ??
              s.estadoSesion ??
              "Desconocido",
            pago: s.estadoPago,
            pagoMostrado: s.estadoPagoMostrado || "No procesado",
            // Blindamos el posible 'null' de duracionMinutos usando el operador nullish coalescing
            duracion: `${s.duracionMinutos ?? 0} min`,
            terapeuta: s.terapeuta?.fullName || "Sin terapeuta asignado",
            tipo: s.tipoSesionMostrado || "Regular",
            notas: notasFormateadas,
            urlGrabacion: s.videoUrl || undefined,
            videoStatus: s.videoStatus || "",
          };
        })
        // Conservamos el orden descendente del backend: las sesiones nuevas primero.
        .sort((a, b) => (b.databaseId ?? 0) - (a.databaseId ?? 0))
    );
  }, [data]);

  return {
    sesiones: sesionesNormalizadas,
    total: data?.sessions?.totalCount ?? 0,
    totalPages: data?.sessions?.totalPages ?? 0,
    currentPage: data?.sessions?.currentPage ?? 1,
    cargando: loading,
    error,
    refetch,
  };
};

export const useCiclos = (filtros: SesionFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerCiclosQuery>(
    OBTENER_CICLOS,
    {
      variables: {
        patientId: filtros.pacienteId || "",
        paymentStatus: filtros.estadoPago || "",
        sessionStatus: filtros.estadoSesion || "",
        therapistId: filtros.terapeutaId || "",
        sessionType: filtros.tipoSesion || "",
        dateFrom: filtros.fechaDesde || null,
        dateTo: filtros.fechaHasta || null,
        page: filtros.page || 1,
        pageSize: filtros.pageSize || 10,
        byCycles: filtros.verCiclo || true,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  // SOLUCIÓN TS18047: Encadenamiento opcional completo y fallback seguro a arreglos vacíos si es null o vacio.
  const primerCiclo = data?.sessions?.cycles?.[0];

  // Filtramos posibles elementos nulos dentro del array de sesiones internas del ciclo
  const sessions = useMemo(() => {
    if (!primerCiclo?.sessions) return [];
    return primerCiclo.sessions.filter(
      (s): s is NonNullable<typeof s> => s !== null,
    );
  }, [primerCiclo]);

  const ciclo = primerCiclo?.cycleNumber ?? 0;

  return {
    sesiones: sessions,
    ciclo: ciclo,
    currentPage: data?.sessions?.currentPage ?? 1,
    totalPages: data?.sessions?.totalPages ?? 0,
    cargando: loading,
    error,
    refetch,
  };
};

export const useCreateCycle = () => {
  const [mutate, { loading }] = useMutation<
    CreateCycleMutation,
    CreateCycleMutationVariables
  >(CREAR_CICLO);

  const createCycle = async (
    patientId: string,
    therapistId: string,
    startDate: string,
    numSessions: number,
  ) => {
    return mutate({
      variables: {
        patientId,
        therapistId,
        startDate,
        numSessions,
      },
    });
  };

  return { createCycle, creando: loading };
};
