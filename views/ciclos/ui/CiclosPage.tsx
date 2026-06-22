"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { CiclosHeader } from "@/views/ciclos/ui/components/CiclosHeader";
import { CycleCard } from "@/views/ciclos/ui/components/CicloCard";
import { CrearCicloModal } from "@/views/ciclos/ui/components/CrearCicloModal";
import { toast } from "sonner";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { useCiclosPacientes } from "@/entities/sesion";
import { useUsuarios } from "@/entities/usuario";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { Pagination } from "@/shared/ui/Pagination";

export const CiclosPage = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [therapistFilter, setTherapistFilter] = useState("");

  const busquedaDebounced = useDebounce(terminoBusqueda, 500);
  const { ciclos, totalPages, cargando, error, refetch } = useCiclosPacientes({
    pageSize: 10,
    page: paginaActual,
    search: busquedaDebounced || undefined,
    therapistId: therapistFilter || undefined,
  });

  const [expandedCycleId, setExpandedCycleId] = useState<string | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setExpandedCycleId(null);
  }, [paginaActual, busquedaDebounced, therapistFilter]);

  const { usuarios: terapeutas } = useUsuarios({
    pagina: 1,
    pageSize: 50,
    nombreRol: "TERAPEUTA",
  });

  const therapistOptions = useMemo(
    () => [
      { value: "", label: "Todos los terapeutas" },
      ...terapeutas.map((t) => ({
        value: t.id,
        label: t.fullName,
      })),
    ],
    [terapeutas],
  );

  const handleWhatsApp = (phone: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    } else {
      toast.error("No hay teléfono registrado para este paciente");
    }
  };

  const handleDeleteCycle = () => {
    toast.info("Funcionalidad en desarrollo");
    setShowDeleteConfirm(false);
    setCycleToDelete(null);
  };

  return (
    <div className="space-y-8">
      <CiclosHeader onCreateClick={() => setShowForm(true)} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => {
              setTerminoBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar paciente..."
            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
          {cargando && (
            <Loader2
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#008080] animate-spin"
              size={18}
            />
          )}
        </div>
        <div className="w-full sm:w-72">
          <SearchableSelect
            options={therapistOptions}
            value={therapistFilter}
            onChange={(val) => {
              setTherapistFilter(val);
              setPaginaActual(1);
            }}
            placeholder="Todos los terapeutas"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-200 dark:border-red-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm text-red-700 dark:text-red-400">
              Error al cargar los ciclos. Intenta de nuevo.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-all"
          >
            <RotateCcw size={16} />
            Reintentar
          </button>
        </div>
      )}

      <div className="relative min-h-[400px]">
        {cargando && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[40px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#008080] animate-spin" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Cargando Ciclos...
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {ciclos.length > 0
            ? ciclos.map((cycle, idx) => (
                <CycleCard
                  key={cycle.id}
                  cycle={cycle}
                  isExpanded={expandedCycleId === cycle.id}
                  onToggleExpand={() =>
                    setExpandedCycleId(
                      expandedCycleId === cycle.id ? null : cycle.id,
                    )
                  }
                  onDelete={() => {
                    setCycleToDelete(cycle.id);
                    setShowDeleteConfirm(true);
                  }}
                  onWhatsApp={() => handleWhatsApp(cycle.patientPhone)}
                  idx={idx}
                />
              ))
            : !cargando &&
              !error && (
                <div className="bg-white dark:bg-[#111] p-12 rounded-[40px] border border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                    <RefreshCw size={32} />
                  </div>
                  <h3 className="text-lg font-bold dark:text-white mb-2">
                    {terminoBusqueda || therapistFilter
                      ? "Sin resultados"
                      : "No hay ciclos registrados"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                    {terminoBusqueda || therapistFilter
                      ? "Intenta con otros términos de búsqueda o filtros."
                      : "Registra nuevas sesiones para que los ciclos se generen automáticamente."}
                  </p>
                </div>
              )}
        </div>
      </div>

      <Pagination
        currentPage={paginaActual}
        totalPages={totalPages}
        onPageChange={setPaginaActual}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCycle}
        title="Eliminar Ciclo"
        message="¿Estás seguro de que deseas eliminar este ciclo? Se eliminarán también todas las sesiones programadas asociadas."
        confirmLabel="Eliminar Ciclo"
      />

      <CrearCicloModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onCicloCreado={() => refetch()}
      />
    </div>
  );
};
