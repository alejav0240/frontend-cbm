import { z } from "zod";

export const esquemaEvaluacion = z.object({
  patientId: z.string().min(1, "Selecciona un paciente"),
  type: z.string().min(1, "Selecciona la etapa de evaluación"),
  date: z.string().min(1, "La fecha es requerida"),
  scaleId: z.string().min(1, "Selecciona una escala"),
});

export type DatosFormularioEvaluacion = z.infer<typeof esquemaEvaluacion>;
