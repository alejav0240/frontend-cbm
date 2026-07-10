import { useMutation } from "@apollo/client/react";
import { UPDATE_CAMPAIGN } from "./mutaciones";
import { OBTENER_CAMPANAS_MARKETING } from "./consultas";

export function useActualizarCampana() {
  const [actualizarCampana, { loading }] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ query: OBTENER_CAMPANAS_MARKETING }],
  });

  const actualizar = (variables: {
    id: string;
    name?: string;
    platform?: string;
    budget?: number;
    status?: string;
  }) => actualizarCampana({ variables });

  return {
    actualizar,
    loading,
  };
}
