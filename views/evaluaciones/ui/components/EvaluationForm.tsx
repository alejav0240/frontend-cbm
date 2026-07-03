'use client';

import React from 'react';
import { SearchableSelect } from '@/shared/ui/components/SearchableSelect';

interface EvaluationFormProps {
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
  evaluationScales: any[];
  newEval: any;
  setNewEval: (val: any) => void;
  selectedScaleId: number | null;
  handleScaleChange: (scaleId: string) => void;
  subscaleScores: Record<number, number>;
  handleSubscaleScoreChange: (subId: number, score: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EvaluationForm({
  patientOptions,
  onSearchPatient,
  evaluationScales,
  newEval,
  setNewEval,
  selectedScaleId,
  handleScaleChange,
  subscaleScores,
  handleSubscaleScoreChange,
  onSubmit,
  onCancel,
  isLoading
}: EvaluationFormProps) {
  const currentScale = evaluationScales.find(s => s.id == selectedScaleId);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SearchableSelect 
        label="Paciente"
        options={patientOptions}
        value={newEval.patientId}
        onChange={(val) => setNewEval({...newEval, patientId: val})}
        onSearch={onSearchPatient}
        placeholder="Buscar paciente..."
      />
      <div className="grid grid-cols-2 gap-6">
        <SearchableSelect 
          label="Etapa de Evaluación"
          options={['Inicial', 'Seguimiento', 'Final']}
          value={newEval.type}
          onChange={(val) => setNewEval({...newEval, type: val})}
        />
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha</label>
          <input 
            type="date"
            value={newEval.date}
            onChange={(e) => setNewEval({...newEval, date: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
        </div>
      </div>

      <SearchableSelect 
        label="Escala de Evaluación"
        options={evaluationScales.map(scale => ({ label: scale.name, value: scale.id.toString() }))}
        value={selectedScaleId?.toString() || ''}
        onChange={handleScaleChange}
        placeholder="Seleccionar Escala..."
      />

      {selectedScaleId && (
        <div className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
          {currentScale?.scaleType.toLowerCase() === 'subscale' ? (
            <>
              <p className="text-xs font-bold text-[#008080] uppercase tracking-widest mb-4">Puntuación por Subescalas</p>
              <div className="grid gap-4">
                {currentScale.subscales?.map((sub: any) => (
                  <div key={sub.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex-1">
                      <p className="text-xs font-bold dark:text-white">{sub.name}</p>
                      <p className="text-[10px] text-gray-400">{sub.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        max={sub.maxValue}
                        min={0}
                        value={subscaleScores[sub.id] || 0}
                        onChange={(e) => handleSubscaleScoreChange(sub.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border-transparent focus:border-[#008080] outline-none text-xs dark:text-white text-center"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">/ {sub.maxValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#008080] uppercase tracking-widest mb-4">Seleccionar Valor</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentScale?.values?.map((val: any) => (
                  <button
                    key={val.id}
                    type="button"
                    onClick={() => setNewEval((prev: any) => ({ ...prev, score: val.value }))}
                    className={`p-4 rounded-2xl border transition-all text-center ${
                      newEval.score === val.value 
                        ? 'bg-[#008080] text-white border-[#008080] shadow-md' 
                        : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-[#008080]'
                    }`}
                  >
                    <p className="text-xl font-bold mb-1">{val.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest">{val.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200 dark:border-white/5 flex justify-between items-center">
            <span className="text-sm font-bold dark:text-white">Puntaje Total:</span>
            <span className="text-xl font-bold text-[#008080]">{newEval.score}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
        <button type="submit" className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">Registrar Evaluación</button>
      </div>
    </form>
  );
}
