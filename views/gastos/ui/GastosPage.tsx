"use client";

import React, { useState } from "react";
import { useGastos } from "@/entities/gasto";
import { TablaGastos } from "@/widgets/lista-gastos";
import { Plus, Download, TrendingDown } from "lucide-react";

export const GastosPage = () => {
  const { gastos, cargando } = useGastos();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Control de Gastos</h1>
          <p className="text-gray-400 text-sm">Registra y supervisa los egresos operativos del centro</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
            <Plus size={18} />
            Registrar Gasto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-red-600/60 uppercase tracking-widest">Gasto Mensual</p>
            <h3 className="text-2xl font-bold text-red-600">Bs. 4,250.00</h3>
          </div>
        </div>
        {/* Podríamos añadir más métricas aquí */}
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaGastos gastos={gastos} />
      </div>
    </div>
  );
};
