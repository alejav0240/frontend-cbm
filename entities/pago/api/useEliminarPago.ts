import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  EliminarPagoMutation,
  EliminarPagoMutationVariables,
} from "@/shared/api/generated/graphql";
import { ELIMINAR_PAGO } from "@/entities/pago";
import { OBTENER_PAGOS } from "./consultas";

export function useEliminarPago() {
  const client = useApolloClient();
  const [deleteMutation, { loading: isDeleting }] = useMutation<
    EliminarPagoMutation,
    EliminarPagoMutationVariables
  >(ELIMINAR_PAGO);

  const deletePayment = async (id: string) => {
    const result = await deleteMutation({ variables: { id } });
    await client.refetchQueries({ include: [OBTENER_PAGOS] });
    return result;
  };

  return {
    deletePayment,
    loading: isDeleting,
  };
}
