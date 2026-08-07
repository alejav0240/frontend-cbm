import { z } from "zod";

export const esquemaCurso = z.object({
  name: z.string().min(2, "El nombre del curso debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  price: z.number().nonnegative("El precio no puede ser negativo"),
  state: z.string().min(1, "Selecciona un estado"),
});

export type DatosFormularioCurso = z.infer<typeof esquemaCurso>;

export const esquemaInscripcion = z.object({
  fullName: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres"),
  carnet: z
    .string()
    .min(5, "El carnet debe tener al menos 5 caracteres"),
  paymentMethod: z.string().min(1, "Selecciona un método de pago"),
  amount: z.number().nonnegative("El monto no puede ser negativo"),
});

export type DatosFormularioInscripcion = z.infer<typeof esquemaInscripcion>;
