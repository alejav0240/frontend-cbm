import { useMutation } from "@apollo/client/react";
import { UPDATE_LEAD_STATUS } from "./mutaciones";
import { OBTENER_LEADS } from "./consultas";

export function useActualizarEstadoLead() {
  const [actualizarEstado, { loading }] = useMutation(UPDATE_LEAD_STATUS, {
    refetchQueries: [{ query: OBTENER_LEADS }],
  });

  const actualizar = (id: string, status: string) =>
    actualizarEstado({ variables: { id, status } });

  return {
    actualizar,
    loading,
  };
}
