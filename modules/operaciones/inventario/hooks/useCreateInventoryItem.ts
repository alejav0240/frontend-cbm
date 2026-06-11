import { useMutation } from "@apollo/client/react";
import { CREATE_INVENTORY_ITEM } from "@/modules/operaciones/inventario/graphql/mutations";
import { CreateInventoryItemInput } from "@/modules/operaciones/inventario/schemas";

export function useCreateInventoryItem(onCompleted?: () => void) {
  const [createItemMutation, { loading: isCreating }] = useMutation(CREATE_INVENTORY_ITEM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createItem = (variables: CreateInventoryItemInput) => createItemMutation({ variables });

  return {
    createItem,
    isCreating,
  };
}
