import { useMutation } from "@apollo/client/react";
import { UPDATE_PAYMENT } from "@/modules/operaciones/pagos/graphql/mutations";
import { UpdatePaymentInput } from "@/modules/operaciones/pagos/schemas";

export function useUpdatePayment(onCompleted?: () => void) {
  const [updatePaymentMutation, { loading: isUpdating }] = useMutation(UPDATE_PAYMENT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updatePayment = (variables: UpdatePaymentInput) => updatePaymentMutation({ variables });

  return {
    updatePayment,
    isUpdating,
  };
}
