import { useMutation } from "@apollo/client/react";
import { CREAR_INSTITUCION } from "./mutaciones";
import {
  CrearInstitucionMutation,
  CrearInstitucionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

export function useCrearInstitucion() {
  const [crear, { loading }] = useMutation<
    CrearInstitucionMutation,
    CrearInstitucionMutationVariables
  >(CREAR_INSTITUCION);

  const crearInstitucion = async (input: {
    name: string;
    contactEmail: string;
    phone: string;
  }) => {
    try {
      const result = await crear({
        variables: {
          name: input.name,
          contactEmail: input.contactEmail,
          phone: input.phone,
        },
      });
      toast.success("Institución creada correctamente");
      return result.data?.createInstitution?.institution;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al crear la institución";
      toast.error(message);
      throw err;
    }
  };

  return { crearInstitucion, creando: loading };
}
