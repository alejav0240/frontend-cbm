"use client";

import { useMutation } from "@apollo/client/react";
import { DELETE_INTERVENTION_PLAN } from "./mutaciones";
import { toast } from "sonner";

export function useEliminarPlan() {
  const [mutation, { loading }] = useMutation(DELETE_INTERVENTION_PLAN);

  const eliminarPlan = async (id: string) => {
    try {
      await mutation({ variables: { id } });
      toast.success("Plan eliminado correctamente");
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar el plan");
      throw err;
    }
  };

  return { eliminarPlan, eliminando: loading };
}
