import {useQuery} from "@apollo/client/react";
import {OBTENER_CICLOS, OBTENER_SESIONES} from "./consultas";
import {SesionFiltros, SesionNormalizada} from "../model/tipos";
import {useMemo} from "react";
import {
    ObtenerCiclosQuery,
    ObtenerSesionesQuery,
} from "@/shared/api/generated/graphql";

export const useSesiones = (filtros: SesionFiltros = {}) => {
    const {data, loading, error, refetch} = useQuery<ObtenerSesionesQuery>(
        OBTENER_SESIONES,
        {
            variables: {
                patientId: filtros.pacienteId || "",
                paymentStatus: filtros.estadoPago || "",
                sessionStatus: filtros.estadoSesion || "",
                therapistId: filtros.terapeutaId || "",
                sessionType: filtros.tipoSesion || "",
                page: filtros.page || 1,
                pageSize: filtros.pageSize || 10,
                byCycles: filtros.verCiclo || false,
            },
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

                    // SOLUCIÓN ESLINT ANY: Casteamos a 'string' en lugar de 'any' si existe el valor
                    const fechaObjeto = s.fechaSesion
                        ? new Date(s.fechaSesion as string)
                        : new Date();
                    const esFechaValida = !isNaN(fechaObjeto.getTime());

                    return {
                        id: s.id,
                        pacienteId: s.paciente?.id || null,
                        pacienteNombre: s.paciente?.fullName || "Sin paciente",
                        institucionNombre:
                            s.grupo?.institucion?.nombre || "Sin institución",
                        numeroSesion: s.numeroSesion || 0,
                        fecha: esFechaValida
                            ? new Intl.DateTimeFormat("es-ES").format(fechaObjeto)
                            : "Fecha inválida",
                        hora: esFechaValida
                            ? new Intl.DateTimeFormat("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }).format(fechaObjeto)
                            : "--:--",
                        estado: s.estadoSesion,
                        estadoMostrado:
                            s.estadoSesion === "COMPLETA"
                                ? "Completada"
                                : s.estadoSesion === "AGENDADA"
                                    ? "Pendiente"
                                    : "Cancelada",
                        pago: s.estadoPago,
                        pagoMostrado: s.estadoPagoMostrado || "No procesado",
                        // Blindamos el posible 'null' de duracionMinutos usando el operador nullish coalescing
                        duracion: `${s.duracionMinutos ?? 0} min`,
                        terapeuta: s.terapeuta?.fullName || "Sin terapeuta asignado",
                        tipo: s.tipoSesionMostrado || "Regular",
                        notas: notasFormateadas,
                        urlGrabacion: s.videoUrl || undefined,
                    };
                })
        );
    }, [data]);

    return {
        sesiones: sesionesNormalizadas,
        cargando: loading,
        error,
        refetch,
    };
};

export const useCiclos = (filtros: SesionFiltros = {}) => {
    const {data, loading, error, refetch} = useQuery<ObtenerCiclosQuery>(
        OBTENER_CICLOS,
        {
            variables: {
                patientId: filtros.pacienteId || "",
                paymentStatus: filtros.estadoPago || "",
                sessionStatus: filtros.estadoSesion || "",
                therapistId: filtros.terapeutaId || "",
                sessionType: filtros.tipoSesion || "",
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
        return primerCiclo.sessions.filter((s): s is NonNullable<typeof s> => s !== null);
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