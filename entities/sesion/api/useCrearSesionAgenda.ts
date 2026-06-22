import { useMutation } from "@apollo/client/react";
import { CREAR_SESION } from "./mutaciones";
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
      toast.success("Sesión creada correctamente");
      return result.data?.createSession?.session;
    } catch (err: any) {
      toast.error(err?.message || "Error al crear la sesión");
      throw err;
    }
  };

  return { crearSesion, creando: loading };
}
