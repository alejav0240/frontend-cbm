import { useMutation } from "@apollo/client/react";
import { ELIMINAR_GASTO } from "./mutaciones";
import {
  EliminarGastoMutation,
  EliminarGastoMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useEliminarGasto() {
  const [eliminar, { loading }] = useMutation<
    EliminarGastoMutation,
    EliminarGastoMutationVariables
  >(ELIMINAR_GASTO);

  const eliminarGasto = async (id: string) => {
    try {
      const { data } = await eliminar({
        variables: { id },
      });
      if (data?.deleteExpense?.success) {
        toast.success("Gasto eliminado correctamente");
      } else {
        toast.error("Error al eliminar el gasto");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar el gasto";
      toast.error(message);
      throw err;
    }
  };

  return { eliminarGasto, eliminando: loading };
}
