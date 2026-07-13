import { useMutation } from "@apollo/client/react";
import { DELETE_ROLE } from "./mutaciones";
import { useRoles } from "./useRoles";

interface EliminarRolResponse {
  deleteRole: {
    success: boolean | null;
  } | null;
}

export function useEliminarRol() {
  const { refetch } = useRoles();
  const [eliminarRol, { loading }] = useMutation<
    EliminarRolResponse,
    { id: string }
  >(DELETE_ROLE, {
    onCompleted: () => refetch(),
  });

  const eliminar = (id: string) => eliminarRol({ variables: { id } });

  return { eliminar, estaEliminando: loading };
}
