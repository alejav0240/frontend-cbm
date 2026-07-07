import { useMutation } from "@apollo/client/react";
import {
  CrearPagoMutation,
  CrearPagoMutationVariables,
} from "@/shared/api/generated/graphql";
import { CREAR_PAGO, usePagos } from "@/entities/pago";

export function useCrearPago() {
  const { refetch } = usePagos({ pagina: 1, pageSize: 10 });
  const [addMutation, { loading: isAdding }] = useMutation<
    CrearPagoMutation,
    CrearPagoMutationVariables
  >(CREAR_PAGO, {
    onCompleted: () => refetch(),
  });

  const addPayment = (variables: CrearPagoMutationVariables) =>
    addMutation({ variables });

  return {
    addPayment,
    loading: isAdding,
  };
}
