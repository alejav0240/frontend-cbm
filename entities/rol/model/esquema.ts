import { z } from "zod";

export const esquemaRol = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  permisos: z.array(z.string()).min(1, "Debe seleccionar al menos un módulo"),
});

export type DatosFormularioRol = z.infer<typeof esquemaRol>;
