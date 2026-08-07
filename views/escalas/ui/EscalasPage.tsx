"use client";
import { useState } from "react";
import { ScalesHeader } from "@/views/escalas/ui/components/ScalesHeader";
import { ScalesList } from "@/views/escalas/ui/components/ScalesList";
import {
  useEscalas,
  useCrearEscala,
  useEliminarEscala,
} from "@/entities/escalas";
import { FormularioCrearEscala } from "@/features/gestion-escalas";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { SearchInput } from "@/shared/ui/components/SearchInput";
import { FilterBar } from "@/shared/ui/components/FilterBar";
import { Pagination } from "@/shared/ui/Pagination";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { useUrlFiltros } from "@/shared/lib/hooks/useUrlFiltros";
import type { EscalaFormData } from "@/features/gestion-escalas";

const TIPO_OPCIONES = [
  { label: "Todos los tipos", value: "all" },
  { label: "Por subescalas", value: "subscale", color: "bg-blue-500" },
  { label: "Por lista de valores", value: "value_list", color: "bg-purple-500" },
];

export default function EscalasPage() {
  const { filtros, setFiltros } = useUrlFiltros(["page", "q", "tipo"] as const);
  const paginaActual = Number(filtros.page || "1");
  const filtroTipo = filtros.tipo || "all";
  const [terminoBusqueda, setTerminoBusqueda] = useState(filtros.q);
  const busquedaDebounced = useDebounce(terminoBusqueda, 400);

  if (terminoBusqueda !== filtros.q) {
    setTerminoBusqueda(filtros.q);
  }

  const { escalas, paginas, cargando, refetch } = useEscalas({
    page: paginaActual,
    pageSize: 12,
    busqueda: busquedaDebounced || undefined,
    tipo: filtroTipo === "all" ? undefined : filtroTipo,
  });
  const { crearEscala, creando } = useCrearEscala();
  const { eliminarEscala, eliminando } = useEliminarEscala();

  const [showModal, setShowModal] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const handleCrearEscala = async (data: EscalaFormData) => {
    const scaleType = data.type === "subscales" ? "subscale" : "value_list";
    await crearEscala({
      name: data.name,
      scaleType,
      description: data.description || null,
      subscales: data.subscales.map((s) => ({
        name: s.name,
        maxValue: s.maxScore,
        description: s.description || null,
      })),
      values: data.values.map((v) => ({
        label: v.label,
        value: v.value,
      })),
    });
    setShowModal(false);
    refetch();
  };

  const handleEliminarEscala = async () => {
    if (!eliminandoId) return;
    await eliminarEscala(eliminandoId);
    setEliminandoId(null);
    refetch();
  };

  return (
    <div className="space-y-8">
      <ScalesHeader onAddScale={() => setShowModal(true)} />

      <SearchInput
        id="search-escalas"
        value={terminoBusqueda}
        onChange={(v) => {
          setTerminoBusqueda(v);
          setFiltros({ q: v, page: "1" });
        }}
        placeholder="Buscar escala por nombre..."
        variant="compact"
      />

      <FilterBar
        filtros={[
          {
            clave: "tipo",
            etiqueta: "Tipo",
            opciones: TIPO_OPCIONES,
            valor: filtroTipo,
            alCambiar: (v) => setFiltros({ tipo: v, page: "1" }),
          },
        ]}
        onLimpiar={() => setFiltros({ tipo: "", page: "1" })}
      />

      {cargando ? (
        <div className="text-center py-20">
          <p className="text-gray-400">Cargando escalas...</p>
        </div>
      ) : (
        <>
          <ScalesList
            scales={escalas}
            onDelete={(id) => setEliminandoId(String(id))}
          />
          <Pagination
            currentPage={paginaActual}
            totalPages={paginas}
            onPageChange={(p) => setFiltros({ page: String(p) })}
          />
        </>
      )}

      <FormularioCrearEscala
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCrearEscala}
        creando={creando}
      />

      <ConfirmModal
        isOpen={!!eliminandoId}
        onClose={() => setEliminandoId(null)}
        onConfirm={handleEliminarEscala}
        title="Eliminar Escala"
        message="¿Estás seguro de que deseas eliminar esta escala? Esta acción no se puede deshacer."
        confirmLabel={eliminando ? "Eliminando..." : "Eliminar"}
        variant="danger"
      />
    </div>
  );
}
