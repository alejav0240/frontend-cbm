"use client";

import React from "react";
import { motion } from "motion/react";
import { Download, Plus, List, Layers } from "lucide-react";

export type ModoVista = "lista" | "ciclos";

interface SessionsHeaderProps {
  modoVista: ModoVista;
  onCambioModo: (modo: ModoVista) => void;
  onExportar: () => void;
  onNuevaSesion: () => void;
  totalSesiones?: number;
}

export function SessionsHeader({
  modoVista,
  onCambioModo,
  onExportar,
  onNuevaSesion,
  totalSesiones = 0,
}: SessionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white serif">
            Ciclos y <span className="text-[#008080] italic">Sesiones</span>
          </h1>
          {totalSesiones > 0 && (
            <span className="px-3 py-1 bg-[#008080]/10 text-[#008080] rounded-full text-xs font-bold">
              {totalSesiones}
            </span>
          )}
        </div>
        <motion.p
          key={modoVista}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400"
        >
          {modoVista === "lista"
            ? "Registro cronológico de la intervención terapéutica."
            : "Vista agrupada por ciclos de tratamiento."}
        </motion.p>
      </motion.div>

      <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
        <div className="flex bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => onCambioModo("lista")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-r border-gray-100 dark:border-white/5 ${
              modoVista === "lista"
                ? "text-[#008080] bg-[#008080]/5"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50"
            }`}
          >
            <List size={16} />
            Lista
          </button>
          <button
            onClick={() => onCambioModo("ciclos")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all ${
              modoVista === "ciclos"
                ? "text-[#008080] bg-[#008080]/5"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50"
            }`}
          >
            <Layers size={16} />
            Ciclos
          </button>
        </div>

        <button
          onClick={onExportar}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
          title="Exportar Historial"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Exportar</span>
        </button>

        <button
          onClick={onNuevaSesion}
          className="flex items-center gap-2 px-5 md:px-6 py-3 bg-[#008080] text-white rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20 hover:scale-105"
        >
          <Plus size={18} />
          <span className="whitespace-nowrap">Nueva Sesión</span>
        </button>
      </div>
    </div>
  );
}
