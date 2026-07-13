import { useMutation } from "@apollo/client/react";
import { UPDATE_ROLE } from "./mutaciones";
import { useRoles } from "./useRoles";

interface ActualizarRolVariables {
  id: string;
  name?: string;
  permissions?: string[];
}

interface ActualizarRolResponse {
  updateRole: {
    role: {
      id: string;
      name: string;
      permissions: string[];
    } | null;
  } | null;
}

export function useActualizarRol() {
  const { refetch } = useRoles();
  const [actualizarRol, { loading }] = useMutation<
    ActualizarRolResponse,
    ActualizarRolVariables
  >(UPDATE_ROLE, {
    onCompleted: () => refetch(),
  });

  const actualizar = (variables: ActualizarRolVariables) =>
    actualizarRol({ variables });

  return { actualizar, estaActualizando: loading };
}
