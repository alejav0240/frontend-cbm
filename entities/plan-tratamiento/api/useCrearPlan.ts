"use client";

import { useMutation } from "@apollo/client/react";
import { CREATE_INTERVENTION_PLAN } from "./mutaciones";
import { toast } from "sonner";

interface CrearPlanInput {
  patientId: string;
  createdById: string;
  mainObjective: string;
  startDate?: string;
  endDate?: string;
}

export function useCrearPlan() {
  const [mutation, { loading }] = useMutation(CREATE_INTERVENTION_PLAN);

  const crearPlan = async (input: CrearPlanInput) => {
    try {
      const { data } = await mutation({
        variables: {
          patientId: input.patientId,
          createdById: input.createdById,
          mainObjective: input.mainObjective,
          startDate: input.startDate || null,
          endDate: input.endDate || null,
        },
      });
      toast.success("Plan de intervención creado correctamente");
      return (data as any)?.createInterventionPlan?.plan;
    } catch (err: any) {
      toast.error(err?.message || "Error al crear el plan");
      throw err;
    }
  };

  return { crearPlan, creando: loading };
}
