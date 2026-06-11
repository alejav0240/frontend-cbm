import { z } from "zod";

// ==========================================
// INVENTORY ITEM SCHEMAS
// ==========================================

export const createInventoryItemSchema = z.object({
  name: z.string().min(1, "El nombre del artículo es obligatorio"),
  type: z.string().min(1, "El tipo de artículo es obligatorio"),
  condition: z.string().min(1, "El estado de conservación/condición es obligatorio"),
  room: z.string().min(1, "El aula o habitación es obligatoria"),
  status: z.string().optional().nullable(), // ej: "DISPONIBLE", "PRESTADO", "MANTENIMIENTO"
});

export const updateInventoryItemSchema = z.object({
  id: z.string().min(1, "El ID del artículo es obligatorio"),
  name: z.string().min(1, "El nombre no puede estar vacío").optional(),
  type: z.string().min(1, "El tipo no puede estar vacío").optional(),
  condition: z.string().min(1, "La condición no puede estar vacía").optional(),
  room: z.string().min(1, "La habitación no puede estar vacía").optional(),
  status: z.string().optional().nullable(),
});

export const deleteInventoryItemSchema = z.object({
  id: z.string().min(1, "El ID del artículo es obligatorio"),
});


// ==========================================
// TYPES INFERENCE
// ==========================================

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;
export type DeleteInventoryItemInput = z.infer<typeof deleteInventoryItemSchema>;