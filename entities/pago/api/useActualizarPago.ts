import { useMutation } from "@apollo/client/react";
import {
  ActualizarPagoMutation,
  ActualizarPagoMutationVariables,
} from "@/shared/api/generated/graphql";
import { ACTUALIZAR_PAGO, usePagos } from "@/entities/pago";

export function useActualizarPago() {
  const { refetch } = usePagos({ pagina: 1, pageSize: 10 });
  const [updateMutation, { loading: isUpdating }] = useMutation<
    ActualizarPagoMutation,
    ActualizarPagoMutationVariables
  >(ACTUALIZAR_PAGO, {
    onCompleted: () => refetch(),
  });

  const updatePayment = (variables: ActualizarPagoMutationVariables) =>
    updateMutation({ variables });

  return {
    updatePayment,
    loading: isUpdating,
  };
}
