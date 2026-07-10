'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Search, UserPlus, Users, Edit, Trash2 } from 'lucide-react';
import { Curso } from '@/entities/curso';

interface CoursesTableProps {
  courses: Curso[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEnroll: (course: Curso) => void;
  onViewStudents: (course: Curso) => void;
  onEdit: (course: Curso) => void;
  onDelete: (id: string) => void;
}

export function CoursesTable({
  courses,
  searchTerm,
  setSearchTerm,
  onEnroll,
  onViewStudents,
  onEdit,
  onDelete,
}: CoursesTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar cursos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white shadow-sm"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Curso</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Precio</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estudiantes</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Ingresos</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {courses.map((course, idx) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] font-bold text-lg shadow-inner">
                        {course.nombre?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">{course.nombre}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[200px]">{course.descripcion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">Bs. {course.precio}</td>
                  <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400">{course.conteoEstudiantes}</td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-[#008080]">Bs. {Number(course.ingresosTotales).toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${course.estado === 'ACTIVE' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-gray-100 text-gray-600 dark:bg-white/5'}`}>
                      {course.estado === 'ACTIVE' ? 'Activo' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => onEnroll(course)} className="p-2.5 bg-[#008080]/10 rounded-xl text-[#008080] hover:bg-[#008080] hover:text-white transition-all" title="Inscribir Estudiante">
                        <UserPlus size={18} />
                      </button>
                      <button onClick={() => onViewStudents(course)} className="p-2.5 bg-blue-50 dark:bg-blue-500/5 rounded-xl text-blue-500 hover:bg-blue-500/10 transition-all" title="Ver Estudiantes">
                        <Users size={18} />
                      </button>
                      <button onClick={() => onEdit(course)} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => onDelete(course.id)} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
