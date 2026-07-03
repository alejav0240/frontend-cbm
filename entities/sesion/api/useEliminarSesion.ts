import { useMutation } from "@apollo/client/react";
import { ELIMINAR_SESION } from "./mutaciones";
import {
  EliminarSesionMutation,
  EliminarSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useEliminarSesion() {
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
        toast.success("Sesión eliminada correctamente");
      } else {
        toast.error(data?.deleteSession?.message || "Error al eliminar la sesión");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar la sesión");
      throw err;
    }
  };

  return { eliminarSesion, eliminando: loading };
}
