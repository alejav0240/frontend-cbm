'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Pagination } from '@/shared/ui/Pagination';
import { NormalizedPatient } from '@/modules/atencion/pacientes/types/patient';
import PatientsTable from "@/modules/atencion/pacientes/components/PatientsTable";

interface PatientsListProps {
    patients: NormalizedPatient[];
    totalFiltered: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewProfile: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onCompleteClinical: (patient: NormalizedPatient) => void;
}

export function PatientsList({
    patients,
    totalFiltered,
    currentPage,
    totalPages,
    onPageChange,
    onViewProfile,
    onDelete,
    onCompleteClinical
}: PatientsListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden"
        >
            <PatientsTable
                patients={patients}
                onViewProfile={onViewProfile}
                onDelete={onDelete}
                onCompleteClinical={onCompleteClinical}
            />
            <div className="px-8 py-6 bg-gray-50/30 dark:bg-white/1 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Mostrando {patients.length} de {totalFiltered} clientes
                </p>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </motion.div>
    );
}
