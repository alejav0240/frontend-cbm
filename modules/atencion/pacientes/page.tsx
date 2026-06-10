"use client";

import React from "react";
import { usePatientsViewData } from "./hooks/usePatientsViewData";
import { PatientsStats } from "./components/PatientsStats";
import { PatientsHeader } from "./components/PatientsHeader";
import { PatientsFilters } from "./components/PatientsFilters";
import { PatientsList } from "./components/PatientsList";
import { PatientsModals } from "./components/PatientsModals";

export function PacientesView() {
  const {
    patients,
    patientsTotalCount,
    totalPages,
    currentPage,
    growthData,
    setCurrentPage,
    searchTerm,
    setLocalSearchTerm,
    filterStatus,
    setFilterStatus,
    showForm,
    setShowForm,
    showClinicalForm,
    setShowClinicalForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showExportModal,
    setShowExportModal,
    selectedPatientForClinical,
    setSelectedPatientForClinical,
    setPatientToDelete,
    handleFormSubmit,
    handleClinicalSubmit,
    handleDeletePatient,
    navigateToExpediente,
    isAdding,
  } = usePatientsViewData();

  return (
    <div className="space-y-8">
      <PatientsStats
        totalPatients={patientsTotalCount}
        growthData={growthData}
      />

      <PatientsHeader
        onExport={() => setShowExportModal(true)}
        onNewPatient={() => setShowForm(true)}
      />

      <PatientsFilters
        searchTerm={searchTerm}
        onSearchChange={setLocalSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />

      <PatientsList
        patients={patients}
        totalFiltered={patientsTotalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewProfile={(id, name) => navigateToExpediente(id, name)}
        onDelete={(id) => {
          setPatientToDelete(id);
          setShowDeleteConfirm(true);
        }}
        onCompleteClinical={(patient) => {
          setSelectedPatientForClinical(patient);
          setShowClinicalForm(true);
        }}
      />

      <PatientsModals
        showForm={showForm}
        onCloseForm={() => setShowForm(false)}
        onFormSubmit={handleFormSubmit}
        isAdding={isAdding}
        showClinicalForm={showClinicalForm}
        onCloseClinicalForm={() => setShowClinicalForm(false)}
        selectedPatientForClinical={selectedPatientForClinical}
        onClinicalSubmit={handleClinicalSubmit}
        showDeleteConfirm={showDeleteConfirm}
        onCloseDeleteConfirm={() => setShowDeleteConfirm(false)}
        onConfirmDelete={handleDeletePatient}
        showExportModal={showExportModal}
        onCloseExportModal={() => setShowExportModal(false)}
        patientsList={patients}
      />
    </div>
  );
}
