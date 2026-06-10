'use client';

import React from 'react';
import {SearchableSelect} from "@/shared/ui/components/SearchableSelect";

const STATUS_OPTIONS = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Agendada', value: 'agendada' },
    { label: 'Confirmada', value: 'confirma' },
    { label: 'Completada', value: 'completa' },
    { label: 'Reprogramada', value: 'reprograma' },
    { label: 'Cancelada', value: 'cancelada' },
];

interface SessionsFiltersProps {
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    filterTherapist: string;
    setFilterTherapist: (therapist: string) => void;
    therapistsList?: string[];
}

export function SessionsFilters({
                                    filterStatus,
                                    setFilterStatus,
                                    filterTherapist,
                                    setFilterTherapist,
                                    therapistsList = []
                                }: SessionsFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <SearchableSelect
                options={STATUS_OPTIONS}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Estado"
            />
            <SearchableSelect
                options={['Todos', ...therapistsList]}
                value={filterTherapist}
                onChange={setFilterTherapist}
                placeholder="Terapeuta"
            />
        </div>
    );
}
