"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, Filter, Music, Guitar, Edit2, Trash2 } from "lucide-react";
import { ArticuloInventario } from "@/entities/inventario";

interface InventoryTableProps {
  inventory: ArticuloInventario[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (item: ArticuloInventario) => void;
  onDelete: (id: string) => void;
}

const CONDICION_MAP: Record<string, { label: string; color: string }> = {
  GOOD: { label: "Bueno", color: "text-blue-500 bg-blue-500/10" },
  FAIR: { label: "Regular", color: "text-amber-500 bg-amber-500/10" },
  DAMAGED: { label: "Dañado", color: "text-red-500 bg-red-500/10" },
};

const ESTADO_MAP: Record<string, string> = {
  AVAILABLE: "text-green-500",
  IN_USE: "text-blue-500",
  MAINTENANCE: "text-red-500",
};

export function InventoryTable({
  inventory,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const getCondicionColor = (condicion: string) =>
    CONDICION_MAP[condicion]?.color ?? "text-gray-500 bg-gray-500/10";

  const getEstadoColor = (estado: string) =>
    ESTADO_MAP[estado] ?? "text-gray-500";

  const tipoIcon = (tipo: string) => {
    switch (tipo) {
      case "INSTRUMENT":
      case "EQUIPMENT":
        return <Music size={16} />;
      default:
        return <Guitar size={16} />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="search-inventario" className="sr-only">Buscar inventario</label>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            id="search-inventario"
            type="text"
            placeholder="Buscar instrumentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Nombre
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Tipo
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Condición
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Aula
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Estado
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {inventory.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                      {tipoIcon(item.tipo)}
                    </div>
                    <p className="text-sm font-bold dark:text-white">
                      {item.nombre}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-500">{item.tipo}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${getCondicionColor(item.condicion)}`}
                  >
                    {CONDICION_MAP[item.condicion]?.label ?? item.condicion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                    {item.aula || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-current ${getEstadoColor(item.estado)}`}
                    />
                    <span className="text-sm font-medium dark:text-white">
                      {item.estadoMostrado || item.estado}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
