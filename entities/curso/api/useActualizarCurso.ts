import { useMutation } from "@apollo/client/react";
import { UPDATE_COURSE } from "./mutaciones";
import { toast } from "sonner";

interface ActualizarCursoInput {
  id: string | number;
  name?: string;
  price?: number;
  description?: string;
  state?: string;
}

export function useActualizarCurso() {
  const [actualizar, { loading }] = useMutation(UPDATE_COURSE);

  const actualizarCurso = async (input: ActualizarCursoInput) => {
    try {
      await actualizar({
        variables: {
          id: input.id,
          name: input.name,
          price: input.price,
          description: input.description,
          state: input.state,
        },
      });
      toast.success("Curso actualizado correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el curso";
      toast.error(message);
      throw err;
    }
  };

  return { actualizarCurso, actualizando: loading };
}
