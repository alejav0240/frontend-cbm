import { useMutation } from "@apollo/client/react";
import { CREATE_PAYMENT } from "@/modules/operaciones/pagos/graphql/mutations";
import { CreatePaymentInput } from "@/modules/operaciones/pagos/schemas";

export function useCreatePayment(onCompleted?: () => void) {
  const [createPaymentMutation, { loading: isCreating }] = useMutation(CREATE_PAYMENT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createPayment = (variables: CreatePaymentInput) => createPaymentMutation({ variables });

  return {
    createPayment,
    isCreating,
  };
}
