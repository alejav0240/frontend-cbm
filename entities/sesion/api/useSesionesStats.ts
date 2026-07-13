import { useQuery } from "@apollo/client/react";
import { OBTENER_SESIONES } from "./consultas";
import type { ObtenerSesionesQuery } from "@/shared/api/generated/graphql";

const STATUS_QUERIES = [
  { key: "total", variables: {} },
  { key: "completadas", variables: { sessionStatus: "COMPLETA" } },
  { key: "pendientes", variables: { sessionStatus: "AGENDADA" } },
  { key: "canceladas", variables: { sessionStatus: "CANCELADA" } },
] as const;

export function useSesionesStats() {
  const total = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { page: 1, pageSize: 1 },
    fetchPolicy: "cache-and-network",
  });
  const completadas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { page: 1, pageSize: 1, sessionStatus: "COMPLETA" },
    fetchPolicy: "cache-and-network",
  });
  const pendientes = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { page: 1, pageSize: 1, sessionStatus: "AGENDADA" },
    fetchPolicy: "cache-and-network",
  });
  const canceladas = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: { page: 1, pageSize: 1, sessionStatus: "CANCELADA" },
    fetchPolicy: "cache-and-network",
  });

  const loading =
    total.loading ||
    completadas.loading ||
    pendientes.loading ||
    canceladas.loading;

  return {
    total: total.data?.sessions?.totalCount ?? 0,
    completadas: completadas.data?.sessions?.totalCount ?? 0,
    pendientes: pendientes.data?.sessions?.totalCount ?? 0,
    canceladas: canceladas.data?.sessions?.totalCount ?? 0,
    cargando: loading,
  };
}
