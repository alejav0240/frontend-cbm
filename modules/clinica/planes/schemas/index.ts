import { z } from "zod";

// ==========================================
// INTERVENTION PLAN SCHEMAS
// ==========================================

export const createInterventionPlanSchema = z.object({
    patientId: z.string().min(1, "El ID del paciente es obligatorio"),
    createdById: z.string().min(1, "El ID del creador es obligatorio"),
    mainObjective: z.string().min(1, "El objetivo principal no puede estar vacío"),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
});

export const updateInterventionPlanSchema = z.object({
    id: z.string().min(1, "El ID del plan es obligatorio"),
    mainObjective: z.string().min(1, "El objetivo no puede estar vacío").optional(),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
});

export const deleteInterventionPlanSchema = z.object({
    id: z.string().min(1, "El ID es obligatorio"),
});


// ==========================================
// STEP PLAN SCHEMAS
// ==========================================

export const createStepPlanSchema = z.object({
    planId: z.string().min(1, "El ID del plan es obligatorio"),
    moment: z.string().min(1, "El momento es obligatorio"),
    objective: z.string().min(1, "El objetivo es obligatorio"),
    durationMinutes: z.number().int().positive("La duración debe ser un número entero positivo").optional().nullable(),
    focus: z.string().optional().nullable(),
    musicalResources: z.string().optional().nullable(),
    musicalEmphasis: z.string().optional().nullable(),
    approach: z.string().optional().nullable(),
    mltMethod: z.string().optional().nullable(),
});

export const updateStepPlanSchema = z.object({
    id: z.string().min(1, "El ID del paso es obligatorio"),
    moment: z.string().optional().nullable(),
    objective: z.string().optional().nullable(),
    durationMinutes: z.number().int().positive().optional().nullable(),
    focus: z.string().optional().nullable(),
    musicalResources: z.string().optional().nullable(),
    musicalEmphasis: z.string().optional().nullable(),
    approach: z.string().optional().nullable(),
    mltMethod: z.string().optional().nullable(),
});

export const deleteStepPlanSchema = z.object({
    id: z.string().min(1, "El ID es obligatorio"),
});


// ==========================================
// STEP PROGRESS SCHEMAS
// ==========================================

export const updateStepProgressSchema = z.object({
    stepId: z.string().min(1, "El ID del paso es obligatorio"),
    isCompleted: z.boolean().optional().nullable(),
});


// ==========================================
// TYPES INFERENCE (Opcional, por si los necesitas)
// ==========================================

export type CreateInterventionPlanInput = z.infer<typeof createInterventionPlanSchema>;
export type UpdateInterventionPlanInput = z.infer<typeof updateInterventionPlanSchema>;
export type CreateStepPlanInput = z.infer<typeof createStepPlanSchema>;
export type UpdateStepPlanInput = z.infer<typeof updateStepPlanSchema>;
export type UpdateStepProgressInput = z.infer<typeof updateStepProgressSchema>;