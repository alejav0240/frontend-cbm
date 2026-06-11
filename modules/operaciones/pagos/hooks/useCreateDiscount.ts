import { useMutation } from "@apollo/client/react";
import { CREATE_DISCOUNT } from "@/modules/operaciones/pagos/graphql/mutations";
import { CreateDiscountInput } from "@/modules/operaciones/pagos/schemas";

export function useCreateDiscount(onCompleted?: () => void) {
  const [createDiscountMutation, { loading: isCreating }] = useMutation(CREATE_DISCOUNT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createDiscount = (variables: CreateDiscountInput) => createDiscountMutation({ variables });

  return {
    createDiscount,
    isCreating,
  };
}
