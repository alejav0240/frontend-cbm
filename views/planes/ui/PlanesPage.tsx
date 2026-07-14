"use client";

import React, { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Search, Loader2, ClipboardList, AlertCircle } from "lucide-react";
import { InterventionPlanHeader } from "./components/InterventionPlanHeader";
import { InterventionPlanCard } from "./components/InterventionPlanCard";
import { InterventionPlanForm } from "./components/InterventionPlanForm";
import { StepFormModal } from "./components/StepFormModal";
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
import { Pagination } from "@/shared/ui/Pagination";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import type { PasoPlan, PlanTratamiento } from "@/entities/plan-tratamiento";

function mapPasos(pasos: PasoPlan[]) {
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
  const [page, setPage] = useState(1);

  const { planes, total, paginas, paginaActual, cargando, refetch } =
    usePlanesTratamiento({
      pagina: page,
      pageSize: 10,
      busqueda: search || undefined,
    });

  const { usuario } = useAuthStore();
  const { options: patientOptions, onSearch: onSearchPatient } =
    useBuscarPacientes();
  const { crearPlan, creando } = useCrearPlan();
  const { eliminarPlan, eliminando } = useEliminarPlan();
  const { crearPaso, creando: creandoPaso } = useCrearPasoPlan();
  const { actualizarPaso, actualizando: actualizandoPaso } =
    useActualizarPasoPlan();
  const { eliminarPaso, eliminando: eliminandoPaso } = useEliminarPasoPlan();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "plan" | "step";
    id: string;
  } | null>(null);

  const [patientId, setPatientId] = useState("");
  const [objective, setObjective] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [momento, setMomento] = useState("");
  const [duracion, setDuracion] = useState("45");
  const [objetivoPaso, setObjetivoPaso] = useState("");
  const [focoPaso, setFocoPaso] = useState("");
  const [recursosMusicales, setRecursosMusicales] = useState("");
  const [enfasisMusical, setEnfasisMusical] = useState("");
  const [enfoque, setEnfoque] = useState("");
  const [mltEnfoque, setMltEnfoque] = useState("");

  const cards = useMemo(
    () =>
      planes.map((plan) => ({
        ...plan,
        patientName: plan.paciente.fullName,
        objective: plan.objetivoPrincipal,
        progress: plan.porcentajeProgreso,
        status:
          plan.estado === "ACTIVE"
            ? "Activo"
            : plan.estado === "COMPLETED"
              ? "Finalizado"
              : (plan.estado ?? "Activo"),
        steps: mapPasos(plan.pasos ?? []),
      })),
    [planes],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleCreatePlan = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!patientId || !objective || !usuario?.databaseId) {
        toast.error("Completa todos los campos requeridos");
        return;
      }
      try {
        await crearPlan({
          patientId,
          createdById: String(usuario.databaseId),
          mainObjective: objective,
          startDate,
        });
        setShowCreateModal(false);
        resetForm();
        refetch();
      } catch {
        /* toast handled in hook */
      }
    },
    [patientId, objective, startDate, usuario, crearPlan, refetch],
  );

  const resetForm = useCallback(() => {
    setPatientId("");
    setObjective("");
    setStartDate(new Date().toISOString().split("T")[0]);
  }, []);

  const resetStepForm = useCallback(() => {
    setMomento("");
    setDuracion("45");
    setObjetivoPaso("");
    setFocoPaso("");
    setRecursosMusicales("");
    setEnfasisMusical("");
    setEnfoque("");
    setMltEnfoque("");
    setEditingStep(null);
  }, []);

  const handleAddStep = useCallback(
    (planId: string) => {
      setSelectedPlanId(planId);
      resetStepForm();
      setShowStepModal(true);
    },
    [resetStepForm],
  );

  const handleEditStep = useCallback((planId: string, step: any) => {
    setSelectedPlanId(planId);
    setEditingStep(step);
    setMomento(step.momento ?? "");
    setDuracion(String(step.duracion ?? 45));
    setObjetivoPaso(step.objetivo ?? "");
    setFocoPaso(step.foco ?? "");
    setRecursosMusicales(step.recursosMusicales ?? "");
    setEnfasisMusical(step.enfasisMusical ?? "");
    setEnfoque(step.enfoque ?? "");
    setMltEnfoque(step.mltEnfoque ?? "");
    setShowStepModal(true);
  }, []);

  const handleCreateStep = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPlanId || !momento || !objetivoPaso) {
        toast.error("Completa los campos requeridos");
        return;
      }
      try {
        if (editingStep) {
          await actualizarPaso({
            id: editingStep.id,
            moment: momento,
            objective: objetivoPaso,
            durationMinutes: Number(duracion),
            focus: focoPaso || undefined,
            musicalResources: recursosMusicales || undefined,
            musicalEmphasis: enfasisMusical || undefined,
            approach: enfoque || undefined,
            mltMethod: mltEnfoque || undefined,
          });
        } else {
          await crearPaso({
            planId: selectedPlanId,
            moment: momento,
            objective: objetivoPaso,
            durationMinutes: Number(duracion),
            focus: focoPaso || undefined,
            musicalResources: recursosMusicales || undefined,
            musicalEmphasis: enfasisMusical || undefined,
            approach: enfoque || undefined,
            mltMethod: mltEnfoque || undefined,
          });
        }
        setShowStepModal(false);
        resetStepForm();
        refetch();
      } catch {
        /* toast handled in hook */
      }
    },
    [
      selectedPlanId,
      momento,
      objetivoPaso,
      duracion,
      focoPaso,
      recursosMusicales,
      enfasisMusical,
      enfoque,
      mltEnfoque,
      editingStep,
      crearPaso,
      actualizarPaso,
      resetStepForm,
      refetch,
    ],
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

      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por objetivo o paciente..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
        />
      </div>

      {cards.length === 0 ? (
        <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            {search ? "Sin resultados" : "Planes de Intervención"}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {search
              ? `No se encontraron planes que coincidan con "${search}"`
              : "Crea el primer plan de intervención para comenzar."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} plan{total !== 1 ? "es" : ""} en total
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
                onExport={() => toast.success("Exportación iniciada")}
                onDelete={() => setDeleteConfirm({ type: "plan", id: plan.id })}
                onAddStep={() => handleAddStep(plan.id)}
                onEditStep={(step) => handleEditStep(plan.id, step)}
                onDeleteStep={(stepId) =>
                  setDeleteConfirm({ type: "step", id: String(stepId) })
                }
                onToggleStepCompletion={(stepId) => {
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
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreatePlan}
        patientId={patientId}
        setPatientId={setPatientId}
        objective={objective}
        setObjective={setObjective}
        startDate={startDate}
        setStartDate={setStartDate}
        patientOptions={patientOptions}
        onSearchPatient={onSearchPatient}
      />

      <StepFormModal
        isOpen={showStepModal}
        onClose={() => {
          setShowStepModal(false);
          resetStepForm();
        }}
        onSubmit={handleCreateStep}
        editingStepId={editingStep?.id ?? null}
        momento={momento}
        setMomento={setMomento}
        duracion={duracion}
        setDuracion={setDuracion}
        objetivoPaso={objetivoPaso}
        setObjetivoPaso={setObjetivoPaso}
        focoPaso={focoPaso}
        setFocoPaso={setFocoPaso}
        recursosMusicales={recursosMusicales}
        setRecursosMusicales={setRecursosMusicales}
        enfasisMusical={enfasisMusical}
        setEnfasisMusical={setEnfasisMusical}
        enfoque={enfoque}
        setEnfoque={setEnfoque}
        mltEnfoque={mltEnfoque}
        setMltEnfoque={setMltEnfoque}
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
