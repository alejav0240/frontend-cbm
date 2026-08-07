import { z } from "zod";

export const esquemaRecurso = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  type: z.string().min(1, "Selecciona un tipo de recurso"),
  category: z.string().min(2, "La categoría debe tener al menos 2 caracteres"),
  url: z.string().optional(),
});

export type DatosFormularioRecurso = z.infer<typeof esquemaRecurso>;
