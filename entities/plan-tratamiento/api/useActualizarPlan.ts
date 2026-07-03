"use client";

import { useMutation } from "@apollo/client/react";
import { UPDATE_INTERVENTION_PLAN } from "./mutaciones";
import { toast } from "sonner";

interface ActualizarPlanInput {
  id: string;
  mainObjective?: string;
  startDate?: string;
  endDate?: string;
}

export function useActualizarPlan() {
  const [mutation, { loading }] = useMutation(UPDATE_INTERVENTION_PLAN);

  const actualizarPlan = async (input: ActualizarPlanInput) => {
    try {
      const { data } = await mutation({
        variables: {
          id: input.id,
          mainObjective: input.mainObjective,
          startDate: input.startDate || null,
          endDate: input.endDate || null,
        },
      });
      toast.success("Plan actualizado correctamente");
      return (data as any)?.updateInterventionPlan?.plan;
    } catch (err: any) {
      toast.error(err?.message || "Error al actualizar el plan");
      throw err;
    }
  };

  return { actualizarPlan, actualizando: loading };
}
