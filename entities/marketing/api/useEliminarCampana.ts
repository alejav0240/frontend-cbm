import { useMutation } from "@apollo/client/react";
import { DELETE_CAMPAIGN } from "./mutaciones";
import { OBTENER_CAMPANAS_MARKETING } from "./consultas";

export function useEliminarCampana() {
  const [eliminarCampana, { loading }] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ query: OBTENER_CAMPANAS_MARKETING }],
  });

  const eliminar = (id: string) =>
    eliminarCampana({ variables: { id } });

  return {
    eliminar,
    loading,
  };
}
