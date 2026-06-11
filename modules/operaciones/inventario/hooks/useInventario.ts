import { useSuspenseQuery } from "@apollo/client/react";
import { GET_INVENTORY_ITEMS } from "@/modules/operaciones/inventario/graphql/queries";
import { inventoryFilters, inventoryItems } from "@/modules/operaciones/inventario/types";

interface Props {
  filters: inventoryFilters;
}

export function useInventario({ filters }: Props) {
  const { data, refetch } = useSuspenseQuery<inventoryItems>(GET_INVENTORY_ITEMS, {
    variables: { ...filters },
  });

  return {
    inventory: data?.inventoryItems ?? [],
    refetch,
  };
}
