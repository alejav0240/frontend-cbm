import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_SESION } from "./mutaciones";
import {
  ActualizarSesionMutation,
  ActualizarSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useActualizarEstadoSesion() {
  const [actualizar, { loading }] = useMutation<
    ActualizarSesionMutation,
    ActualizarSesionMutationVariables
  >(ACTUALIZAR_SESION);

  const actualizarEstado = async (id: string, sessionStatus: string) => {
    try {
      await actualizar({
        variables: { id, sessionStatus },
      });
      toast.success("Estado de sesión actualizado");
    } catch (err: any) {
      toast.error(err?.message || "Error al actualizar estado");
      throw err;
    }
  };

  return { actualizarEstado, actualizando: loading };
}
