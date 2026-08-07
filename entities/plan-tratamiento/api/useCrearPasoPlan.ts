"use client";

import { useMutation } from "@apollo/client/react";
import { CREATE_STEP_PLAN } from "./mutaciones";
import { CreateStepPlanMutation } from "@/shared/api/generated/graphql";
import { toast } from "sonner";

interface CrearPasoInput {
  planId: string;
  moment: string;
  objective: string;
  durationMinutes: number;
  focus?: string;
  musicalResources?: string;
  musicalEmphasis?: string;
  approach?: string;
  mltMethod?: string;
}

export function useCrearPasoPlan() {
  const [mutation, { loading }] = useMutation(CREATE_STEP_PLAN);

  const crearPaso = async (input: CrearPasoInput) => {
    try {
      const { data } = await mutation({
        variables: {
          planId: input.planId,
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
      toast.success("Paso añadido correctamente");
      return (data as CreateStepPlanMutation)?.createStepPlan?.step;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al añadir el paso",
      );
      throw err;
    }
  };

  return { crearPaso, creando: loading };
}
