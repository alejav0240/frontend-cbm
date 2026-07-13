"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Building2,
  Plus,
  Users,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Institucion } from "@/entities/institucion";

interface InstitutionDetailProps {
  institution: Institucion;
  onBack: () => void;
  onNewGroup: () => void;
  onSelectGroup: (id: string) => void;
  onDeleteInstitution: (id: string) => void;
}

export function InstitutionDetail({
  institution,
  onBack,
  onNewGroup,
  onSelectGroup,
  onDeleteInstitution,
}: InstitutionDetailProps) {
  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#008080] transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Volver a Instituciones
      </button>

      <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-[#008080]/10 flex items-center justify-center text-[#008080]">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold dark:text-white serif">
                {institution.nombre}
              </h2>
              <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#008080]" />{" "}
                  {institution.direccion}
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-[#008080]" />{" "}
                  {institution.nombreContacto}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={16} className="text-[#008080]" />{" "}
                  {institution.telefonoContacto}
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-[#008080]" />{" "}
                  {institution.emailContacto}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onDeleteInstitution(institution.id)}
              className="p-4 bg-red-50 dark:bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500/10 transition-all"
              title="Eliminar Institución"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onNewGroup}
              className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20 hover:scale-105"
            >
              <Plus size={20} />
              Nuevo Grupo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {institution.grupos.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onSelectGroup(group.id)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] group-hover:rotate-6 transition-transform">
                <Users size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2 group-hover:text-[#008080] transition-colors">
              {group.nombre}
            </h3>
            {group.descripcion && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                {group.descripcion}
              </p>
            )}
            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
              <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#008080] group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          </motion.div>
        ))}
        {institution.grupos.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50/50 dark:bg-white/1 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/5">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No hay grupos registrados en esta institución.
            </p>
            <button
              onClick={onNewGroup}
              className="mt-4 text-[#008080] font-bold text-sm hover:underline"
            >
              Crear el primer grupo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
