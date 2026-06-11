import { useMutation } from "@apollo/client/react";
import { ADD_SESSION_INVENTORY_ITEM } from "@/modules/operaciones/inventario/graphql/mutations";

export function useAddSessionInventoryItem(onCompleted?: () => void) {
  const [addSessionItemMutation, { loading: isAdding }] = useMutation(ADD_SESSION_INVENTORY_ITEM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const addSessionItem = (sessionId: string | number, itemId: string | number) =>
    addSessionItemMutation({ variables: { sessionId, itemId } });

  return {
    addSessionItem,
    isAdding,
  };
}
