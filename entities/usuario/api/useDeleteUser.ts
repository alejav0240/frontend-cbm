import { useMutation } from "@apollo/client/react";
import { DELETE_USER } from "./mutaciones";

export function useDeleteUser() {
  const [eliminarMutation] = useMutation(DELETE_USER);

  const eliminarUsuario = (id: string) =>
    eliminarMutation({ variables: { id } });

  return { eliminarUsuario };
}
