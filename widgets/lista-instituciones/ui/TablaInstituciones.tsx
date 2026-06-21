"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Building2,
  MapPin,
  Users,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Institucion } from "@/entities/institucion";

interface TablaInstitucionesProps {
  instituciones: Institucion[];
  alSeleccionar: (id: string) => void;
}

export const TablaInstituciones = ({
  instituciones,
  alSeleccionar,
}: TablaInstitucionesProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {instituciones.map((inst, idx) => (
        <motion.div
          key={inst.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 hover:border-[#008080] transition-all cursor-pointer group"
          onClick={() => alSeleccionar(inst.id)}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] mb-6 group-hover:scale-110 transition-transform">
            <Building2 size={28} />
          </div>

          <h3 className="text-xl font-bold dark:text-white mb-2">
            {inst.nombre}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={14} />
              <span className="line-clamp-1">{inst.direccion}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={14} />
              <span>{inst.grupos.length} Grupos / Convenios</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
            <div className="flex -space-x-2">
              {inst.grupos.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#111] flex items-center justify-center text-[10px] font-bold text-gray-400"
                >
                  {g.nombre.charAt(0)}
                </div>
              ))}
              {inst.grupos.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-[#008080] border-2 border-white dark:border-[#111] flex items-center justify-center text-[10px] font-bold text-white">
                  +{inst.grupos.length - 3}
                </div>
              )}
            </div>
            <ChevronRight
              size={18}
              className="text-gray-300 group-hover:text-[#008080] transition-all transform group-hover:translate-x-1"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
