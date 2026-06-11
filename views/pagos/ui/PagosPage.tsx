"use client";

import React, { useState } from "react";
import { usePagos } from "@/entities/pago";
import { TablaPagos } from "@/widgets/tabla-pagos";
import { Plus, Download, Filter } from "lucide-react";

export const PagosPage = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const { pagos, total, cargando } = usePagos({
    pagina: paginaActual,
    pageSize: 10,
    estadoPago: filtroEstado,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Gestión de Pagos</h1>
          <p className="text-gray-400 text-sm">Administra los ingresos y saldos pendientes de tus pacientes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20">
            <Plus size={18} />
            Registrar Pago
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {["Todos", "PAID", "PARTIAL", "PENDING"].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              filtroEstado === estado
                ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
                : "bg-white dark:bg-accent text-gray-400 hover:text-[#008080]"
            }`}
          >
            {estado === "Todos" ? "Todos" : estado === "PAID" ? "Pagados" : estado === "PARTIAL" ? "Parciales" : "Pendientes"}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaPagos pagos={pagos} />
      </div>
    </div>
  );
};
