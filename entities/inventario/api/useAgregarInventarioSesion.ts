import { useMutation } from "@apollo/client/react";
import { BULK_ADD_SESSION_INVENTORY_ITEMS } from "./mutaciones";

export function useAgregarInventarioSesion() {
  const [mutation, { loading }] = useMutation(BULK_ADD_SESSION_INVENTORY_ITEMS);

  const agregarInventarioSesion = (variables: {
    itemIds: string[];
    sessionId: string;
  }) => mutation({ variables });

  return { agregarInventarioSesion, agregando: loading };
}
