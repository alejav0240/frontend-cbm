"use client";

import React from "react";
import { useRoles } from "@/entities/rol";
import { TablaRoles } from "@/widgets/lista-roles";
import { Plus, ShieldAlert } from "lucide-react";

export const RolesPage = () => {
  const { roles, cargando } = useRoles();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Roles y Permisos</h1>
          <p className="text-gray-400 text-sm">Define las capacidades y restricciones de acceso para el personal</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg">
          <Plus size={18} />
          Nuevo Rol
        </button>
      </div>

      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-[24px] flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500">Configuración de Seguridad</h4>
          <p className="text-xs text-amber-600/80 dark:text-amber-500/70">Los cambios en los permisos de un rol afectarán a todos los usuarios asignados de forma inmediata.</p>
        </div>
      </div>

      <TablaRoles roles={roles} />
    </div>
  );
};
