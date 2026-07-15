import { useMutation } from "@apollo/client/react";
import { CREATE_USER } from "./mutaciones";
import { useUsuarios } from "./useUsuarios";

interface CreateUserVariables {
  username: string;
  email: string;
  password: string;
  ci: string;
  firstName: string;
  lastName: string;
  celular?: string;
  roleId: string;
}

interface CreateUserData {
  createUser: {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
    plainPassword: string | null;
  } | null;
}

export function useCreateUser() {
  const { refetch } = useUsuarios({ pagina: 1, pageSize: 10 });
  const [crearMutation, { loading }] = useMutation<CreateUserData, CreateUserVariables>(CREATE_USER, {
    onCompleted: () => refetch(),
  });

  const crearUsuario = (variables: CreateUserVariables) =>
    crearMutation({ variables });

  return { crearUsuario, loading };
}
