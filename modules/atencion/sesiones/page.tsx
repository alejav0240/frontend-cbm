"use client";

import React, { useMemo } from "react";
import { SessionsStats } from "@/modules/atencion/sesiones/components/SessionsStats";
import { SessionFormModal } from "@/modules/atencion/sesiones/components/SessionFormModal";
import { SessionsHeader } from "@/modules/atencion/sesiones/components/SessionsHeader";
import { SessionsFilters } from "@/modules/atencion/sesiones/components/SessionsFilters";
import { SessionsTable } from "@/modules/atencion/sesiones/components/SessionsTable";
import { SessionDetailsModal } from "@/modules/atencion/sesiones/components/SessionDetailsModal";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import PDFExportModal from "@/shared/ui/PDFExportModal";
import { useSessionsData } from "@/modules/atencion/sesiones/hooks/useSessionsData";
import { sessionsFilters } from "@/modules/atencion/sesiones/data/data";
import {
  generateSessionsListPDF,
  generateSessionsExcel,
} from "@/modules/atencion/sesiones/services/pdf";
import {
  generateSessionPDF,
  generateSessionWord,
} from "@/modules/atencion/sesiones/services/sessionExport";
import { NormalizedSession } from "@/modules/atencion/sesiones/types/session";
import {useCurrentPage, useDashboardStore} from "@/shared/store/dashboardStore";

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
    handleOpenSessionExport,
    handleSendReminder,
    showForm,
    setShowForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showExportModal,
    setShowExportModal,
    showSessionExportModal,
    setShowSessionExportModal,
    selectedSession,
    setSelectedSession,
    selectedSessionForSummary,
    setSelectedSessionForSummary,
    isEditingNotes,
    setIsEditingNotes,
    setSessionToDelete,
  } = useSessionsData();

  // todo: analizar si es necesario o se puede hacer en useSessionsData
  const sessionSummaryData = useMemo(
    () => (selectedSessionForSummary ? [selectedSessionForSummary] : []),
    [selectedSessionForSummary],
  );
  //todo: falat integrar con onStartSession onCompleteSession
    const {setCurrentPage:setNavigate} = useDashboardStore();
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
          onExportSession={handleOpenSessionExport}
          onViewDetails={(s) => setSelectedSession(s as NormalizedSession)}
          onStartSession={() => {setNavigate('sesion')}}
          onCompleteSession={() => {}}
          onDeleteSession={(id: number) => {
            setSessionToDelete(String(id));
            setShowDeleteConfirm(true);
          }}
        />
      </div>

      {/* Exportar reporte general — PDF + Excel */}
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

      {/* Exportar sesión individual — PDF + Word */}
      <PDFExportModal
        isOpen={showSessionExportModal}
        onClose={() => {
          setShowSessionExportModal(false);
          setSelectedSessionForSummary(null);
        }}
        title={`Exportar Sesión #${selectedSessionForSummary?.sessionNum ?? ""} — ${selectedSessionForSummary?.patientName ?? ""}`}
        data={sessionSummaryData}
        generatePDF={generateSessionPDF}
        generateWord={generateSessionWord}
        fileName={`sesion_${selectedSessionForSummary?.sessionNum ?? ""}_${selectedSessionForSummary?.patientName?.replace(/\s+/g, "_") ?? ""}`}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteSession}
        title="Eliminar Sesión"
        message="¿Estás seguro de que deseas eliminar este registro de sesión? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Sesión"
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
        onExportSession={handleOpenSessionExport}
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
