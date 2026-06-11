import { z } from "zod";

// ==========================================
// ROLE SCHEMAS
// ==========================================

export const createRoleSchema = z.object({
    name: z.string().min(1, "El nombre del rol es obligatorio"),
    permissions: z.array(z.string()).optional().nullable(),
});

export const updateRoleSchema = z.object({
    id: z.string().min(1, "El ID del rol es obligatorio"),
    name: z.string().min(1, "El nombre del rol no puede estar vacío").optional(),
    permissions: z.array(z.string()).optional().nullable(),
});


// ==========================================
// TYPES INFERENCE
// ==========================================

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;