import { z } from "zod";

export const esquemaSesionPrueba = z.object({
  testPatientName: z
    .string()
    .min(2, "El nombre del paciente debe tener al menos 2 caracteres"),
  testFatherPhone: z
    .string()
    .min(7, "El número de teléfono debe tener al menos 7 caracteres"),
  testDate: z.string().min(1, "La fecha es requerida"),
  testTime: z.string().min(1, "La hora es requerida"),
  testType: z.string().min(1, "Selecciona un tipo de sesión"),
  testTherapist: z.string().min(1, "Selecciona un terapeuta"),
});

export type DatosFormularioSesionPrueba = z.infer<
  typeof esquemaSesionPrueba
>;

export const esquemaCiclo = z.object({
  patientName: z.string().min(1, "Selecciona un paciente"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  numSessions: z.string().min(1, "Selecciona el número de sesiones"),
  therapist: z.string().min(1, "Selecciona un terapeuta"),
});

export type DatosFormularioCiclo = z.infer<typeof esquemaCiclo>;

export const esquemaSesionGrupal = z.object({
  therapistId: z.string().min(1, "Selecciona un terapeuta"),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  notes: z.string().optional(),
});

export type DatosFormularioSesionGrupal = z.infer<
  typeof esquemaSesionGrupal
>;

