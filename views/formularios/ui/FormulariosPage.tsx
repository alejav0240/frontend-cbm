"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { FormsHeader } from "@/views/formularios/ui/components/FormsHeader";
import { FormsTabs } from "@/views/formularios/ui/components/FormsTabs";
import { TemplatesList } from "@/views/formularios/ui/components/TemplatesList";
import {
  useAsignacionesFormulario,
  useFormularios,
  useCreateForm,
  useDeleteForm,
  useAssignForm,
} from "@/entities/formulario";
import type {
  FormTemplate,
  FormResponse,
  DatosCrearFormulario,
  DatosAsignarFormulario,
} from "@/entities/formulario";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { AssignmentsTable } from "@/views/formularios/ui/components/AssignmentsTable";
import { ResponsesTable } from "@/views/formularios/ui/components/ResponsesTable";
import { FormCreateModal } from "@/views/formularios/ui/components/FormCreateModal";
import { FormAssignModal } from "@/views/formularios/ui/components/FormAssignModal";
import { FormPreviewModal } from "@/views/formularios/ui/components/FormPreviewModal";
import { ResponseDetailModal } from "@/views/formularios/ui/components/ResponseDetailModal";
import { Pagination } from "@/shared/ui/Pagination";

export const FormulariosPage = () => {
  const [activeTab, setActiveTab] = useState<
    "templates" | "assignments" | "responses"
  >("templates");
  const [paginaActualPlantillas, setPaginaActualPlantillas] = useState(1);
  const [paginaActualAsignaciones, setPaginaActualAsignaciones] = useState(1);
  const { formularios, paginas: paginasPlantillas, refetch: refetchForms } =
    useFormularios({ page: paginaActualPlantillas, pageSize: 10 });
  const {
    asignaciones,
    respuestaForm,
    paginas: paginasAsignaciones,
    refetch: refetchAssignments,
  } = useAsignacionesFormulario({ page: paginaActualAsignaciones, pageSize: 10 });
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null,
  );

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showAssign, setShowAssign] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);

  const { usuario } = useAuthStore();
  const { createForm, creando } = useCreateForm();
  const { deleteForm } = useDeleteForm();
  const { assignForm, asignando } = useAssignForm();

  const handleCreateForm = useCallback(
    async (data: DatosCrearFormulario) => {
      try {
        const questions = data.questions.map((q, i) => ({
          question: q.question,
          questionType: q.questionType,
          isRequired: q.isRequired ?? false,
          orderIndex: i,
        }));
        await createForm({
          name: data.name,
          description: data.description || null,
          questions,
        });
        toast.success("Formulario creado exitosamente");
        setShowForm(false);
        refetchForms();
      } catch {
        toast.error("Error al crear el formulario");
      }
    },
    [createForm, refetchForms],
  );

  const handleAssignForm = useCallback(
    async (data: DatosAsignarFormulario) => {
      if (!selectedForm || !usuario) return;
      try {
        await assignForm({
          formId: selectedForm.id,
          assignedById: String(usuario.databaseId),
          assignedToId: null,
          patientId: null,
          sessionId: null,
        });
        toast.success(`Formulario asignado a rol: ${data.role}`);
        setShowAssign(false);
        setSelectedForm(null);
        refetchAssignments();
      } catch {
        toast.error("Error al asignar el formulario");
      }
    },
    [selectedForm, usuario, assignForm, refetchAssignments],
  );

  const handleDeleteForm = useCallback(
    async (id: string) => {
      try {
        await deleteForm(id);
        toast.success("Formulario eliminado");
        refetchForms();
      } catch {
        toast.error("Error al eliminar el formulario");
      }
    },
    [deleteForm, refetchForms],
  );

  const handlePreview = useCallback((form: FormTemplate) => {
    setSelectedForm(form);
    setShowPreview(true);
  }, []);

  const handleAssignClick = useCallback((form: FormTemplate) => {
    setSelectedForm(form);
    setShowAssign(true);
  }, []);

  return (
    <div className="space-y-8">
      <FormsHeader onCreateForm={() => setShowForm(true)} />

      <FormsTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "templates") setPaginaActualPlantillas(1);
          if (tab === "assignments") setPaginaActualAsignaciones(1);
        }}
      />

      {activeTab === "templates" && (
        <>
          <TemplatesList
            templates={formularios}
            onPreview={handlePreview}
            onAssign={handleAssignClick}
            onDelete={handleDeleteForm}
          />
          <Pagination
            currentPage={paginaActualPlantillas}
            totalPages={paginasPlantillas}
            onPageChange={setPaginaActualPlantillas}
          />
        </>
      )}

      {activeTab === "assignments" && (
        <>
          <AssignmentsTable
            assignments={asignaciones}
            templates={formularios}
            responses={respuestaForm}
          />
          <Pagination
            currentPage={paginaActualAsignaciones}
            totalPages={paginasAsignaciones}
            onPageChange={setPaginaActualAsignaciones}
          />
        </>
      )}

      {activeTab === "responses" && (
        <ResponsesTable
          responses={respuestaForm}
          assignments={asignaciones}
          templates={formularios}
          onViewDetails={setSelectedResponse}
        />
      )}

      <FormCreateModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateForm}
        creando={creando}
      />

      <FormAssignModal
        isOpen={showAssign}
        onClose={() => {
          setShowAssign(false);
          setSelectedForm(null);
        }}
        selectedForm={selectedForm}
        onAssign={handleAssignForm}
        asignando={asignando}
      />

      <FormPreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setSelectedForm(null);
        }}
        selectedForm={selectedForm}
      />

      <ResponseDetailModal
        isOpen={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        selectedResponse={selectedResponse}
        assignments={asignaciones}
        templates={formularios}
      />
    </div>
  );
};
