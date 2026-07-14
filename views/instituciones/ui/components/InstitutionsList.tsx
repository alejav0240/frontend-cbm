"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Building2,
  Users,
  MapPin,
  User,
  ChevronRight,
  Search,
} from "lucide-react";
import { Institucion } from "@/entities/institucion";

interface InstitutionsListProps {
  institutions: Institucion[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectInstitution: (id: string) => void;
}

export function InstitutionsList({
  institutions,
  searchTerm,
  onSearchChange,
  onSelectInstitution,
}: InstitutionsListProps) {
  return (
    <div className="space-y-8">
      <div className="relative flex-1 group">
        <label htmlFor="search-instituciones" className="sr-only">Buscar instituciones</label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
          size={18}
        />
        <input
          id="search-instituciones"
          type="text"
          placeholder="Buscar instituciones o contactos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus-visible:border-[#008080] focus-visible:ring-4 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {institutions.map((inst, idx) => (
          <motion.div
            key={inst.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onSelectInstitution(inst.id)}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] group-hover:rotate-6 transition-transform">
                <Building2 size={28} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full">
                <Users size={12} className="text-[#008080]" />
                <span className="text-[10px] font-bold dark:text-white uppercase tracking-widest">
                  {inst.grupos?.length || 0} Grupos
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-4 group-hover:text-[#008080] transition-colors">
              {inst.nombre}
            </h3>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="text-[#008080] shrink-0" />
                <span className="truncate">{inst.direccion}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <User size={16} className="text-[#008080] shrink-0" />
                <span>{inst.nombreContacto}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
              <span className="text-[10px] font-bold text-[#008080] uppercase tracking-[0.2em]">
                Ver detalles
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#008080] group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
