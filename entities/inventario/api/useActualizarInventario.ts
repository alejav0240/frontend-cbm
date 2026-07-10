import { useMutation } from "@apollo/client/react";
import { UPDATE_INVENTORY_ITEM } from "./mutaciones";
import {
  UpdateInventoryItemMutation,
  UpdateInventoryItemMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

interface ActualizarInventarioInput {
  id: string | number;
  name?: string;
  type?: string;
  condition?: string;
  room?: string;
  status?: string;
}

export function useActualizarInventario() {
  const [actualizar, { loading }] = useMutation<
    UpdateInventoryItemMutation,
    UpdateInventoryItemMutationVariables
  >(UPDATE_INVENTORY_ITEM);

  const actualizarInventario = async (input: ActualizarInventarioInput) => {
    try {
      const result = await actualizar({
        variables: {
          id: input.id,
          name: input.name,
          type: input.type,
          condition: input.condition,
          room: input.room,
          status: input.status,
        },
      });
      toast.success("Artículo actualizado correctamente");
      return result.data?.updateInventoryItem?.item;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al actualizar el artículo";
      toast.error(message);
      throw err;
    }
  };

  return { actualizarInventario, actualizando: loading };
}
