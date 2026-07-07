import { useMutation } from "@apollo/client/react";
import {
  CrearDescuentoMutation,
  CrearDescuentoMutationVariables,
} from "@/shared/api/generated/graphql";
import { CREAR_DESCUENTO } from "./mutaciones";
import { useDescuentos } from "./useDescuentos";

export function useCrearDescuento() {
  const { refetch } = useDescuentos();
  const [addMutation, { loading: isAdding }] = useMutation<
    CrearDescuentoMutation,
    CrearDescuentoMutationVariables
  >(CREAR_DESCUENTO, {
    onCompleted: () => refetch(),
  });

  const addDiscount = (variables: CrearDescuentoMutationVariables) =>
    addMutation({ variables });

  return {
    addDiscount,
    loading: isAdding,
  };
}
