import { useApolloClient, useMutation } from "@apollo/client/react";
import { ACTUALIZAR_SESION } from "./mutaciones";
import { refetchActiveSessionQueries } from "./cache";
import {
  ActualizarSesionMutation,
  ActualizarSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useActualizarEstadoSesion() {
  const client = useApolloClient();
  const [actualizar, { loading }] = useMutation<
    ActualizarSesionMutation,
    ActualizarSesionMutationVariables
  >(ACTUALIZAR_SESION);

  const actualizarEstado = async (id: string, sessionStatus: string) => {
    try {
      await actualizar({
        variables: { id, sessionStatus: sessionStatus.toLowerCase() },
      });
      await refetchActiveSessionQueries(client);
      toast.success("Estado de sesión actualizado");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al actualizar estado",
      );
      throw err;
    }
  };

  return { actualizarEstado, actualizando: loading };
}
