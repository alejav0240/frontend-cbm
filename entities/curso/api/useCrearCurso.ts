import { useMutation } from "@apollo/client/react";
import { CREATE_COURSE } from "./mutaciones";
import { toast } from "sonner";

interface CrearCursoInput {
  name: string;
  price: number;
  description?: string;
  state?: string;
}

export function useCrearCurso() {
  const [crear, { loading }] = useMutation(CREATE_COURSE);

  const crearCurso = async (input: CrearCursoInput) => {
    try {
      await crear({
        variables: {
          name: input.name,
          price: input.price,
          description: input.description,
          state: input.state,
        },
      });
      toast.success("Curso creado correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al crear el curso";
      toast.error(message);
      throw err;
    }
  };

  return { crearCurso, creando: loading };
}
