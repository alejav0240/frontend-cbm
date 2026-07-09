import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_GRUPO } from "./mutaciones";
import { toast } from "sonner";

interface ActualizarGrupoInput {
  id: string;
  name?: string;
}

export function useActualizarGrupo() {
  const [actualizar, { loading }] = useMutation(ACTUALIZAR_GRUPO);

  const actualizarGrupo = async (input: ActualizarGrupoInput) => {
    try {
      await actualizar({
        variables: {
          id: input.id,
          name: input.name,
        },
      });
      toast.success("Grupo actualizado correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el grupo";
      toast.error(message);
      throw err;
    }
  };

  return { actualizarGrupo, actualizando: loading };
}
