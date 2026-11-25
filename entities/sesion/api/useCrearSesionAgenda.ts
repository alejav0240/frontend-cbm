import { useApolloClient, useMutation } from "@apollo/client/react";
import { CREAR_SESION } from "./mutaciones";
import { refetchActiveSessionQueries } from "./cache";
import {
  CrearSesionMutation,
  CrearSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

interface CrearSesionInput {
  patientId: string;
  therapistId: string | number;
  sessionDate: string;
  sessionType: string;
  durationMinutes: number;
  notes?: string;
}

export function useCrearSesionAgenda() {
  const client = useApolloClient();
  const [crear, { loading }] = useMutation<
    CrearSesionMutation,
    CrearSesionMutationVariables
  >(CREAR_SESION);

  const crearSesion = async (input: CrearSesionInput) => {
    try {
      const result = await crear({
        variables: {
          patientId: input.patientId,
          therapistId: input.therapistId,
          sessionDate: input.sessionDate,
          sessionType: input.sessionType,
          durationMinutes: input.durationMinutes,
          notes: input.notes,
        },
      });
      await refetchActiveSessionQueries(client);
      toast.success("Sesión creada correctamente");
      return result.data?.createSession?.session;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al crear la sesión",
      );
      throw err;
    }
  };

  return { crearSesion, creando: loading };
}
