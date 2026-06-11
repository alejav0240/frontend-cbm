"use client";

import React from "react";
import { useCursos } from "@/entities/curso";
import { Plus, GraduationCap, Users, DollarSign, ChevronRight } from "lucide-react";

export const CursosPage = () => {
  const { cursos, cargando } = useCursos();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Cursos y Talleres</h1>
          <p className="text-gray-400 text-sm">Gestiona la oferta académica y las inscripciones del centro</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus size={18} />
          Nuevo Curso
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cursos.map((curso) => (
          <div key={curso.id} className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-8 group hover:border-[#008080] transition-all cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap size={28} />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">{curso.nombre}</h3>
            <p className="text-sm text-gray-400 mb-8 line-clamp-2">{curso.descripcion}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
                <div className="flex items-center gap-2 text-[#008080] mb-1">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Alumnos</span>
                </div>
                <p className="text-lg font-bold dark:text-white">{curso.conteoEstudiantes}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <DollarSign size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ingresos</span>
                </div>
                <p className="text-lg font-bold dark:text-white">Bs. {curso.ingresosTotales}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                curso.estado === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
              }`}>
                {curso.estado === "active" ? "Activo" : "Cerrado"}
              </span>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#008080] transition-all transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
