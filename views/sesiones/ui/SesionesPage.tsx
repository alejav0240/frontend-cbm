"use client";

import React from "react";
import { useSesiones } from "@/entities/sesion";
import { TablaSesiones } from "@/widgets/lista-sesiones";
import { Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export const SesionesPage = () => {
  const router = useRouter();
  const { sesiones, cargando } = useSesiones();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Sesiones Terapéuticas</h1>
          <p className="text-gray-400 text-sm">Historial y seguimiento de sesiones individuales y grupales</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg">
            <Plus size={18} />
            Nueva Sesión
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaSesiones
          sesiones={sesiones}
          alVerDetalles={() => {}}
        />
      </div>
    </div>
  );
};
