import { z } from "zod";

export const esquemaSesion = z.object({
  patientId: z.string().min(1, "Selecciona un paciente"),
  therapistId: z.string().min(1, "Selecciona un terapeuta"),
  sessionType: z.enum(["individual", "group"]),
  sessionDate: z.string().min(1, "La fecha es obligatoria"),
  sessionTime: z.string().min(1, "La hora es obligatoria"),
  durationMinutes: z
    .number()
    .min(1, "Duración mínima: 1 min")
    .max(480, "Duración máxima: 480 min"),
  executionDescription: z.string().optional(),
  notes: z.string().optional(),
});

export type SessionFormData = z.infer<typeof esquemaSesion>;
