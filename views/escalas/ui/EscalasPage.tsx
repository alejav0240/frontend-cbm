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
import type { EscalaFormData } from "@/features/gestion-escalas";

export default function EscalasPage() {
  const { escalas, cargando, refetch } = useEscalas();
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

      {cargando ? (
        <div className="text-center py-20">
          <p className="text-gray-400">Cargando escalas...</p>
        </div>
      ) : (
        <ScalesList
          scales={escalas}
          onDelete={(id) => setEliminandoId(String(id))}
        />
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
