import { z } from "zod/v4";
import type { FormQuestion } from "./tipos";

export const esquemaCrearFormulario = z.object({
  name: z.string().min(1, "El nombre del formulario es obligatorio"),
  description: z.string().optional(),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "La pregunta es obligatoria"),
        questionType: z.string().min(1, "El tipo de pregunta es obligatorio"),
        isRequired: z.boolean().optional(),
        orderIndex: z.number().int().optional(),
      }),
    )
    .min(1, "Debe agregar al menos un campo"),
});

export type DatosCrearFormulario = z.infer<typeof esquemaCrearFormulario>;

export const esquemaAsignarFormulario = z.object({
  role: z.string().min(1, "Debe seleccionar un rol"),
});

export type DatosAsignarFormulario = z.infer<typeof esquemaAsignarFormulario>;

export function crearEsquemaCuestionario(questions: FormQuestion[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const pregunta of questions) {
    shape[pregunta.id] = pregunta.isRequired
      ? z.string().min(1, "Esta respuesta es obligatoria")
      : z.string().optional();
  }
  return z.object(shape);
}
