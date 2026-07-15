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

interface UpdateUserData {
  updateUser: {
    user: {
      id: string;
      databaseId: number | null;
      username: string;
      email: string | null;
      firstName: string;
      lastName: string;
      fullName: string | null;
      ci: string;
      celular: string;
      status: string;
      visibility: string;
      isStaff: boolean;
      foto: string | null;
      cv: string | null;
      role: { id: string; name: string } | null;
    } | null;
  } | null;
}

export function useUpdateUser() {
  const { refetch } = useUsuarios({ pagina: 1, pageSize: 10 });
  const [actualizarMutation, { loading }] = useMutation<
    UpdateUserData,
    UpdateUserVariables
  >(UPDATE_USER, {
    onCompleted: () => refetch(),
  });

  const actualizarUsuario = (variables: UpdateUserVariables) =>
    actualizarMutation({ variables });

  return { actualizarUsuario, loading };
}
