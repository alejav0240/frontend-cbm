'use client';

import React from 'react';
import type { FormAssignment, FormTemplate, FormResponse } from '@/entities/formulario';

interface AssignmentsTableProps {
  assignments: FormAssignment[];
  templates: FormTemplate[];
  responses: FormResponse[];
}

export function AssignmentsTable({ assignments, templates, responses }: AssignmentsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Formulario</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asignado a</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assign) => {
              const template = templates.find(t => t.id === assign.templateId);
              const responsesCount = responses.filter(r => r.assignmentId === assign.id).length;
              return (
                <tr key={assign.id} className="border-b border-gray-50 dark:border-white/2 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold dark:text-white">{template?.name || 'Desconocido'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-[#008080]/10 text-[#008080] rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {assign.assignedToRole}s
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(assign.assignedAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${assign.status === 'Activo' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs font-medium dark:text-white">{assign.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-[#008080]">{responsesCount}</p>
                  </td>
                </tr>
              );
            })}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">No hay asignaciones activas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
