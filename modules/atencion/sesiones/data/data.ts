import { FilterConfig } from "@/modules/atencion/sesiones/types/session";

export const sessionsFilters: FilterConfig[] = [
    {
        key: 'status',
        label: 'Estado',
        type: 'select',
        options: [
            { value: 'Confirmada', label: 'Confirmada' },
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Completada', label: 'Completada' },
        ],
    },
    {
        key: 'therapist',
        label: 'Terapeuta',
        type: 'select',
        options: [],
    },
    {
        key: 'date',
        label: 'Rango de Fechas',
        type: 'date-range',
    },
];
