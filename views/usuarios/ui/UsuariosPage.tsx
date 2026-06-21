"use client";

import React, { useState } from "react";
import { useUsuarios } from "@/entities/usuario";
import { TablaUsuarios } from "@/widgets/lista-usuarios";
import { Plus, Search, Filter } from "lucide-react";

export const UsuariosPage = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const { usuarios, total, cargando } = useUsuarios({
    pagina: paginaActual,
    pageSize: 10,
    busqueda,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-400 text-sm">
            Administra el personal y sus accesos al sistema
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg">
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-[#008080] outline-none transition-all text-sm shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaUsuarios usuarios={usuarios} />
      </div>
    </div>
  );
};
