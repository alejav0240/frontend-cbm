import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_INSTITUCION } from "./mutaciones";
import { toast } from "sonner";

interface ActualizarInstitucionInput {
  id: string;
  name?: string;
  contactEmail?: string;
  phone?: string;
}

export function useActualizarInstitucion() {
  const [actualizar, { loading }] = useMutation(ACTUALIZAR_INSTITUCION);

  const actualizarInstitucion = async (input: ActualizarInstitucionInput) => {
    try {
      await actualizar({
        variables: {
          id1: input.id,
          name: input.name,
          contactEmail: input.contactEmail,
          phone: input.phone,
        },
      });
      toast.success("Institución actualizada correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al actualizar la institución";
      toast.error(message);
      throw err;
    }
  };

  return { actualizarInstitucion, actualizando: loading };
}
