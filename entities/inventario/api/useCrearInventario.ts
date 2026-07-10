import { useMutation } from "@apollo/client/react";
import { CREATE_INVENTORY_ITEM } from "./mutaciones";
import {
  CreateInventoryItemMutation,
  CreateInventoryItemMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

interface CrearInventarioInput {
  name: string;
  type: string;
  condition: string;
  room: string;
  status?: string;
}

export function useCrearInventario() {
  const [crear, { loading }] = useMutation<
    CreateInventoryItemMutation,
    CreateInventoryItemMutationVariables
  >(CREATE_INVENTORY_ITEM);

  const crearInventario = async (input: CrearInventarioInput) => {
    try {
      const result = await crear({
        variables: {
          name: input.name,
          type: input.type,
          condition: input.condition,
          room: input.room,
          status: input.status,
        },
      });
      toast.success("Artículo registrado correctamente");
      return result.data?.createInventoryItem?.item;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al registrar el artículo";
      toast.error(message);
      throw err;
    }
  };

  return { crearInventario, creando: loading };
}
