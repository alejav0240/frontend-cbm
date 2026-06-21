import { z } from "zod";

export const formularioClinicoSchema = z.object({
  objetivosGenerales: z
    .string()
    .min(5, "Los objetivos deben tener al menos 5 caracteres"),
  fisico: z.string().min(2, "El perfil físico es requerido"),
  emocional: z.string().min(2, "El perfil emocional es requerido"),
  cognitivo: z.string().min(2, "El perfil cognitivo es requerido"),
  social: z.string().min(2, "El perfil social es requerido"),
  metodosAUsar: z.string().min(2, "Los métodos son requeridos"),
  notas: z.string().optional(),
});

export type FormularioClinicoDataSchema = z.infer<
  typeof formularioClinicoSchema
>;
