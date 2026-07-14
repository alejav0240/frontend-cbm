"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRoles } from "@/entities/rol";
import { TablaRoles } from "@/widgets/lista-roles";
import { EstadisticasRoles } from "@/widgets/estadisticas-roles";
import { ModalesRol } from "@/features/gestion-roles";
import { RolesHeader } from "./components/RolesHeader";
import { SkeletonRoles } from "./components/SkeletonRoles";
import { useRolesStore } from "@/shared/model/useRolesStore";
import { Pagination } from "@/shared/ui/Pagination";
import { ShieldAlert, Shield, Trash2, X } from "lucide-react";

export const RolesPage = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const { roles, paginas, cargando } = useRoles({
    page: paginaActual,
    pageSize: 10,
  });
  const { rolesSeleccionadas, acciones } = useRolesStore();

  if (cargando) {
    return <SkeletonRoles />;
  }

  const haySeleccion = rolesSeleccionadas.length > 0;

  return (
    <div className="space-y-8">
      <RolesHeader onAddRole={() => acciones.abrirFormulario()} />

      <EstadisticasRoles roles={roles} />

      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-[24px] flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500">
            Configuración de Seguridad
          </h4>
          <p className="text-xs text-amber-600/80 dark:text-amber-500/70">
            Los cambios en los permisos de un rol afectarán a todos los usuarios
            asignados de forma inmediata.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold dark:text-white mb-4">
          Roles Existentes
        </h2>
        <TablaRoles
          roles={roles}
          rolesSeleccionadas={rolesSeleccionadas}
          onAlternarSeleccion={(rol) => acciones.alternarSeleccion(rol)}
          onEditar={(rol) => acciones.abrirFormulario(rol)}
          onEliminar={(rol) => {
            acciones.seleccionarTodas([rol]);
            acciones.abrirEliminar();
          }}
        />

        <Pagination
          currentPage={paginaActual}
          totalPages={paginas}
          onPageChange={setPaginaActual}
        />
      </div>

      <AnimatePresence>
        {haySeleccion && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
              <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">
                    {rolesSeleccionadas.length}{" "}
                    {rolesSeleccionadas.length === 1 ? "rol" : "roles"}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Seleccionados
                  </p>
                </div>
              </div>

              <button
                onClick={() => acciones.abrirPermisos()}
                className="bg-[#008080] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#006666] transition-all flex items-center gap-2"
              >
                <Shield size={16} />
                Permisos
              </button>

              <button
                onClick={() => {
                  acciones.abrirEliminar();
                }}
                className="bg-red-50 dark:bg-red-500/10 text-red-500 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Eliminar
              </button>

              <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />

              <button
                onClick={() => acciones.deselectTodas()}
                className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                title="Limpiar selección"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalesRol />
    </div>
  );
};
