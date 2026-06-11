"use client";

import React from "react";
import { useInstituciones } from "@/entities/institucion";
import { TablaInstituciones } from "@/widgets/lista-instituciones";
import { Plus, Search } from "lucide-react";

export const InstitucionesPage = () => {
  const { instituciones, cargando } = useInstituciones();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Instituciones y Convenios</h1>
          <p className="text-gray-400 text-sm">Gestiona los centros y organizaciones con los que colaboras</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg">
          <Plus size={18} />
          Nueva Institución
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors" size={18} />
        <input
          type="text"
          placeholder="Buscar instituciones..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-[#008080] outline-none transition-all text-sm shadow-sm"
        />
      </div>

      <TablaInstituciones instituciones={instituciones} alSeleccionar={() => {}} />
    </div>
  );
};
