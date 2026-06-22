import { z } from "zod";

export const esquemaCita = z.object({
  patientId: z.string().min(1, "Selecciona un paciente"),
  therapistId: z.string().min(1, "Selecciona un terapeuta"),
  sessionDate: z.string().min(1, "La fecha es requerida"),
  sessionTime: z.string().min(1, "La hora es requerida"),
  sessionType: z.string().min(1, "El tipo de sesión es requerido"),
  durationMinutes: z
    .number()
    .min(15, "Mínimo 15 minutos")
    .max(180, "Máximo 180 minutos"),
  notes: z.string().optional(),
});

export type DatosCita = z.infer<typeof esquemaCita>;
