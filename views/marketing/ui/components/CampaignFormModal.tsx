"use client";

import React, { useState } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { MarketingCampaign } from "@/entities/marketing";

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<MarketingCampaign>) => void;
  initialData?: Partial<MarketingCampaign> | null;
}

const DEFAULT_FORM: Partial<MarketingCampaign> = {
  name: "",
  platform: "Facebook",
  budget: 0,
  spent: 0,
  status: "Activo",
  startDate: new Date().toISOString().split("T")[0],
};

export function CampaignFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CampaignFormModalProps) {
  const [formData, setFormData] = useState<Partial<MarketingCampaign>>(
    initialData || DEFAULT_FORM,
  );

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Editar Campaña" : "Crear Nueva Campaña"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre de la Campaña
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Promo Verano 2026"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Plataforma
            </label>
            <SearchableSelect
              value={formData.platform || ""}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  platform: val as MarketingCampaign["platform"],
                })
              }
              options={[
                { label: "Facebook", value: "Facebook", color: "bg-blue-600" },
                {
                  label: "Instagram",
                  value: "Instagram",
                  color: "bg-pink-600",
                },
                { label: "WhatsApp", value: "WhatsApp", color: "bg-green-600" },
                { label: "TikTok", value: "TikTok", color: "bg-black" },
                { label: "Google", value: "Google", color: "bg-red-500" },
                { label: "Otro", value: "Otro", color: "bg-gray-400" },
              ]}
              clearable={false}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Estado
            </label>
            <SearchableSelect
              value={formData.status || ""}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  status: val as MarketingCampaign["status"],
                })
              }
              options={[
                { label: "Activo", value: "Activo", color: "bg-green-500" },
                { label: "Pausado", value: "Pausado", color: "bg-blue-500" },
                {
                  label: "Finalizado",
                  value: "Finalizado",
                  color: "bg-gray-500",
                },
              ]}
              clearable={false}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Presupuesto (Bs.)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Invertido (Bs.)
            </label>
            <input
              type="number"
              value={formData.spent}
              onChange={(e) =>
                setFormData({ ...formData, spent: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            {initialData?.id ? "Guardar Cambios" : "Crear Campaña"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
