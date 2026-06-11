import { z } from "zod";

// ==========================================
// DIGITAL RESOURCE SCHEMAS
// ==========================================

export const createDigitalResourceSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    type: z.string().min(1, "El tipo de recurso es obligatorio"),
    url: z.string().url("Debe ser una URL válida").min(1, "La URL es obligatoria"),
    category: z.string().optional().nullable(),
});

export const updateDigitalResourceSchema = z.object({
    id: z.string().min(1, "El ID del recurso es obligatorio"),
    title: z.string().min(1, "El título no puede estar vacío").optional(),
    type: z.string().min(1, "El tipo no puede estar vacío").optional(),
    url: z.string().url("Debe ser una URL válida").optional().nullable(),
    category: z.string().optional().nullable(),
});

export const deleteDigitalResourceSchema = z.object({
    id: z.string().min(1, "El ID es obligatorio"),
});


// ==========================================
// TYPES INFERENCE
// ==========================================

export type CreateDigitalResourceInput = z.infer<typeof createDigitalResourceSchema>;
export type UpdateDigitalResourceInput = z.infer<typeof updateDigitalResourceSchema>;
export type DeleteDigitalResourceInput = z.infer<typeof deleteDigitalResourceSchema>;