import { useMutation } from "@apollo/client/react";
import { ELIMINAR_INSTITUCION } from "./mutaciones";
import {
  EliminarInstitucionMutation,
  EliminarInstitucionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useEliminarInstitucion() {
  const [eliminar, { loading }] = useMutation<
    EliminarInstitucionMutation,
    EliminarInstitucionMutationVariables
  >(ELIMINAR_INSTITUCION);

  const eliminarInstitucion = async (id: string) => {
    try {
      const { data } = await eliminar({
        variables: { id },
      });
      if (data?.deleteInstitution?.success) {
        toast.success("Institución eliminada correctamente");
      } else {
        toast.error("Error al eliminar la institución");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar la institución";
      toast.error(message);
      throw err;
    }
  };

  return { eliminarInstitucion, eliminando: loading };
}
