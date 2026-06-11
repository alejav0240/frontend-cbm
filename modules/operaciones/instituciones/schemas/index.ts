import { z } from 'zod';

// ==========================================
// --- INSTITUTIONS ---
// ==========================================

export const createInstitutionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  contactEmail: z.string().email('Email inválido').min(1, 'El email es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
});

export const updateInstitutionSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
  name: z.string().optional(),
  contactEmail: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
});

export const deleteInstitutionSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
});

// ==========================================
// --- INSTITUTION GROUPS ---
// ==========================================

export const createInstitutionGroupSchema = z.object({
  institutionId: z.string().min(1, 'El ID de la institución es requerido'),
  name: z.string().min(1, 'El nombre del grupo es requerido'),
});

export const updateInstitutionGroupSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
  name: z.string().min(1, 'El nombre del grupo es requerido'),
});

export const deleteInstitutionGroupSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
});

// ==========================================
// --- TYPES INFERENCE (Opcional) ---
// ==========================================

export type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;
export type UpdateInstitutionInput = z.infer<typeof updateInstitutionSchema>;
export type DeleteInstitutionInput = z.infer<typeof deleteInstitutionSchema>;

export type CreateInstitutionGroupInput = z.infer<typeof createInstitutionGroupSchema>;
export type UpdateInstitutionGroupInput = z.infer<typeof updateInstitutionGroupSchema>;
export type DeleteInstitutionGroupInput = z.infer<typeof deleteInstitutionGroupSchema>;