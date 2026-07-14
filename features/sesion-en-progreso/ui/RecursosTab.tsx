"use client";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Music, CheckCircle2, Search } from "lucide-react";

interface ResourcesTabProps {
  resources: any[];
  selectedResources: string[];
  toggleResource: (id: string) => void;
}

export function ResourcesTab({
  resources,
  selectedResources,
  toggleResource,
}: ResourcesTabProps) {
  const [busqueda, setBusqueda] = useState("");

  const filteredResources = useMemo(() => {
    if (!busqueda.trim()) return resources;
    const q = busqueda.toLowerCase();
    return resources.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q),
    );
  }, [resources, busqueda]);

  if (!resources.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="h-full flex flex-col items-center justify-center text-center p-12 md:p-20 bg-gray-50 dark:bg-white/2 rounded-[40px] border border-dashed border-gray-200 dark:border-white/10"
      >
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-6">
          <Music size={40} />
        </div>
        <h3 className="text-xl font-bold dark:text-white mb-2">Sin Recursos</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          No hay recursos digitales ni artículos de inventario disponibles para
          esta sesión.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Search */}
      <div className="relative">
        <label htmlFor="search-recursos-sesion" className="sr-only">Buscar recursos</label>
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          id="search-recursos-sesion"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar recurso por nombre, tipo o categoría..."
          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent focus-visible:border-[#008080]/30 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {filteredResources.map((resource) => {
          const isSelected = (selectedResources || []).includes(resource.id);
          return (
            <button
              key={resource.id}
              type="button"
              onClick={() => toggleResource(resource.id)}
              aria-pressed={isSelected}
              className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-2 transition-all cursor-pointer flex items-center gap-3 md:gap-4 text-left ${
                isSelected
                  ? "border-[#008080] bg-[#008080]/5"
                  : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 hover:border-gray-200 dark:hover:border-white/10"
              }`}
            >
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center ${
                isSelected ? "bg-[#008080] text-white" : "bg-white dark:bg-[#111] text-gray-400"
              }`}
            >
              <Music size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs md:text-sm dark:text-white truncate">
                {resource.title}
              </h4>
              <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                {resource.type} • {resource.category}
              </p>
            </div>
            {isSelected && (
              <CheckCircle2
                size={18}
                className="text-[#008080] md:w-5 md:h-5 flex-shrink-0"
              />
            )}
          </button>
        );
        })}
      </div>

      {filteredResources.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          Ningún recurso coincide con &quot;{busqueda}&quot;
        </p>
      )}
    </motion.div>
  );
}
