"use client";

import { useMutation } from "@apollo/client/react";
import { CREATE_THERAPY_REPORT } from "./mutaciones";
import { toast } from "sonner";

interface CrearInformeInput {
  patientId: string;
  generatedById: string;
  reportUrl: string;
}

export function useCrearInforme() {
  const [mutation, { loading }] = useMutation(CREATE_THERAPY_REPORT);

  const crearInforme = async (input: CrearInformeInput) => {
    try {
      const { data } = await mutation({
        variables: {
          patientId: input.patientId,
          generatedById: input.generatedById,
          reportUrl: input.reportUrl,
        },
      });
      toast.success("Informe enviado correctamente");
      return (data as any)?.createTherapyReport?.report;
    } catch (err: any) {
      toast.error(err?.message || "Error al enviar el informe");
      throw err;
    }
  };

  return { crearInforme, creando: loading };
}
