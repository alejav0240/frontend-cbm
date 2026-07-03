'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plus, Music, CheckCircle2, Edit2, Trash2 } from 'lucide-react';

interface InterventionPlanDetailsProps {
  steps: any[];
  onAddStep: () => void;
  onEditStep: (step: any) => void;
  onDeleteStep: (stepId: number) => void;
  onToggleStepCompletion: (stepId: number) => void;
}

export function InterventionPlanDetails({
  steps,
  onAddStep,
  onEditStep,
  onDeleteStep,
  onToggleStepCompletion
}: InterventionPlanDetailsProps) {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mt-10 pt-10 border-t border-gray-100 dark:border-white/5 space-y-12"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music size={20} className="text-[#008080]" />
            <h4 className="text-sm font-bold dark:text-white uppercase tracking-[0.2em]">Plan de Intervención Detallado</h4>
          </div>
          <button 
            onClick={onAddStep}
            className="flex items-center gap-2 text-[10px] font-bold text-[#008080] bg-[#008080]/10 px-4 py-2 rounded-xl hover:bg-[#008080]/20 transition-all uppercase tracking-widest"
          >
            <Plus size={14} />
            Añadir Paso
          </button>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Momento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Objetivo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Foco</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recursos Musicales</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Énfasis Musical</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enfoque</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MLT</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duración</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {steps?.map((step) => (
                <tr key={step.id} className={`hover:bg-gray-50/50 dark:hover:bg-white/1 transition-colors ${step.completed ? 'bg-green-50/30 dark:bg-green-500/5' : ''}`}>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-[#008080]">{step.momento}</td>
                  <td className={`px-6 py-4 text-xs dark:text-gray-300 whitespace-pre-line leading-relaxed ${step.completed ? 'line-through opacity-50' : ''}`}>{step.objetivo}</td>
                  <td className={`px-6 py-4 text-xs dark:text-gray-300 whitespace-pre-line leading-relaxed ${step.completed ? 'line-through opacity-50' : ''}`}>{step.foco}</td>
                  <td className={`px-6 py-4 text-xs dark:text-gray-300 whitespace-pre-line leading-relaxed ${step.completed ? 'line-through opacity-50' : ''}`}>{step.recursosMusicales}</td>
                  <td className={`px-6 py-4 text-xs dark:text-gray-300 whitespace-pre-line leading-relaxed ${step.completed ? 'line-through opacity-50' : ''}`}>{step.enfasisMusical}</td>
                  <td className={`px-6 py-4 text-xs dark:text-gray-300 whitespace-pre-line leading-relaxed ${step.completed ? 'line-through opacity-50' : ''}`}>{step.enfoque}</td>
                  <td className={`px-6 py-4 text-xs dark:text-gray-300 whitespace-pre-line leading-relaxed ${step.completed ? 'line-through opacity-50' : ''}`}>{step.mltEnfoque}</td>
                  <td className="px-6 py-4 text-sm font-bold dark:text-white">{step.duracion} min</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onToggleStepCompletion(step.id)}
                      className={`p-2 rounded-lg transition-all ${step.completed ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10'}`}
                      title={step.completed ? "Marcar como pendiente" : "Marcar como completado"}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onEditStep(step)}
                        className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
                        title="Editar paso"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => onDeleteStep(step.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar paso"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
