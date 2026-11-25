import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  CrearPagoMutation,
  CrearPagoMutationVariables,
} from "@/shared/api/generated/graphql";
import { CREAR_PAGO } from "@/entities/pago";
import { OBTENER_PAGOS } from "./consultas";

export function useCrearPago() {
  const client = useApolloClient();
  const [addMutation, { loading: isAdding }] = useMutation<
    CrearPagoMutation,
    CrearPagoMutationVariables
  >(CREAR_PAGO);

  const addPayment = async (variables: CrearPagoMutationVariables) => {
    const result = await addMutation({ variables });
    await client.refetchQueries({ include: [OBTENER_PAGOS] });
    return result;
  };

  return {
    addPayment,
    loading: isAdding,
  };
}
