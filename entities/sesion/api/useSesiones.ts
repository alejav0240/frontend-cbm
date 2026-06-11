import { useQuery } from "@apollo/client/react";
import { OBTENER_SESIONES } from "./consultas";
import { Sesion, SesionFiltros, SesionNormalizada } from "../model/tipos";
import { useMemo } from "react";

export const useSesiones = (filtros: SesionFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_SESIONES, {
    variables: {
      patientId: filtros.pacienteId || "",
      paymentStatus: filtros.estadoPago || "",
      sessionStatus: filtros.estadoSesion || "",
      therapistId: filtros.terapeutaId || "",
      sessionType: filtros.tipoSesion || "",
    },
    notifyOnNetworkStatusChange: true,
  });

  const sesiones: Sesion[] = useMemo(() => data?.sessions || [], [data]);

  const sesionesNormalizadas: SesionNormalizada[] = useMemo(() => {
    return sesiones.map((s) => ({
      id: s.id,
      pacienteId: s.paciente?.id || null,
      pacienteNombre: s.paciente?.fullName || "Sin paciente",
      institucionNombre: s.grupo?.institucion.nombre,
      numeroSesion: s.numeroSesion,
      fecha: new Intl.DateTimeFormat("es-ES").format(new Date(s.fechaSesion)),
      hora: new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(s.fechaSesion)),
      estado: s.estadoSesion,
      estadoMostrado: s.estadoSesion === "completed" ? "Completada" : s.estadoSesion === "pending" ? "Pendiente" : "Cancelada",
      pago: s.estadoPago,
      pagoMostrado: s.estadoPagoMostrado,
      duracion: `${s.duracionMinutos} min`,
      terapeuta: s.terapeuta.fullName,
      tipo: s.tipoSesionMostrado,
      notas: s.notas.join("\n"),
      urlGrabacion: s.videoUrl,
    }));
  }, [sesiones]);

  return {
    sesiones: sesionesNormalizadas,
    cargando: loading,
    error,
    refetch,
  };
};
