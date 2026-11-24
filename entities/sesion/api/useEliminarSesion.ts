import { useApolloClient, useMutation } from "@apollo/client/react";
import { ELIMINAR_SESION } from "./mutaciones";
import { refetchActiveSessionQueries } from "./cache";
import {
  EliminarSesionMutation,
  EliminarSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useEliminarSesion() {
  const client = useApolloClient();
  const [eliminar, { loading }] = useMutation<
    EliminarSesionMutation,
    EliminarSesionMutationVariables
  >(ELIMINAR_SESION);

  const eliminarSesion = async (id: string) => {
    try {
      const { data } = await eliminar({
        variables: { id },
      });
      if (data?.deleteSession?.success) {
        await refetchActiveSessionQueries(client);
        toast.success("Sesión eliminada correctamente");
      } else {
        toast.error(
          data?.deleteSession?.message || "Error al eliminar la sesión",
        );
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar la sesión",
      );
      throw err;
    }
  };

  return { eliminarSesion, eliminando: loading };
}
