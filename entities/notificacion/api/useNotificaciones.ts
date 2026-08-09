import { useMutation, useQuery } from "@apollo/client/react";
import type {
  ContarNoLeidasQuery,
  MarcarNotificacionLeidaMutation,
  MarcarNotificacionLeidaMutationVariables,
  MisNotificacionesQuery,
  MisNotificacionesQueryVariables,
} from "@/shared/api/generated/graphql";
import {
  CONTAR_NO_LEIDAS,
  MARCAR_NOTIFICACION_LEIDA,
  MIS_NOTIFICACIONES,
} from "./consultas";

export type Notificacion = Exclude<
  NonNullable<MisNotificacionesQuery["notifications"]>[number],
  null
>;

export function useNotificaciones(pollInterval = 30_000) {
  const { data, loading, refetch } = useQuery<
    MisNotificacionesQuery,
    MisNotificacionesQueryVariables
  >(MIS_NOTIFICACIONES, {
    pollInterval,
    fetchPolicy: "cache-and-network",
  });
  const { data: dataConteo } = useQuery<ContarNoLeidasQuery>(CONTAR_NO_LEIDAS, {
    pollInterval,
    fetchPolicy: "cache-and-network",
  });

  return {
    notificaciones: (data?.notifications ?? []).filter(
      (n): n is Notificacion => n != null,
    ),
    noLeidas: dataConteo?.unreadNotificationsCount ?? 0,
    cargando: loading,
    refetch,
  };
}

export function useMarcarNotificacionLeida() {
  const [marcar, { loading }] = useMutation<
    MarcarNotificacionLeidaMutation,
    MarcarNotificacionLeidaMutationVariables
  >(MARCAR_NOTIFICACION_LEIDA);

  const marcarLeida = async (id: string) => {
    await marcar({ variables: { id } });
  };

  return { marcarLeida, marcando: loading };
}
