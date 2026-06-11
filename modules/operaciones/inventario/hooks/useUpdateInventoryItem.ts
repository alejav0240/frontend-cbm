import { useMutation } from "@apollo/client/react";
import { UPDATE_INVENTORY_ITEM } from "@/modules/operaciones/inventario/graphql/mutations";
import { UpdateInventoryItemInput } from "@/modules/operaciones/inventario/schemas";

export function useUpdateInventoryItem(onCompleted?: () => void) {
  const [updateItemMutation, { loading: isUpdating }] = useMutation(UPDATE_INVENTORY_ITEM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updateItem = (variables: UpdateInventoryItemInput) => updateItemMutation({ variables });

  return {
    updateItem,
    isUpdating,
  };
}
