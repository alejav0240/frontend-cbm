import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_ESTADO_GASTO } from "./mutaciones";
import {
  ActualizarEstadoGastoMutation,
  ActualizarEstadoGastoMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useActualizarEstadoGasto() {
  const [actualizar, { loading }] = useMutation<
    ActualizarEstadoGastoMutation,
    ActualizarEstadoGastoMutationVariables
  >(ACTUALIZAR_ESTADO_GASTO);

  const actualizarEstado = async (id: string, status: string) => {
    try {
      await actualizar({
        variables: { id, status },
      });
      toast.success("Estado del gasto actualizado");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar el estado";
      toast.error(message);
      throw err;
    }
  };

  return { actualizarEstado, actualizando: loading };
}
