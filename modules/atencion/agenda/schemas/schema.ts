import { z } from "zod";

export const appointmentSchema = z.object({
  patientName: z.string().min(1, "El paciente es requerido"),
  therapist: z.string().min(1, "El terapeuta es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  type: z.string().min(1, "El tipo es requerido"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
