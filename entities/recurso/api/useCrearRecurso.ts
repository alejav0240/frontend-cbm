import { useMutation } from "@apollo/client/react";
import { CREATE_DIGITAL_RESOURCE } from "./mutaciones";
import { OBTENER_RECURSOS_DIGITALES } from "./consultas";

interface CrearRecursoVars {
  title: string;
  type: string;
  url: string;
  category?: string;
}

export function useCrearRecurso() {
  const [mutation, { loading, error }] = useMutation(CREATE_DIGITAL_RESOURCE, {
    refetchQueries: [{ query: OBTENER_RECURSOS_DIGITALES }],
  });

  const crearRecurso = (variables: CrearRecursoVars) => {
    return mutation({ variables });
  };

  return { crearRecurso, creando: loading, error };
}
