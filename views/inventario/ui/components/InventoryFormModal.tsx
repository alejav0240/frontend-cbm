"use client";

import React, { useState } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { ArticuloInventario } from "@/entities/inventario";

const TIPOS = [
  { value: "INSTRUMENT", label: "Instrumento" },
  { value: "EQUIPMENT", label: "Equipo" },
  { value: "MATERIAL", label: "Material" },
] as const;

const CONDICIONES = [
  { value: "GOOD", label: "Bueno" },
  { value: "FAIR", label: "Regular" },
  { value: "DAMAGED", label: "Dañado" },
] as const;

const ESTADOS = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "IN_USE", label: "En uso" },
  { value: "MAINTENANCE", label: "Mantenimiento" },
] as const;

export interface FormData {
  name: string;
  type: string;
  condition: string;
  room: string;
  status: string;
}

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  initialData?: ArticuloInventario | null;
}

export function InventoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: InventoryFormModalProps) {
  const [formData, setFormData] = useState<FormData>(() => ({
    name: initialData?.nombre ?? "",
    type: initialData?.tipo ?? "INSTRUMENT",
    condition: initialData?.condicion ?? "GOOD",
    room: initialData?.aula ?? "",
    status: initialData?.estado ?? "AVAILABLE",
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Artículo" : "Añadir Artículo al Inventario"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Instrumento / Material
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Piano Yamaha, Set de Maracas..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Condición
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {CONDICIONES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {ESTADOS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Aula / Sala
            </label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              placeholder="Ej: Sala 1, Aula 3..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20"
          >
            Guardar Artículo
          </button>
        </div>
      </div>
    </Modal>
  );
}
