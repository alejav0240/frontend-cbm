import { useMutation } from "@apollo/client/react";
import { DELETE_INVENTORY_ITEM } from "./mutaciones";
import {
  DeleteInventoryItemMutation,
  DeleteInventoryItemMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useEliminarInventario() {
  const [eliminar, { loading }] = useMutation<
    DeleteInventoryItemMutation,
    DeleteInventoryItemMutationVariables
  >(DELETE_INVENTORY_ITEM);

  const eliminarInventario = async (id: string | number) => {
    try {
      const { data } = await eliminar({
        variables: { id },
      });
      if (data?.deleteInventoryItem?.success) {
        toast.success("Artículo eliminado correctamente");
      } else {
        toast.error("Error al eliminar el artículo");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar el artículo";
      toast.error(message);
      throw err;
    }
  };

  return { eliminarInventario, eliminando: loading };
}
