import { useMutation } from "@apollo/client/react";
import { UPDATE_USER } from "./mutaciones";
import { useUsuarios } from "./useUsuarios";

interface UpdateUserVariables {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  celular?: string;
  ci?: string;
  visibility?: string;
  isActive?: boolean;
}

export function useUpdateUser() {
  const { refetch } = useUsuarios({ pagina: 1, pageSize: 10 });
  const [actualizarMutation, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: () => refetch(),
  });

  const actualizarUsuario = (variables: UpdateUserVariables) =>
    actualizarMutation({ variables });

  return { actualizarUsuario, loading };
}
