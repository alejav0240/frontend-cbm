import { useState } from 'react';
import { NormalizedPatient } from '@/modules/atencion/pacientes/types/patient';

export function usePatientsModals() {
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showClinicalForm, setShowClinicalForm] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
    const [selectedPatientForClinical, setSelectedPatientForClinical] = useState<NormalizedPatient | null>(null);

    return {
        showForm, setShowForm,
        showDeleteConfirm, setShowDeleteConfirm,
        showExportModal, setShowExportModal,
        showClinicalForm, setShowClinicalForm,
        patientToDelete, setPatientToDelete,
        selectedPatientForClinical, setSelectedPatientForClinical,
    };
}
