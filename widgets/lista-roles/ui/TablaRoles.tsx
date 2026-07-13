"use client";

import React from "react";
import { motion } from "motion/react";
import { Shield, Users, ChevronRight, Trash2, Edit3, Check } from "lucide-react";
import { Rol } from "@/entities/rol";

interface TablaRolesProps {
  roles: Rol[];
  rolesSeleccionadas: Rol[];
  onAlternarSeleccion: (rol: Rol) => void;
  onEliminar: (rol: Rol) => void;
  onEditar: (rol: Rol) => void;
}

export const TablaRoles = ({
  roles,
  rolesSeleccionadas,
  onAlternarSeleccion,
  onEliminar,
  onEditar,
}: TablaRolesProps) => {
  const isSelected = (id: string) =>
    rolesSeleccionadas.some((r) => r.id === id);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((rol, idx) => {
        const seleccionado = isSelected(rol.id);
        return (
          <motion.div
            key={rol.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onAlternarSeleccion(rol)}
            className={`bg-white dark:bg-[#111] p-8 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${
              seleccionado
                ? "border-[#008080] ring-2 ring-[#008080]/20 bg-[#008080]/5 dark:bg-[#008080]/5"
                : "border-gray-200 dark:border-white/5 hover:border-[#008080]/50"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  seleccionado
                    ? "bg-[#008080] text-white scale-110"
                    : "bg-[#008080]/10 text-[#008080] group-hover:scale-110"
                }`}
              >
                {seleccionado ? <Check size={28} /> : <Shield size={28} />}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(rol);
                  }}
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 transition-colors"
                  title="Editar rol"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminar(rol);
                  }}
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Eliminar rol"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold dark:text-white mb-2">
              {rol.nombre}
            </h3>
            <p className="text-sm text-gray-400 mb-6 line-clamp-2">
              Control de acceso con {rol.permisos.length} permisos específicos
              asignados.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {rol.permisos.slice(0, 3).map((permiso) => (
                <span
                  key={permiso}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 dark:bg-white/2 px-2 py-1 rounded-md"
                >
                  {permiso.replace(":", " ")}
                </span>
              ))}
              {rol.permisos.length > 3 && (
                <span className="text-[10px] font-bold text-[#008080] uppercase tracking-tighter bg-[#008080]/5 px-2 py-1 rounded-md">
                  +{rol.permisos.length - 3} más
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Users size={14} />
                <span className="text-xs font-bold">
                  {rol.conteoUsuarios}{" "}
                  {rol.conteoUsuarios === 1 ? "usuario" : "usuarios"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#008080] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Configurar
                </span>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-[#008080] transition-all transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
