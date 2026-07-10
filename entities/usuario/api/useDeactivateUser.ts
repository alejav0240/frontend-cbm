import { useMutation } from "@apollo/client/react";
import { DEACTIVATE_USER } from "./mutaciones";

export function useDeactivateUser() {
  const [desactivarMutation] = useMutation(DEACTIVATE_USER);

  const desactivarUsuario = (id: string) =>
    desactivarMutation({ variables: { id } });

  return { desactivarUsuario };
}
