'use client';

import React from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { PDFExportModal } from '@/shared/ui/PDFExportModal';
import type { FilterConfig } from '@/shared/ui/PDFExportModal';
import { NormalizedPatient } from '@/modules/atencion/pacientes/types/patient';
import ClinicalForm from "@/modules/atencion/pacientes/components/ClinicalForm";
import CreatePatientForm from "@/modules/atencion/pacientes/components/CreatePatientForm";
import { generatePatientsPDF, generatePatientsExcel } from "@/modules/atencion/pacientes/services/pdf";

interface PatientsModalsProps {
    showForm: boolean;
    onCloseForm: () => void;
    onFormSubmit: (data: any) => void;
    isAdding: boolean;
    showClinicalForm: boolean;
    onCloseClinicalForm: () => void;
    selectedPatientForClinical: NormalizedPatient | null;
    onClinicalSubmit: (data: any) => void;
    showDeleteConfirm: boolean;
    onCloseDeleteConfirm: () => void;
    onConfirmDelete: () => void;
    showExportModal: boolean;
    onCloseExportModal: () => void;
    patientsList: NormalizedPatient[];
}

const patientsFilters: FilterConfig[] = [
    {
        key: 'status',
        label: 'Estado',
        type: 'select',
        options: [
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' }
        ]
    },
    {
        key: 'tipoTratamiento',
        label: 'Tipo de Tratamiento',
        type: 'select',
        options: [
            { value: 'INDIVIDUAL', label: 'Individual' },
            { value: 'GRUPAL', label: 'Grupal' }
        ]
    }
];

export function PatientsModals({
    showForm, onCloseForm, onFormSubmit, isAdding,
    showClinicalForm, onCloseClinicalForm, selectedPatientForClinical, onClinicalSubmit,
    showDeleteConfirm, onCloseDeleteConfirm, onConfirmDelete,
    showExportModal, onCloseExportModal, patientsList
}: PatientsModalsProps) {
    return (
        <>
            <Modal isOpen={showForm} onClose={onCloseForm} title="Registrar Nuevo Cliente">
                <CreatePatientForm onSubmit={onFormSubmit} onCancel={onCloseForm} isAdding={isAdding} />
            </Modal>

            <Modal isOpen={showClinicalForm} onClose={onCloseClinicalForm} title="Completar Registro Clínico">
                <ClinicalForm patient={selectedPatientForClinical} onSubmit={onClinicalSubmit} onCancel={onCloseClinicalForm} />
            </Modal>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={onCloseDeleteConfirm}
                onConfirm={onConfirmDelete}
                title="Eliminar Paciente"
                message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer y se perderá todo el historial clínico asociado."
                confirmLabel="Eliminar Paciente"
            />

            <PDFExportModal
                isOpen={showExportModal}
                onClose={onCloseExportModal}
                title="Exportar Reporte de Pacientes"
                data={patientsList}
                generatePDF={generatePatientsPDF}
                generateExcel={generatePatientsExcel}
                fileName="reporte_pacientes"
                filtersConfig={patientsFilters}
            />
        </>
    );
}
