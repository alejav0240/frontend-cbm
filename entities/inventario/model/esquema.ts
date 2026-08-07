import { z } from "zod";

export const esquemaInventario = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  type: z.string().min(1, "Selecciona un tipo"),
  condition: z.string().min(1, "Selecciona una condición"),
  room: z.string().min(1, "El aula / sala es obligatoria"),
  status: z.string().min(1, "Selecciona un estado"),
});

export type DatosFormularioInventario = z.infer<typeof esquemaInventario>;
