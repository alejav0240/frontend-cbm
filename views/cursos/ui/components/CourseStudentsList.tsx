'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users } from 'lucide-react';
import { Curso, InscripcionCurso } from '@/entities/curso';

interface CourseStudentsListProps {
  course: Curso;
  enrollments: InscripcionCurso[];
  onBack: () => void;
}

export function CourseStudentsList({ course, enrollments, onBack }: CourseStudentsListProps) {
  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#008080] transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Volver a Cursos
      </button>

      <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-[#008080]/10 flex items-center justify-center text-[#008080]">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold dark:text-white serif">{course.nombre}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Lista de estudiantes inscritos</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estudiante</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Carnet</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fecha</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pago</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">No hay estudiantes inscritos en este curso.</td>
                </tr>
              ) : (
                enrollments.map((enrollment, idx) => (
                  <motion.tr
                    key={enrollment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-8 py-5 font-bold dark:text-white">{enrollment.nombreCompleto}</td>
                    <td className="px-8 py-5 text-sm text-gray-500">{enrollment.carnet}</td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {enrollment.fechaInscripcion instanceof Date
                        ? enrollment.fechaInscripcion.toLocaleDateString('es-ES')
                        : String(enrollment.fechaInscripcion)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#008080]">Bs. {Number(enrollment.pago.monto).toFixed(2)}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">{enrollment.pago.metodoPago}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${enrollment.pago.estadoPago === 'COMPLETED' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10'}`}>
                        {enrollment.pago.estadoPago === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
