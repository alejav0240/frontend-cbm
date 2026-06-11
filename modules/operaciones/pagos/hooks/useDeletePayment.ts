import { useMutation } from "@apollo/client/react";
import { DELETE_PAYMENT } from "@/modules/operaciones/pagos/graphql/mutations";

export function useDeletePayment(onCompleted?: () => void) {
  const [deletePaymentMutation, { loading: isDeleting }] = useMutation(DELETE_PAYMENT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deletePayment = (id: string | number) => deletePaymentMutation({ variables: { id } });

  return {
    deletePayment,
    isDeleting,
  };
}
