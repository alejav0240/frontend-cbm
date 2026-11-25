import { useApolloClient, useMutation } from "@apollo/client/react";
import { CREATE_USER } from "./mutaciones";
import { OBTENER_USUARIOS } from "./consultas";

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
    emailSent?: boolean | null;
  } | null;
}

export function useCreateUser() {
  const client = useApolloClient();
  const [crearMutation, { loading }] = useMutation<CreateUserData, CreateUserVariables>(CREATE_USER, {
  });

  const crearUsuario = async (variables: CreateUserVariables) => {
    const result = await crearMutation({ variables });
    await client.refetchQueries({ include: [OBTENER_USUARIOS] });
    return result;
  };

  return { crearUsuario, loading };
}
