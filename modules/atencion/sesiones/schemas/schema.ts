import { z } from 'zod';

const sessionTypes = ['individual', 'group'] as const;

export const sessionSchema = z.object({
    patientId: z.string().min(1, 'Debe seleccionar un cliente/paciente'),
    therapistId: z.string().min(1, 'Debe seleccionar un terapeuta'),
    sessionDate: z.string().min(1, 'La fecha es requerida'),
    sessionTime: z.string().min(1, 'La hora es requerida'),

    // FIX 1: Pass 'invalid_type_error' directly to z.enum instead of an errorMap
    sessionType: z.enum(sessionTypes, {
        message: 'Seleccione un tipo de sesión válido',
    }),

    durationMinutes: z.number({ message: 'La duración debe ser un número' })
        .min(1, 'La duración mínima es de 1 minuto')
        .max(480, 'La sesión no puede exceder las 8 horas'),

    notes: z.string().optional().nullable().or(z.string().length(0)),
    executionDescription: z.string().optional()
});

export type SessionFormData = z.infer<typeof sessionSchema>;