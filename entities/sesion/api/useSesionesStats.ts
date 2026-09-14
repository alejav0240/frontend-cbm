import { useQuery } from "@apollo/client/react";
import { OBTENER_SESIONES } from "./consultas";
import type { ObtenerSesionesQuery } from "@/shared/api/generated/graphql";

export function useSesionesStats() {
  const hoy = new Date();
  const formatearFecha = (fecha: Date) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
      fecha.getDate(),
    ).padStart(2, "0")}`;
  const fechaDesde = formatearFecha(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1),
  );
  const fechaHasta = formatearFecha(
    new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0),
  );
  const variablesBase = {
    page: 1,
    pageSize: 1,
    dateFrom: fechaDesde,
    dateTo: fechaHasta,
    includeNoDate: false,
  };

  const total = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: variablesBase,
    fetchPolicy: "cache-and-network",
  });
  const completadas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { ...variablesBase, sessionStatus: "completa" },
    fetchPolicy: "cache-and-network",
  });
  const agendadas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { ...variablesBase, sessionStatus: "agendada" },
    fetchPolicy: "cache-and-network",
  });
  const confirmadas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { ...variablesBase, sessionStatus: "confirma" },
    fetchPolicy: "cache-and-network",
  });
  const reprogramadas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { ...variablesBase, sessionStatus: "reprograma" },
    fetchPolicy: "cache-and-network",
  });
  const canceladas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { ...variablesBase, sessionStatus: "cancelada" },
    fetchPolicy: "cache-and-network",
  });

  const loading =
    total.loading ||
    completadas.loading ||
    agendadas.loading ||
    confirmadas.loading ||
    reprogramadas.loading ||
    canceladas.loading;

  const mesActual = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(hoy);

  return {
    total: total.data?.sessions?.totalCount ?? 0,
    completadas: completadas.data?.sessions?.totalCount ?? 0,
    pendientes:
      (agendadas.data?.sessions?.totalCount ?? 0) +
      (confirmadas.data?.sessions?.totalCount ?? 0) +
      (reprogramadas.data?.sessions?.totalCount ?? 0),
    canceladas: canceladas.data?.sessions?.totalCount ?? 0,
    cargando: loading,
    mesActual,
  };
}
