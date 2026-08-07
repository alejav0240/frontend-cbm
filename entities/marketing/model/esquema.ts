import { z } from "zod";

export const esquemaLead = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres"),
  email: z.string().email("Email inválido").or(z.literal("")).optional(),
  source: z.string().min(1, "Selecciona el origen / campaña"),
  status: z.string().min(1, "Selecciona un estado"),
  notes: z.string().optional(),
});

export type DatosFormularioLead = z.infer<typeof esquemaLead>;

export const esquemaCampana = z.object({
  name: z.string().min(2, "El nombre de la campaña es obligatorio"),
  platform: z.string().min(1, "Selecciona una plataforma"),
  budget: z
    .number()
    .nonnegative("El presupuesto no puede ser negativo"),
  spent: z.number().nonnegative("El monto invertido no puede ser negativo"),
  status: z.string().min(1, "Selecciona un estado"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
});

export type DatosFormularioCampana = z.infer<typeof esquemaCampana>;
