'use client';

import { useState, useMemo } from 'react';
import { usePatients } from './usePatient';
import { usePatientGrowth } from './usePatientGrowth';
import { usePatientsModals } from './usePatientsModals';
import { useDashboardStore } from '@/shared/store/dashboardStore';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { useLoadingStore, LOADING_KEYS } from '@/shared/store/loadingStore';
import { toast } from 'sonner';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import {ClinicalFormData, PatientFormData} from "@/modules/atencion/pacientes";

const K = LOADING_KEYS.pacientes;

export function usePatientsViewData() {
    const { globalSearchTerm, setCurrentPage: setActivePage, setSelectedPatient } = useDashboardStore();
    const { user } = useAuthStore();
    const { start, stop } = useLoadingStore();

    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [prevSearch, setPrevSearch] = useState('');
    const [prevStatus, setPrevStatus] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const modals = usePatientsModals();
    const { growthData } = usePatientGrowth();

    const searchTerm = globalSearchTerm || localSearchTerm;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    if (debouncedSearchTerm !== prevSearch || filterStatus !== prevStatus) {
        setPrevSearch(debouncedSearchTerm);
        setPrevStatus(filterStatus);
        setCurrentPage(1); // Se ejecuta inmediatamente en este ciclo de render
    }

    const { patients, totalCount, totalPages, addPatient, updatePatient, updateClinicalNotes, deletePatient, isAdding, refetch } =
        usePatients({search:debouncedSearchTerm, page:currentPage, status:filterStatus, pageSize:8});

    const normalizedPatients = useMemo(() => patients.map(p => ({
        ...p,
        name: p.fullName,
        idNumber: p.ci,
        image: p.imageUrl,
        status: p.status === 'active' ? 'Activo'
            : p.status === 'inactive' ? 'Inactivo'
            : p.status === 'discharged' ? 'Alta' : 'Pendiente',
    })), [patients]);

    const navigateToExpediente = (id: string, name: string) => {
        setSelectedPatient({ id, name });
        setActivePage('expedientes');
    };

    const handleFormSubmit = async (formData: PatientFormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        start(K.create);
        try {
            if (!user?.databaseId) {
                toast.error('Sesión inválida. Por favor, reingresa.');
                return;
            }
            let imageUrl = '';
            if (formData.photo instanceof File) {
                const fd = new FormData();
                fd.append('file', formData.photo);
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('Error al subir la imagen');
                imageUrl = (await res.json()).url;
            }
            await addPatient({
                authorId: user.databaseId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                ci: formData.idCard,
                birthDate: formData.dob,
                diagnosis: formData.diagnostico,
                residence: formData.residenciaActual,
                imageUrl,
                tutorName: formData.tutor,
                tutorCi: formData.ciTutor,
                tutorCelular: formData.tutorPhone,
                tutorEmail: formData.contactEmail,
                selectedDay: formData.selectedDay,
                selectedTime: formData.selectedTime,
            });
            modals.setShowForm(false);
            setCurrentPage(1);
            await refetch();
            toast.success('Paciente registrado correctamente');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar el paciente';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
            stop(K.create);
        }
    };

    const handleClinicalSubmit = async (clinicalData: ClinicalFormData) => {
        const { selectedPatientForClinical } = modals;
        if (!selectedPatientForClinical?.databaseId || !user?.databaseId) {
            toast.error('Error: Datos del paciente o usuario no encontrados');
            return;
        }
        start(K.clinical);
        try {
            await Promise.all([
                updateClinicalNotes({
                    patientId: selectedPatientForClinical.databaseId,
                    authorId: user.databaseId,
                    notes: [
                        { category: 'GENERAL_OBJECTIVE', content: clinicalData.objetivosGenerales },
                        { category: 'PHYSICAL_AREA',     content: clinicalData.fisico },
                        { category: 'EMOTIONAL_AREA',    content: clinicalData.emocional },
                        { category: 'COGNITIVE_AREA',    content: clinicalData.cognitivo },
                        { category: 'SOCIAL_AREA',       content: clinicalData.social },
                        { category: 'METHODS',           content: clinicalData.metodosAUsar },
                        { category: 'ADDITIONAL_NOTES',  content: clinicalData.notas },
                    ]
                }),
                updatePatient({ id: selectedPatientForClinical.id, registrationComplete: true }),
            ]);
            modals.setShowClinicalForm(false);
            await refetch();
            toast.success('Registro clínico completado correctamente');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el registro clínico';
            toast.error(errorMessage);
        } finally {
            stop(K.clinical);
        }
    };

    const handleDeletePatient = async () => {
        if (!modals.patientToDelete) return;
        start(K.delete);
        try {
            await deletePatient(modals.patientToDelete);
            toast.success('Paciente eliminado correctamente');
            modals.setShowDeleteConfirm(false);
            modals.setPatientToDelete(null);
            await refetch();
        } catch {
            toast.error('Error al eliminar el paciente');
        } finally {
            stop(K.delete);
        }
    };

    return {
        patients: normalizedPatients,
        patientsTotalCount: totalCount,
        growthData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setLocalSearchTerm,
        filterStatus,
        setFilterStatus,
        handleFormSubmit,
        handleClinicalSubmit,
        handleDeletePatient,
        navigateToExpediente,
        isAdding: isSubmitting || isAdding,
        ...modals,
    };
}
