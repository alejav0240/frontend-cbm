import { useMutation } from "@apollo/client/react";
import { UPDATE_DIGITAL_RESOURCE } from "./mutaciones";
import { OBTENER_RECURSOS_DIGITALES } from "./consultas";

interface ActualizarRecursoVars {
  id: string;
  title?: string;
  type?: string;
  url?: string;
  category?: string;
}

export function useActualizarRecurso() {
  const [mutation, { loading, error }] = useMutation(UPDATE_DIGITAL_RESOURCE, {
    refetchQueries: [{ query: OBTENER_RECURSOS_DIGITALES }],
  });

  const actualizarRecurso = (variables: ActualizarRecursoVars) => {
    return mutation({ variables });
  };

  return { actualizarRecurso, actualizando: loading, error };
}
