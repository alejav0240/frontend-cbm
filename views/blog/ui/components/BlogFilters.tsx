"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, ArrowUpDown, X } from "lucide-react";

export interface BlogFiltros {
  busqueda: string;
  categoria: string;
  estado: string;
}

type Orden = "recientes" | "antiguos" | "a-z" | "z-a";

interface BlogFiltersProps {
  filtros: BlogFiltros;
  orden: Orden;
  onFiltrosChange: (filtros: BlogFiltros) => void;
  onOrdenChange: (orden: Orden) => void;
  totalResultado: number;
}

const CATEGORIAS = [
  "Investigación",
  "Historias",
  "Técnicas",
  "Noticias",
  "Musicoterapia",
  "Eventos",
];

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "PUBLISHED", label: "Publicados" },
  { value: "DRAFT", label: "Borradores" },
];

const ORDENES: { value: Orden; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
];

export function BlogFilters({
  filtros,
  orden,
  onFiltrosChange,
  onOrdenChange,
  totalResultado,
}: BlogFiltersProps) {
  const hayFiltrosActivos =
    filtros.busqueda || filtros.categoria || filtros.estado;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 p-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={filtros.busqueda}
            onChange={(e) =>
              onFiltrosChange({ ...filtros, busqueda: e.target.value })
            }
            placeholder="Buscar por título..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-transparent focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/20 outline-none transition-all text-sm dark:text-white"
          />
        </div>

        <select
          value={filtros.categoria}
          onChange={(e) =>
            onFiltrosChange({ ...filtros, categoria: e.target.value })
          }
          className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-transparent focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filtros.estado}
          onChange={(e) =>
            onFiltrosChange({ ...filtros, estado: e.target.value })
          }
          className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-transparent focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
        >
          {ESTADOS.map((est) => (
            <option key={est.value} value={est.value}>
              {est.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <ArrowUpDown
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={orden}
            onChange={(e) => onOrdenChange(e.target.value as Orden)}
            className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-transparent focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white min-w-[150px]"
          >
            {ORDENES.map((ord) => (
              <option key={ord.value} value={ord.value}>
                {ord.label}
              </option>
            ))}
          </select>
        </div>

        {hayFiltrosActivos && (
          <button
            onClick={() =>
              onFiltrosChange({ busqueda: "", categoria: "", estado: "" })
            }
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      {hayFiltrosActivos && (
        <p className="text-xs text-gray-400 mt-3 px-1">
          {totalResultado} {totalResultado === 1 ? "resultado" : "resultados"}{" "}
          encontrado{totalResultado !== 1 ? "s" : ""}
        </p>
      )}
    </motion.div>
  );
}
