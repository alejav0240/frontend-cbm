"use client";

import { useMutation } from "@apollo/client/react";
import { DELETE_STEP_PLAN } from "./mutaciones";
import { toast } from "sonner";

export function useEliminarPasoPlan() {
  const [mutation, { loading }] = useMutation(DELETE_STEP_PLAN);

  const eliminarPaso = async (id: string) => {
    try {
      await mutation({ variables: { id } });
      toast.success("Paso eliminado correctamente");
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar el paso");
      throw err;
    }
  };

  return { eliminarPaso, eliminando: loading };
}
