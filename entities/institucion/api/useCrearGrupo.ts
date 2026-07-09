import { useMutation } from "@apollo/client/react";
import { CREAR_GRUPO } from "./mutaciones";
import { toast } from "sonner";

interface CrearGrupoInput {
  institutionId: string;
  name: string;
}

export function useCrearGrupo() {
  const [crear, { loading }] = useMutation(CREAR_GRUPO);

  const crearGrupo = async (input: CrearGrupoInput) => {
    try {
      await crear({
        variables: {
          institutionId: input.institutionId,
          name: input.name,
        },
      });
      toast.success("Grupo creado correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al crear el grupo";
      toast.error(message);
      throw err;
    }
  };

  return { crearGrupo, creando: loading };
}
