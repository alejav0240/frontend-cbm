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

export const FormulariosPage = () => {
  const [activeTab, setActiveTab] = useState<
    "templates" | "assignments" | "responses"
  >("templates");
  const { formularios, refetch: refetchForms } = useFormularios();
  const {
    asignaciones,
    respuestaForm,
    refetch: refetchAssignments,
  } = useAsignacionesFormulario();
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
          assignedById: usuario.databaseId,
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

      <FormsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "templates" && (
        <TemplatesList
          templates={formularios}
          onPreview={handlePreview}
          onAssign={handleAssignClick}
          onDelete={handleDeleteForm}
        />
      )}

      {activeTab === "assignments" && (
        <AssignmentsTable
          assignments={asignaciones}
          templates={formularios}
          responses={respuestaForm}
        />
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
