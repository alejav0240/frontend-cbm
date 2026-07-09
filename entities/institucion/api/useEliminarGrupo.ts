import { useMutation } from "@apollo/client/react";
import { ELIMINAR_GRUPO } from "./mutaciones";
import { toast } from "sonner";

export function useEliminarGrupo() {
  const [eliminar, { loading }] = useMutation(ELIMINAR_GRUPO);

  const eliminarGrupo = async (id: string) => {
    try {
      await eliminar({
        variables: { id },
      });
      toast.success("Grupo eliminado correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar el grupo";
      toast.error(message);
      throw err;
    }
  };

  return { eliminarGrupo, eliminando: loading };
}
