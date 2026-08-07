import { z } from "zod";

export const esquemaGasto = z.object({
  descripcion: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  categoria: z.string().min(1, "Selecciona una categoría"),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  fechaGasto: z.string().min(1, "La fecha es requerida"),
  estado: z.enum(["PAID", "PENDING"]),
});

export type DatosFormularioGasto = z.infer<typeof esquemaGasto>;
