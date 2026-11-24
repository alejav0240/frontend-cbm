import { z } from "zod";
import { fechaISO } from "@/shared/lib/schemas/fecha";

export const esquemaPlanIntervencion = z.object({
  patientId: z.string().min(1, "Selecciona un paciente"),
  objective: z
    .string()
    .min(5, "El objetivo debe tener al menos 5 caracteres"),
  startDate: fechaISO("Introduce una fecha de inicio válida"),
});

export type DatosFormularioPlan = z.infer<typeof esquemaPlanIntervencion>;

export const esquemaPasoPlan = z.object({
  momento: z.string().min(1, "Selecciona un momento"),
  duracion: z.number().min(1, "La duración debe ser mayor a 0"),
  objetivoPaso: z.string().min(1, "Selecciona un objetivo"),
  focoPaso: z.string().optional(),
  recursosMusicales: z.string().optional(),
  enfasisMusical: z.string().optional(),
  enfoque: z.string().optional(),
  mltEnfoque: z.string().optional(),
});

export type DatosFormularioPasoPlan = z.infer<typeof esquemaPasoPlan>;
