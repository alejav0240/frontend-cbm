import { useMutation } from "@apollo/client/react";
import { DELETE_INVENTORY_ITEM } from "@/modules/operaciones/inventario/graphql/mutations";

export function useDeleteInventoryItem(onCompleted?: () => void) {
  const [deleteItemMutation, { loading: isDeleting }] = useMutation(DELETE_INVENTORY_ITEM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deleteItem = (id: string | number) => deleteItemMutation({ variables: { id } });

  return {
    deleteItem,
    isDeleting,
  };
}
