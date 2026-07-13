import { useMutation } from "@apollo/client/react";
import { BULK_ADD_SESSION_RESOURCES } from "./mutaciones";

export function useAgregarRecursosSesion() {
  const [mutation, { loading }] = useMutation(BULK_ADD_SESSION_RESOURCES);

  const agregarRecursosSesion = (variables: {
    resourceIds: string[];
    sessionId: string;
  }) => {
    // 👇 Aquí capturas lo que llega justo antes de enviarlo
    console.log("Variables recibidas en el hook:", variables);

    return mutation({ variables });
  };

  return { agregarRecursosSesion, agregando: loading };
}
