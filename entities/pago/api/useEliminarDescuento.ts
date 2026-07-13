import { useMutation } from "@apollo/client/react";
import {
  EliminarDescuentoMutation,
  EliminarDescuentoMutationVariables,
} from "@/shared/api/generated/graphql";
import { ELIMINAR_DESCUENTO } from "./mutaciones";
import { useDescuentos } from "./useDescuentos";

export function useEliminarDescuento() {
  const { refetch } = useDescuentos();
  const [deleteMutation, { loading: isDeleting }] = useMutation<
    EliminarDescuentoMutation,
    EliminarDescuentoMutationVariables
  >(ELIMINAR_DESCUENTO, {
    onCompleted: () => refetch(),
  });

  const deleteDiscount = (id: string) => deleteMutation({ variables: { id } });

  return {
    deleteDiscount,
    loading: isDeleting,
  };
}
