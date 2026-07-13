"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, ChevronDown, ChevronUp, ListChecks } from "lucide-react";

interface ScaleCardProps {
  scale: any;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: (id: number) => void;
}

export function ScaleCard({
  scale,
  index,
  isExpanded,
  onToggleExpand,
  onDelete,
}: ScaleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <ListChecks size={22} className="text-[#008080]" />
            <h3 className="text-xl font-bold dark:text-white group-hover:text-[#008080] transition-colors">
              {scale.nombre}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {scale.descripcion}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-[10px] font-bold text-[#008080] bg-[#008080]/10 px-3 py-1 rounded-full uppercase tracking-widest">
              {scale.tipoEscala.toLowerCase() === "subscale"
                ? `${scale.subescalas?.length || 0} Subescalas`
                : `${scale.valores?.length || 0} Valores`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          <button
            onClick={() => onDelete(scale.id)}
            className="p-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-2xl"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-sm font-bold text-[#008080] hover:underline uppercase tracking-widest"
          >
            {isExpanded
              ? scale.tipoEscala.toLowerCase() === "subscale"
                ? "Ocultar Subescalas"
                : "Ocultar Valores"
              : scale.tipoEscala.toLowerCase() === "subscale"
                ? "Ver Subescalas"
                : "Ver Valores"}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5"
          >
            {scale.tipoEscala.toLowerCase() === "subscale" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {scale.subescalas?.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold dark:text-white">
                        {sub.nombre}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Máx: {sub.valorMaximo}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {scale.valores?.map((val: any) => (
                  <div
                    key={val.id}
                    className="px-6 py-3 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-[#008080] text-white rounded-full text-xs font-bold">
                      {val.valor}
                    </span>
                    <span className="text-sm font-bold dark:text-white">
                      {val.etiqueta}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
