import { z } from "zod";

export const esquemaPostBlog = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  resumen: z.string().min(1, "El resumen es requerido"),
  contenido: z.string().min(1, "El contenido es requerido"),
  categoria: z.string().min(1, "La categoría es requerida"),
  autor: z.string().min(1, "El autor es requerido"),
  urlImagen: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  tiempoLectura: z.string().optional(),
  estado: z.enum(["DRAFT", "PUBLISHED"]),
});

export type FormularioPostBlog = z.infer<typeof esquemaPostBlog>;
