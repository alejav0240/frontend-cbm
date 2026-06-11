import { useMutation } from "@apollo/client/react";
import { UPDATE_DISCOUNT } from "@/modules/operaciones/pagos/graphql/mutations";
import { UpdateDiscountInput } from "@/modules/operaciones/pagos/schemas";

export function useUpdateDiscount(onCompleted?: () => void) {
  const [updateDiscountMutation, { loading: isUpdating }] = useMutation(UPDATE_DISCOUNT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updateDiscount = (variables: UpdateDiscountInput) => updateDiscountMutation({ variables });

  return {
    updateDiscount,
    isUpdating,
  };
}
