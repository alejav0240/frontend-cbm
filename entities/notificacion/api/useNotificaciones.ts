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
import { useNetworkStatus } from "@/shared/lib/network/useNetworkStatus";
import { usePageVisibility } from "@/shared/lib/network/usePageVisibility";

export type Notificacion = Exclude<
  NonNullable<MisNotificacionesQuery["notifications"]>[number],
  null
>;

export function useNotificaciones(pollInterval = 30_000) {
  const online = useNetworkStatus();
  const visible = usePageVisibility();
  const { data, loading, refetch } = useQuery<
    MisNotificacionesQuery,
    MisNotificacionesQueryVariables
  >(MIS_NOTIFICACIONES, {
    pollInterval: online && visible ? pollInterval : 0,
    fetchPolicy: online && visible ? "cache-and-network" : "cache-only",
  });
  const { data: dataConteo } = useQuery<ContarNoLeidasQuery>(CONTAR_NO_LEIDAS, {
    pollInterval: online && visible ? pollInterval : 0,
    fetchPolicy: online && visible ? "cache-and-network" : "cache-only",
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
  >(MARCAR_NOTIFICACION_LEIDA, {
    update(cache, { data }) {
      const id = data?.markNotificationRead?.notification?.id;
      if (!id) return;
      cache.modify({
        id: cache.identify({ __typename: "Notification", id }),
        fields: {
          isRead: () => true,
        },
      });
      cache.modify({
        fields: {
          unreadNotificationsCount(value: number) {
            return Math.max(0, value - 1);
          },
        },
      });
    },
  });

  const marcarLeida = async (id: string) => {
    await marcar({ variables: { id } });
  };

  return { marcarLeida, marcando: loading };
}
