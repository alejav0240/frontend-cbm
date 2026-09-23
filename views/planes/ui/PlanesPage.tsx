"use client";

import React, { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, ClipboardList } from "lucide-react";
import { InterventionPlanHeader } from "./components/InterventionPlanHeader";
import { InterventionPlanCard } from "./components/InterventionPlanCard";
import { InterventionPlanForm } from "./components/InterventionPlanForm";
import { StepFormModal } from "./components/StepFormModal";
import { InterventionPlanFilters } from "./components/InterventionPlanFilters";
import { PlanExportModal } from "./components/PlanExportModal";
import {
  usePlanesTratamiento,
  useCrearPlan,
  useEliminarPlan,
  useCrearPasoPlan,
  useActualizarPasoPlan,
  useEliminarPasoPlan,
} from "@/entities/plan-tratamiento";
import { useBuscarPacientes } from "@/entities/paciente";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { Pagination } from "@/shared/ui/Pagination";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import type { PasoPlan } from "@/entities/plan-tratamiento";
import type {
  DatosFormularioPlan,
  DatosFormularioPasoPlan,
} from "@/entities/plan-tratamiento";
import type { PasoTarjeta, PlanTarjeta } from "./tipos";

function mapPasos(pasos: PasoPlan[]): PasoTarjeta[] {
  return pasos.map((p) => ({
    id: p.id,
    momento: p.momento,
    objetivo: p.objetivo,
    foco: p.enfoque ?? "",
    recursosMusicales: p.recursosMusicales ?? "",
    enfasisMusical: p.enfasisMusical ?? "",
    enfoque: p.abordaje ?? "",
    mltEnfoque: p.metodoMlt ?? "",
    duracion: p.duracionMinutos,
    completed: p.estaCompletado ?? false,
  }));
}

export const PlanesPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [patientFilter, setPatientFilter] = useState("Todos");
  const [page, setPage] = useState(1);
  const busquedaDebounced = useDebounce(search, 500);

  const { planes, total, paginas, paginaActual, cargando, refetch } =
    usePlanesTratamiento({
      pagina: page,
      pageSize: 10,
      busqueda: busquedaDebounced || undefined,
      pacienteId: patientFilter !== "Todos" ? patientFilter : undefined,
    });

  const { usuario } = useAuthStore();
  const { options: patientOptions, onSearch: onSearchPatient } =
    useBuscarPacientes();
  const { crearPlan } = useCrearPlan();
  const { eliminarPlan } = useEliminarPlan();
  const { crearPaso } = useCrearPasoPlan();
  const { actualizarPaso } = useActualizarPasoPlan();
  const { eliminarPaso } = useEliminarPasoPlan();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<PasoTarjeta | null>(null);
  const [planToExport, setPlanToExport] = useState<PlanTarjeta | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "plan" | "step";
    id: string;
  } | null>(null);

  const rawCards = useMemo<PlanTarjeta[]>(
    () =>
      planes.map((plan) => {
        const estadoFormateado =
          plan.porcentajeProgreso === 100 || plan.estado === "COMPLETED" || plan.estado === "Finalizado"
            ? "Finalizado"
            : "En curso";
        return {
          ...plan,
          patientName: plan.paciente?.fullName ?? "Paciente",
          objective: plan.objetivoPrincipal,
          progress: plan.porcentajeProgreso,
          status: estadoFormateado,
          steps: mapPasos(plan.pasos ?? []),
        };
      }),
    [planes],
  );

  const cards = useMemo(() => {
    if (statusFilter === "Todos") return rawCards;
    return rawCards.filter((c) => c.status === statusFilter);
  }, [rawCards, statusFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status);
  }, []);

  const handlePatientChange = useCallback((patientId: string) => {
    setPatientFilter(patientId);
    setPage(1);
  }, []);

  const handleCreatePlan = useCallback(
    async (data: DatosFormularioPlan) => {
      if (!usuario?.databaseId) {
        toast.error("Completa todos los campos requeridos");
        return;
      }
      try {
        await crearPlan({
          patientId: data.patientId,
          createdById: String(usuario.databaseId),
          mainObjective: data.objective,
          startDate: data.startDate,
        });
        setShowCreateModal(false);
        refetch();
      } catch {
        /* toast handled in hook */
      }
    },
    [usuario, crearPlan, refetch],
  );

  const handleAddStep = useCallback((planId: string) => {
    setSelectedPlanId(planId);
    setShowStepModal(true);
  }, []);

  const handleEditStep = useCallback((planId: string, step: PasoTarjeta) => {
    setSelectedPlanId(planId);
    setEditingStep(step);
    setShowStepModal(true);
  }, []);

  const handleCreateStep = useCallback(
    async (data: DatosFormularioPasoPlan) => {
      if (!selectedPlanId) {
        toast.error("Completa los campos requeridos");
        return;
      }
      try {
        if (editingStep) {
          await actualizarPaso({
            id: editingStep.id,
            moment: data.momento,
            objective: data.objetivoPaso,
            durationMinutes: data.duracion,
            focus: data.focoPaso || undefined,
            musicalResources: data.recursosMusicales || undefined,
            musicalEmphasis: data.enfasisMusical || undefined,
            approach: data.enfoque || undefined,
            mltMethod: data.mltEnfoque || undefined,
          });
        } else {
          await crearPaso({
            planId: selectedPlanId,
            moment: data.momento,
            objective: data.objetivoPaso,
            durationMinutes: data.duracion,
            focus: data.focoPaso || undefined,
            musicalResources: data.recursosMusicales || undefined,
            musicalEmphasis: data.enfasisMusical || undefined,
            approach: data.enfoque || undefined,
            mltMethod: data.mltEnfoque || undefined,
          });
        }
        setShowStepModal(false);
        setEditingStep(null);
        refetch();
      } catch {
        /* toast handled in hook */
      }
    },
    [selectedPlanId, editingStep, crearPaso, actualizarPaso, refetch],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === "plan") {
        await eliminarPlan(deleteConfirm.id);
      } else {
        await eliminarPaso(deleteConfirm.id);
      }
      setDeleteConfirm(null);
      refetch();
    } catch {
      /* toast handled in hook */
    }
  }, [deleteConfirm, eliminarPlan, eliminarPaso, refetch]);

  if (cargando && planes.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#008080]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InterventionPlanHeader onNewPlan={() => setShowCreateModal(true)} />

      <InterventionPlanFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        patientFilter={patientFilter}
        onPatientChange={handlePatientChange}
        patientOptions={patientOptions}
        onSearchPatient={onSearchPatient}
      />

      {cards.length === 0 ? (
        <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            {search || statusFilter !== "Todos" || patientFilter !== "Todos"
              ? "Sin resultados"
              : "Planes de Intervención"}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {search || statusFilter !== "Todos" || patientFilter !== "Todos"
              ? "No se encontraron planes que coincidan con los filtros seleccionados."
              : "Crea el primer plan de intervención para comenzar."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {cards.length} plan{cards.length !== 1 ? "es" : ""}{" "}
            {statusFilter !== "Todos" || patientFilter !== "Todos"
              ? "filtrados"
              : `de ${total} en total`}
          </p>

          <div className="space-y-6">
            {cards.map((plan, idx) => (
              <InterventionPlanCard
                key={plan.id}
                plan={plan}
                idx={idx}
                isExpanded={expandedPlanId === plan.id}
                onToggleExpand={() =>
                  setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)
                }
                onExport={() => setPlanToExport(plan)}
                onDelete={() => setDeleteConfirm({ type: "plan", id: plan.id })}
                onAddStep={() => handleAddStep(plan.id)}
                onEditStep={(step) => handleEditStep(plan.id, step)}
                onDeleteStep={(stepId) =>
                  setDeleteConfirm({ type: "step", id: String(stepId) })
                }
                onToggleStepCompletion={() => {
                  toast.info(
                    "Completar pasos está disponible desde la sesión en vivo",
                  );
                }}
              />
            ))}
          </div>

          {paginas > 1 && (
            <Pagination
              currentPage={paginaActual}
              totalPages={paginas}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <InterventionPlanForm
        key={`plan-${showCreateModal}`}
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
        onSubmit={handleCreatePlan}
        patientOptions={patientOptions}
        onSearchPatient={onSearchPatient}
      />

      <StepFormModal
        key={`paso-${showStepModal}-${editingStep?.id ?? "new"}`}
        isOpen={showStepModal}
        onClose={() => {
          setShowStepModal(false);
          setEditingStep(null);
        }}
        onSubmit={handleCreateStep}
        editingStepId={editingStep?.id ?? null}
        initialData={editingStep}
      />

      <PlanExportModal
        isOpen={!!planToExport}
        onClose={() => setPlanToExport(null)}
        plan={planToExport}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title={
          deleteConfirm?.type === "plan" ? "Eliminar Plan" : "Eliminar Paso"
        }
        message={
          deleteConfirm?.type === "plan"
            ? "¿Estás seguro de eliminar este plan de intervención? Esta acción no se puede deshacer."
            : "¿Estás seguro de eliminar este paso del plan?"
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
};
