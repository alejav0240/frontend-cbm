import { z } from "zod";
import { fechaNoFutura } from "@/shared/lib/schemas/fecha";

export const esquemaGasto = z.object({
  descripcion: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  categoria: z.string().min(1, "Selecciona una categoría"),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  fechaGasto: fechaNoFutura("Introduce una fecha de gasto válida"),
  estado: z.enum(["PAID", "PENDING"]),
});

export type DatosFormularioGasto = z.infer<typeof esquemaGasto>;
