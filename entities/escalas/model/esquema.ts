import { z } from "zod";
import { fechaNoFutura } from "@/shared/lib/schemas/fecha";

export const esquemaEvaluacion = z.object({
  patientId: z.string().min(1, "Selecciona un paciente"),
  type: z.string().min(1, "Selecciona la etapa de evaluación"),
  date: fechaNoFutura("Introduce una fecha de evaluación válida"),
  scaleId: z.string().min(1, "Selecciona una escala"),
});

export type DatosFormularioEvaluacion = z.infer<typeof esquemaEvaluacion>;
