import { useSuspenseQuery } from "@apollo/client/react";
import { GET_DISCOUNTS } from "@/modules/operaciones/pagos/graphql/queries";
import { discountResponse } from "@/modules/operaciones/pagos/types";

export function useDiscounts() {
  const { data, refetch } = useSuspenseQuery<discountResponse>(GET_DISCOUNTS);

  return {
    discounts: data?.discounts ?? [],
    refetch,
  };
}
