import { useMutation } from "@apollo/client/react";
import { DELETE_COURSE } from "./mutaciones";
import { toast } from "sonner";

export function useEliminarCurso() {
  const [eliminar, { loading }] = useMutation(DELETE_COURSE);

  const eliminarCurso = async (id: string | number) => {
    try {
      await eliminar({
        variables: { id },
      });
      toast.success("Curso eliminado correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar el curso";
      toast.error(message);
      throw err;
    }
  };

  return { eliminarCurso, eliminando: loading };
}
