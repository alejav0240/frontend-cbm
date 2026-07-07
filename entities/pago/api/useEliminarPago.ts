import { useMutation } from "@apollo/client/react";
import {
  EliminarPagoMutation,
  EliminarPagoMutationVariables,
} from "@/shared/api/generated/graphql";
import { ELIMINAR_PAGO, usePagos } from "@/entities/pago";

export function useEliminarPago() {
  const { refetch } = usePagos({ pagina: 1, pageSize: 10 });
  const [deleteMutation, { loading: isDeleting }] = useMutation<
    EliminarPagoMutation,
    EliminarPagoMutationVariables
  >(ELIMINAR_PAGO, {
    onCompleted: () => refetch(),
  });

  const deletePayment = (id: string) =>
    deleteMutation({ variables: { id } });

  return {
    deletePayment,
    loading: isDeleting,
  };
}
