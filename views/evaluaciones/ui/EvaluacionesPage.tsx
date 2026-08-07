"use client";

import React, { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, ClipboardList } from "lucide-react";
import { EvaluationsHeader } from "./components/EvaluationsHeader";
import { EvaluationCard } from "./components/EvaluationCard";
import { EvaluationDetailsModal } from "./components/EvaluationDetailsModal";
import { EvaluationForm } from "./components/EvaluationForm";
import { EvaluationsFilters } from "./components/EvaluationsFilters";
import { EvaluationsStats } from "./components/EvaluationsStats";
import {
  useEvaluaciones,
  useEscalas,
  useAgregarEscalaSesion,
  type Evaluacion,
  type EvaluacionExportarFila,
  type EvaluacionDetalleDTO,
  generarEvaluacionesPDF,
  generarEvaluacionesPDFPreview,
  generarEvaluacionPDF,
  generarEvaluacionesExcel,
} from "@/entities/escalas";
import { useBuscarPacientes } from "@/entities/paciente";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { Pagination } from "@/shared/ui/Pagination";
import Modal from "@/shared/ui/components/Modal";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import { EvaluacionDetallada, NuevaEvaluacion } from "./tipos";

export const EvaluacionesPage = () => {
  const [search, setSearch] = useState("");
  const [scaleFilter, setScaleFilter] = useState("");
  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebounce(search, 500);

  const { evaluaciones, total, currentPage, totalPages, cargando, refetch } =
    useEvaluaciones({
      scaleId: scaleFilter || undefined,
      page,
      pageSize: 10,
      busqueda: busquedaDebounced || undefined,
    });

  const { escalas } = useEscalas();
  const escalasValidas = escalas.filter(
    (e): e is NonNullable<typeof e> => e != null,
  );
  const { usuario } = useAuthStore();
  const {
    options: patientOptions,
    onSearch: onSearchPatient,
    buscando,
  } = useBuscarPacientes();
  const { agregarEscalaSesion, agregando } = useAgregarEscalaSesion();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedEval, setSelectedEval] = useState<EvaluacionDetallada | null>(
    null,
  );
  const [selectedEvalRaw, setSelectedEvalRaw] = useState<Evaluacion | null>(
    null,
  );

  const handleViewDetails = useCallback((ev: Evaluacion) => {
    setSelectedEvalRaw(ev);
    setSelectedEval({
      ...ev,
      patient: ev.patientName,
      originalData: {
        scale: { id: ev.scaleId },
        subscaleResponses: ev.subscaleResponses.map((r) => ({
          subscale: { id: r.subscaleId },
          score: r.score,
        })),
      },
    });
  }, []);

  const [newEval, setNewEval] = useState<NuevaEvaluacion>({
    patientId: "",
    type: "Inicial",
    date: new Date().toISOString().split("T")[0],
    score: 0,
  });
  const [selectedScaleId, setSelectedScaleId] = useState<number | null>(null);
  const [subscaleScores, setSubscaleScores] = useState<Record<string, number>>(
    {},
  );

  const handleScaleChange = useCallback((scaleId: string) => {
    const id = parseInt(scaleId, 10);
    setSelectedScaleId(isNaN(id) ? null : id);
    setSubscaleScores({});
    setNewEval((prev) => ({ ...prev, score: 0 }));
  }, []);

  const handleSubscaleScoreChange = useCallback(
    (subId: string, score: number) => {
      const updated = { ...subscaleScores, [subId]: score };
      setSubscaleScores(updated);
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      setNewEval((prev) => ({ ...prev, score: total }));
    },
    [subscaleScores],
  );

  const resetForm = useCallback(() => {
    setNewEval({
      patientId: "",
      type: "Inicial",
      date: new Date().toISOString().split("T")[0],
      score: 0,
    });
    setSelectedScaleId(null);
    setSubscaleScores({});
  }, []);

  const handleCreateSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newEval.patientId || !selectedScaleId || !usuario?.databaseId) {
        toast.error("Completa todos los campos requeridos");
        return;
      }

      const currentScale = escalasValidas.find(
        (s) => s.id === String(selectedScaleId),
      );
      const isSubscale = currentScale?.tipoEscala?.toLowerCase() === "subscale";
      const subscales = isSubscale
        ? Object.entries(subscaleScores)
            .filter((entry) => entry[1] > 0)
            .map(([subId, score]) => ({
              subscaleId: subId,
              score,
            }))
        : undefined;

      const valueId = !isSubscale
        ? currentScale?.valores?.find((v) => v.valor === newEval.score)?.id
        : undefined;

      try {
        await agregarEscalaSesion({
          patientId: newEval.patientId,
          evaluatorId: String(usuario.databaseId),
          scaleId: String(selectedScaleId),
          sessionId: null,
          subscales: subscales ?? null,
          valueId: valueId ?? null,
        });
        setShowCreateModal(false);
        resetForm();
        toast.success("Evaluación registrada correctamente");
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Error al registrar la evaluación",
        );
      }
    },
    [
      newEval,
      selectedScaleId,
      usuario,
      escalasValidas,
      subscaleScores,
      agregarEscalaSesion,
      refetch,
      resetForm,
    ],
  );

  const construirDetalleDTO = useCallback(
    (ev: Evaluacion): EvaluacionDetalleDTO => {
      const scale = escalasValidas.find((s) => s.id === ev.scaleId);
      const subescalas = ev.subscaleResponses.map((r) => {
        const sub = scale?.subescalas?.find((s) => s.id === r.subscaleId);
        return {
          nombre: r.subscaleName || sub?.nombre || "Subescala",
          puntaje: r.score,
          maximo: sub?.valorMaximo ?? null,
        };
      });
      const valor = scale?.valores?.find((v) => v.valor === ev.score);
      return {
        paciente: ev.patientName,
        escala: ev.scaleName,
        fecha: ev.date,
        tipo: ev.type,
        puntaje: ev.score,
        subescalas,
        valorSeleccionado: valor?.etiqueta ?? null,
      };
    },
    [escalasValidas],
  );

  const handleExport = useCallback(
    (ev: Evaluacion) => {
      generarEvaluacionPDF(construirDetalleDTO(ev)).then((doc) =>
        doc.save(
          `evaluacion_${ev.patientName.replace(/\s+/g, "_")}_${ev.date}.pdf`,
        ),
      );
    },
    [construirDetalleDTO],
  );

  const filasExportacion = useMemo<EvaluacionExportarFila[]>(
    () =>
      evaluaciones.map((ev) => ({
        id: ev.id,
        paciente: ev.patientName,
        escala: ev.scaleName,
        fecha: ev.date,
        tipo: ev.type,
        puntaje: ev.score,
        dimensiones: ev.subscaleResponses
          .map((r) => `${r.subscaleName}: ${r.score}`)
          .join(", "),
      })),
    [evaluaciones],
  );

  const exporters = useMemo<Exporter<EvaluacionExportarFila>[]>(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        async execute(data, _columns, fileName) {
          const doc = await generarEvaluacionesPDF(data);
          doc.save(`${fileName}_${Date.now()}.pdf`);
        },
        async preview(data) {
          return generarEvaluacionesPDFPreview(data);
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        async execute(data) {
          await generarEvaluacionesExcel(data);
        },
      },
    ],
    [],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleScaleFilterChange = useCallback((value: string) => {
    setScaleFilter(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
  }, []);

  if (cargando && evaluaciones.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#008080]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EvaluationsHeader
        onCreateClick={() => setShowCreateModal(true)}
        onExportClick={() => setShowExportModal(true)}
      />

      <EvaluationsStats evaluaciones={evaluaciones} total={total} />

      <EvaluationsFilters
        total={total}
        search={search}
        onSearchChange={handleSearchChange}
        scaleId={scaleFilter}
        onScaleChange={handleScaleFilterChange}
        scales={escalasValidas}
      />

      {evaluaciones.length === 0 ? (
        <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            {search || scaleFilter
              ? "Sin resultados"
              : "Módulo de Evaluaciones"}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {search
              ? `No se encontraron evaluaciones que coincidan con "${search}"`
              : scaleFilter
                ? "No hay evaluaciones con el filtro seleccionado"
                : "No hay evaluaciones registradas aún. Crea la primera para comenzar."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {evaluaciones.map((ev, idx) => (
              <EvaluationCard
                key={ev.id}
                evaluation={{
                  ...ev,
                  patient: ev.patientName,
                  status: "Completada",
                  score: ev.score ?? 0,
                }}
                onView={() => handleViewDetails(ev)}
                onExport={() => handleExport(ev)}
                idx={idx}
              />
            ))}
          </div>

          {totalPages > 1 && !search && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Nueva Evaluación"
        maxWidth="max-w-2xl"
      >
        <EvaluationForm
          patientOptions={patientOptions}
          onSearchPatient={onSearchPatient}
          evaluationScales={escalasValidas}
          newEval={newEval}
          setNewEval={setNewEval}
          selectedScaleId={selectedScaleId}
          handleScaleChange={handleScaleChange}
          subscaleScores={subscaleScores}
          handleSubscaleScoreChange={handleSubscaleScoreChange}
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          isLoading={agregando || buscando}
        />
      </Modal>

      <GenericExportModal<EvaluacionExportarFila>
        title="Exportar Evaluaciones"
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={filasExportacion}
        fileName="evaluaciones"
        columns={[
          { key: "paciente", label: "Paciente" },
          { key: "escala", label: "Escala" },
          { key: "fecha", label: "Fecha" },
          { key: "tipo", label: "Tipo" },
          { key: "puntaje", label: "Puntaje" },
          { key: "dimensiones", label: "Dimensiones" },
        ]}
        filters={[
          {
            key: "escala",
            label: "Escala",
            type: "select",
            options: escalasValidas.map((s) => ({
              value: s.nombre ?? "",
              label: s.nombre ?? "",
            })),
          },
          {
            key: "paciente",
            label: "Buscar por paciente",
            type: "text",
          },
        ]}
        exporters={exporters}
      />

      <EvaluationDetailsModal
        isOpen={!!selectedEval}
        onClose={() => {
          setSelectedEval(null);
          setSelectedEvalRaw(null);
        }}
        evaluation={selectedEval}
        evaluationScales={escalasValidas}
        onExport={() => {
          if (selectedEvalRaw) handleExport(selectedEvalRaw);
        }}
      />
    </div>
  );
};
