"use client";

import { useMutation } from "@apollo/client/react";
import { DELETE_THERAPY_REPORT } from "./mutaciones";
import { toast } from "sonner";

export function useEliminarInforme() {
  const [mutation, { loading }] = useMutation(DELETE_THERAPY_REPORT);

  const eliminarInforme = async (id: string) => {
    try {
      await mutation({ variables: { id } });
      toast.success("Informe eliminado correctamente");
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar el informe");
      throw err;
    }
  };

  return { eliminarInforme, eliminando: loading };
}
