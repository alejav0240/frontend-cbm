import {useMutation, useSuspenseQuery} from "@apollo/client/react";
import {GET_INVENTORY_ITEMS} from "@/modules/operaciones/inventario/graphql/queries";
import {
    inventoryFilters, inventoryItems
} from "@/modules/operaciones/inventario/types";
import {
    ADD_SESSION_INVENTORY_ITEM,
    CREATE_INVENTORY_ITEM,
    DELETE_INVENTORY_ITEM, UPDATE_INVENTORY_ITEM
} from "@/modules/operaciones/inventario/graphql/mutations";
import {CreateInventoryItemInput, UpdateInventoryItemInput} from "@/modules/operaciones/inventario/schemas";

interface Props {
    filters: inventoryFilters
}

export function useInventario({filters}: Props) {
    const { data: inventoryData, refetch: refetchInventory } = useSuspenseQuery<inventoryItems>(GET_INVENTORY_ITEMS,{
        variables: {...filters},
    });

    const [createItem] = useMutation(CREATE_INVENTORY_ITEM, { onCompleted: () => refetchInventory() });
    const [updateItem] = useMutation(UPDATE_INVENTORY_ITEM, { onCompleted: () => refetchInventory() });
    const [deleteItem] = useMutation(DELETE_INVENTORY_ITEM, { onCompleted: () => refetchInventory() });

    const [addSessionItem] = useMutation(ADD_SESSION_INVENTORY_ITEM);

    return {
        inventory: inventoryData?.inventoryItems ?? [],
        createItem: (variables: CreateInventoryItemInput) => createItem({ variables }),
        updateItem: (variables: UpdateInventoryItemInput) => updateItem({ variables }),
        deleteItem: (id: string | number) => deleteItem({ variables: { id } }),
        addSessionItem: (sessionId: string | number, itemId: string | number) =>
            addSessionItem({ variables: { sessionId, itemId } }),
        refetchInventory
    };
}