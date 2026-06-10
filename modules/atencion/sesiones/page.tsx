'use client';

import { SessionsStats } from "@/modules/atencion/sesiones/components/SessionsStats";
import { SessionFormModal } from "@/modules/atencion/sesiones/components/SessionFormModal";
import { SessionsHeader } from "@/modules/atencion/sesiones/components/SessionsHeader";
import { SessionsFilters } from "@/modules/atencion/sesiones/components/SessionsFilters";
import { SessionsTable } from "@/modules/atencion/sesiones/components/SessionsTable";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import PDFExportModal from "@/shared/ui/PDFExportModal";
import { SessionDetailsModal } from "@/modules/atencion/sesiones/components/SessionDetailsModal";
import { useSessionsData } from "@/modules/atencion/sesiones/hooks/useSessionsData";
import { sessionsFilters } from "@/modules/atencion/sesiones/data/data";
import { generateSessionsListPDF, generateSessionSummaryPDF, generateSessionsExcel } from "@/modules/atencion/sesiones/services/pdf";
import { NormalizedSession } from "@/modules/atencion/sesiones/types/session";

export function SesionesView() {
    const {
        sessions,
        filteredSessions,
        paginatedSessions,
        totalPages,
        currentPage,
        setCurrentPage,
        isSubmitting,
        therapistsList,
        form,
        patientOptions,
        therapistOptions,
        isLoadingPatients,
        isLoadingTherapists,
        setPatientSearchTerm,
        setTherapistSearchTerm,
        filterStatus,
        setFilterStatus,
        filterTherapist,
        setFilterTherapist,
        editedNotes,
        setEditedNotes,
        handleFormSubmit,
        handleDeleteSession,
        handleSaveNotes,
        handleExportSession,
        handleSendReminder,
        showForm, setShowForm,
        showDeleteConfirm, setShowDeleteConfirm,
        showExportModal, setShowExportModal,
        showSummaryModal, setShowSummaryModal,
        selectedSession, setSelectedSession,
        selectedSessionForSummary,
        isEditingNotes, setIsEditingNotes,
        setSessionToDelete,
    } = useSessionsData();

    return (
        <div className="space-y-8">
            <SessionsStats />

            <SessionsHeader
                onExport={() => setShowExportModal(true)}
                onNewSession={() => setShowForm(true)}
            />

            <div className="space-y-6">
                <SessionsFilters
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterTherapist={filterTherapist}
                    setFilterTherapist={setFilterTherapist}
                    therapistsList={therapistsList}
                />

                <SessionsTable
                    sessions={paginatedSessions}
                    totalFilteredCount={filteredSessions.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                    onExportSession={handleExportSession}
                    onViewDetails={(s) => setSelectedSession(s as NormalizedSession)}
                    onStartSession={() => {}}
                    onCompleteSession={() => {}}
                    onDeleteSession={(id: number) => {
                        setSessionToDelete(String(id));
                        setShowDeleteConfirm(true);
                    }}
                />
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteSession}
                title="Eliminar Sesión"
                message="¿Estás seguro de que deseas eliminar este registro de sesión? Esta acción no se puede deshacer."
                confirmLabel="Eliminar Sesión"
            />

            <PDFExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Exportar Reporte de Sesiones"
                data={sessions}
                generatePDF={generateSessionsListPDF}
                generateExcel={generateSessionsExcel}
                fileName="reporte_sesiones"
                filtersConfig={sessionsFilters}
            />

            <PDFExportModal
                isOpen={showSummaryModal}
                onClose={() => setShowSummaryModal(false)}
                title="Vista Previa de Resumen de Sesión"
                data={selectedSessionForSummary ? [selectedSessionForSummary] : []}
                generatePDF={(data) => generateSessionSummaryPDF(data[0])}
                fileName={`resumen_sesion_${selectedSessionForSummary?.patientName?.replace(/\s+/g, '_') ?? ''}`}
            />

            <SessionDetailsModal
                session={selectedSession}
                isOpen={!!selectedSession}
                onClose={() => {
                    setSelectedSession(null);
                    setIsEditingNotes(false);
                }}
                isEditingNotes={isEditingNotes}
                setIsEditingNotes={setIsEditingNotes}
                editedNotes={editedNotes}
                setEditedNotes={setEditedNotes}
                onSaveNotes={handleSaveNotes}
                onExportSession={handleExportSession}
                onSendReminder={handleSendReminder}
            />

            <SessionFormModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleFormSubmit}
                form={form}
                patientOptions={patientOptions}
                therapistOptions={therapistOptions}
                onSearchPatient={setPatientSearchTerm}
                onSearchTherapist={setTherapistSearchTerm}
                isLoadingPatients={isLoadingPatients}
                isLoadingTherapists={isLoadingTherapists}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
