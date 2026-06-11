"use client";

import React from "react";
import { motion } from "motion/react";
import { Box, MapPin, Tag, AlertTriangle, MoreVertical } from "lucide-react";
import { ArticuloInventario } from "@/entities/inventario";

interface TablaInventarioProps {
  articulos: ArticuloInventario[];
}

export const TablaInventario = ({ articulos }: TablaInventarioProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Artículo</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tipo / Categoría</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Ubicación</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {articulos.map((item, idx) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Box size={18} />
                  </div>
                  <span className="text-sm font-bold dark:text-white">{item.nombre}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tag size={12} />
                  <span>{item.tipo}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} />
                  <span>{item.aula}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  item.estado === "AVAILABLE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                  {item.estadoMostrado}
                </span>
              </td>
              <td className="px-8 py-5">
                <button className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] transition-all">
                  <MoreVertical size={18} />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
