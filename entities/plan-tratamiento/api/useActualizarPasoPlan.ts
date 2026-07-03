"use client";

import { useMutation } from "@apollo/client/react";
import { UPDATE_STEP_PLAN } from "./mutaciones";
import { toast } from "sonner";

interface ActualizarPasoInput {
  id: string;
  moment?: string;
  objective?: string;
  durationMinutes?: number;
  focus?: string;
  musicalResources?: string;
  musicalEmphasis?: string;
  approach?: string;
  mltMethod?: string;
}

export function useActualizarPasoPlan() {
  const [mutation, { loading }] = useMutation(UPDATE_STEP_PLAN);

  const actualizarPaso = async (input: ActualizarPasoInput) => {
    try {
      await mutation({
        variables: {
          id: input.id,
          moment: input.moment,
          objective: input.objective,
          durationMinutes: input.durationMinutes,
          focus: input.focus || null,
          musicalResources: input.musicalResources || null,
          musicalEmphasis: input.musicalEmphasis || null,
          approach: input.approach || null,
          mltMethod: input.mltMethod || null,
        },
      });
      toast.success("Paso actualizado correctamente");
    } catch (err: any) {
      toast.error(err?.message || "Error al actualizar el paso");
      throw err;
    }
  };

  return { actualizarPaso, actualizando: loading };
}
