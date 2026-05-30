import { z } from 'zod';

// ─── Patient creation form ────────────────────────────────────────────────────

export const patientSchema = z.object({
    firstName:       z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName:        z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    dob:             z.string().min(1, 'La fecha de nacimiento es requerida'),
    idCard:          z.string().min(5, 'El carnet/ID debe tener al menos 5 caracteres'),
    tutor:           z.string().optional(),
    ciTutor:         z.string().min(5, 'El carnet del tutor debe tener al menos 5 caracteres').optional().or(z.literal('')),
    tutorPhone:      z.string().optional(),
    contactEmail:    z.string().email('Email inválido').or(z.literal('')),
    residenciaActual: z.string().optional(),
    diagnostico:     z.string().optional(),
    selectedDay:     z.string().min(1, 'El día es requerido'),
    selectedTime:    z.string().min(1, 'El horario es requerido'),
    photo:           z.any().nullable().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// ─── Clinical notes form ──────────────────────────────────────────────────────

export const clinicalSchema = z.object({
    objetivosGenerales: z.string().min(5, 'Los objetivos deben tener al menos 5 caracteres'),
    fisico:             z.string().min(2, 'El perfil físico es requerido'),
    emocional:          z.string().min(2, 'El perfil emocional es requerido'),
    cognitivo:          z.string().min(2, 'El perfil cognitivo es requerido'),
    social:             z.string().min(2, 'El perfil social es requerido'),
    metodosAUsar:       z.string().min(2, 'Los métodos son requeridos'),
    notas:              z.string().optional(),
});

export type ClinicalFormData = z.infer<typeof clinicalSchema>;
