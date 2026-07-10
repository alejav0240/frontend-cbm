import { useMutation } from "@apollo/client/react";
import { DELETE_DIGITAL_RESOURCE } from "./mutaciones";
import { OBTENER_RECURSOS_DIGITALES } from "./consultas";

export function useEliminarRecurso() {
  const [mutation, { loading, error }] = useMutation(DELETE_DIGITAL_RESOURCE, {
    refetchQueries: [{ query: OBTENER_RECURSOS_DIGITALES }],
  });

  const eliminarRecurso = (id: string) => {
    return mutation({ variables: { id } });
  };

  return { eliminarRecurso, eliminando: loading, error };
}
