import { useMutation } from "@apollo/client/react";
import { DELETE_LEAD } from "./mutaciones";
import { OBTENER_LEADS } from "./consultas";

export function useEliminarLead() {
  const [eliminarLead, { loading }] = useMutation(DELETE_LEAD, {
    refetchQueries: [{ query: OBTENER_LEADS }],
  });

  const eliminar = (id: string) => eliminarLead({ variables: { id } });

  return {
    eliminar,
    loading,
  };
}
