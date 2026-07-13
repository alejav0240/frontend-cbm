import { useMutation } from "@apollo/client/react";
import { CREATE_ROLE } from "./mutaciones";
import { useRoles } from "./useRoles";

interface CrearRolVariables {
  name: string;
  permissions?: string[];
}

interface CrearRolResponse {
  createRole: {
    role: {
      id: string;
      name: string;
      permissions: string[];
    } | null;
  } | null;
}

export function useCrearRol() {
  const { refetch } = useRoles();
  const [crearRol, { loading }] = useMutation<
    CrearRolResponse,
    CrearRolVariables
  >(CREATE_ROLE, {
    onCompleted: () => refetch(),
  });

  const crear = (variables: CrearRolVariables) => crearRol({ variables });

  return { crear, estaCreando: loading };
}
