"use client";

import React from "react";
import { motion } from "motion/react";
import { Shield, Users, Lock, ChevronRight } from "lucide-react";
import { Rol } from "@/entities/rol";

interface TablaRolesProps {
  roles: Rol[];
}

export const TablaRoles = ({ roles }: TablaRolesProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((rol, idx) => (
        <motion.div
          key={rol.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 hover:border-[#008080] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] group-hover:scale-110 transition-transform">
              <Shield size={28} />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full">
              <Users size={12} />
              <span>{rol.conteoUsuarios} Usuarios</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold dark:text-white mb-2">{rol.nombre}</h3>
          <p className="text-sm text-gray-400 mb-6 line-clamp-2">
            Control de acceso con {rol.permisos.length} permisos específicos asignados.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {rol.permisos.slice(0, 3).map((permiso) => (
              <span key={permiso} className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 dark:bg-white/2 px-2 py-1 rounded-md">
                {permiso.replace(':', ' ')}
              </span>
            ))}
            {rol.permisos.length > 3 && (
              <span className="text-[10px] font-bold text-[#008080] uppercase tracking-tighter bg-[#008080]/5 px-2 py-1 rounded-md">
                +{rol.permisos.length - 3} más
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
            <span className="text-xs font-bold text-[#008080] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Configurar Accesos</span>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#008080] transition-all transform group-hover:translate-x-1" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
