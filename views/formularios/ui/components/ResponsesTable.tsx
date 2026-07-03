'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import type { FormResponse, FormAssignment, FormTemplate } from '@/entities/formulario';

interface ResponsesTableProps {
  responses: FormResponse[];
  assignments: FormAssignment[];
  templates: FormTemplate[];
  onViewDetails: (resp: FormResponse) => void;
}

export function ResponsesTable({ responses, assignments, templates, onViewDetails }: ResponsesTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Usuario</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Formulario</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha Envío</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => {
              const assignment = assignments.find(a => a.id === resp.assignmentId);
              const template = templates.find(t => t.id === assignment?.templateId);
              return (
                <tr key={resp.id} className="border-b border-gray-50 dark:border-white/2 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold dark:text-white">{resp.patientName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{template?.name || 'Desconocido'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(resp.submittedAt).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => onViewDetails(resp)}
                      className="text-[#008080] text-xs font-bold hover:underline uppercase tracking-widest flex items-center gap-2"
                    >
                      <Eye size={14} />
                      Ver Respuestas
                    </button>
                  </td>
                </tr>
              );
            })}
            {responses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">No se han recibido respuestas aún</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
