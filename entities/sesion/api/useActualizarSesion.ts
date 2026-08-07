import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_SESION } from "./mutaciones";
import {
  ActualizarSesionMutation,
  ActualizarSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

interface ActualizarSesionInput {
  therapistId?: string | null;
  sessionDate?: string | null;
  sessionType?: string | null;
  notes?: string | null;
  durationMinutes?: number | null;
  videoUrl?: string | null;
  sessionStatus?: string | null;
}

export function useActualizarSesion() {
  const [actualizar, { loading }] = useMutation<
    ActualizarSesionMutation,
    ActualizarSesionMutationVariables
  >(ACTUALIZAR_SESION);

  const actualizarSesion = async (id: string, input: ActualizarSesionInput) => {
    try {
      await actualizar({
        variables: { id, ...input },
      });
      toast.success("Sesión actualizada");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al actualizar la sesión",
      );
      throw err;
    }
  };

  return { actualizarSesion, actualizando: loading };
}
