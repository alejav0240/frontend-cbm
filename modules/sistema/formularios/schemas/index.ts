import { z } from "zod";

// ==========================================
// SUB-SCHEMAS (INPUT TYPES)
// ==========================================

// Asumiendo una estructura típica para QuestionInput. 
// Ajusta los campos según lo que requiera tu backend.
export const questionInputSchema = z.object({
  text: z.string().min(1, "El texto de la pregunta es obligatorio"),
  type: z.string().min(1, "El tipo de pregunta es obligatorio"), // ej: "TEXT", "MULTIPLE_CHOICE"
  required: z.boolean().optional().default(false),
  options: z.array(z.string()).optional().nullable(), // Para preguntas de opción múltiple
});

// Asumiendo una estructura típica para ResponseInput.
export const responseInputSchema = z.object({
  questionId: z.string().min(1, "El ID de la pregunta es obligatorio"),
  value: z.string().min(1, "La respuesta no puede estar vacía"), // O el tipo que manejes (string, number, etc.)
});


// ==========================================
// FORM SCHEMAS
// ==========================================

export const createFormSchema = z.object({
  name: z.string().min(1, "El nombre del formulario es obligatorio"),
  description: z.string().optional().nullable(),
  questions: z.array(questionInputSchema).min(1, "Debes incluir al menos una pregunta"),
});

export const deleteFormSchema = z.object({
  id: z.string().min(1, "El ID del formulario es obligatorio"),
});


// ==========================================
// FORM ASSIGNMENT SCHEMAS
// ==========================================

export const assignFormSchema = z.object({
  formId: z.string().min(1, "El ID del formulario es obligatorio"),
  assignedToId: z.string().min(1, "El ID del asignado es obligatorio"),
  assignedById: z.string().min(1, "El ID del asignador es obligatorio"),
  patientId: z.string().optional().nullable(),
});


// ==========================================
// FORM SUBMISSION SCHEMAS
// ==========================================

export const submitFullFormSchema = z.object({
  assignmentId: z.string().min(1, "El ID de la asignación es obligatorio"),
  responses: z.array(responseInputSchema).min(1, "Debes enviar al menos una respuesta"),
});


// ==========================================
// TYPES INFERENCE
// ==========================================

export type QuestionInput = z.infer<typeof questionInputSchema>;
export type ResponseInput = z.infer<typeof responseInputSchema>;

export type CreateFormInput = z.infer<typeof createFormSchema>;
export type DeleteFormInput = z.infer<typeof deleteFormSchema>;
export type AssignFormInput = z.infer<typeof assignFormSchema>;
export type SubmitFullFormInput = z.infer<typeof submitFullFormSchema>;