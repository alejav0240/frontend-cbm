'use client';

import React from 'react';
import Modal from '@/shared/ui/components/Modal';
import { SearchableSelect } from '@/shared/ui/components/SearchableSelect';
import { 
  MOMENTO_OPTIONS, 
  OBJETIVOS_CON_FOCOS, 
  ENFOQUES_OPTIONS, 
  ENFASIS_MUSICAL_OPTIONS,
  MLT_OPTIONS,
  RECURSOS_MUSICALES_OPTIONS
} from '@/data/intervention-options';

interface StepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingStepId: number | null;
  momento: string;
  setMomento: (val: string) => void;
  duracion: string;
  setDuracion: (val: string) => void;
  objetivoPaso: string;
  setObjetivoPaso: (val: string) => void;
  focoPaso: string;
  setFocoPaso: (val: string) => void;
  recursosMusicales: string;
  setRecursosMusicales: (val: string) => void;
  enfasisMusical: string;
  setEnfasisMusical: (val: string) => void;
  enfoque: string;
  setEnfoque: (val: string) => void;
  mltEnfoque: string;
  setMltEnfoque: (val: string) => void;
}

export function StepFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingStepId,
  momento,
  setMomento,
  duracion,
  setDuracion,
  objetivoPaso,
  setObjetivoPaso,
  focoPaso,
  setFocoPaso,
  recursosMusicales,
  setRecursosMusicales,
  enfasisMusical,
  setEnfasisMusical,
  enfoque,
  setEnfoque,
  mltEnfoque,
  setMltEnfoque
}: StepFormModalProps) {
  const OBJETIVOS_OPTIONS = OBJETIVOS_CON_FOCOS.map(o => o.objetivo);
  const FOCOS_OPTIONS = OBJETIVOS_CON_FOCOS.find(o => o.objetivo === objetivoPaso)?.focos || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingStepId ? "Editar Paso del Plan" : "Añadir Paso al Plan"}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid sm:grid-cols-2 gap-6">
          <SearchableSelect 
            label="Momento"
            options={MOMENTO_OPTIONS}
            value={momento}
            onChange={setMomento}
            placeholder="Seleccionar momento..."
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duración (min)</label>
            <input 
              type="number" 
              required 
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" 
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <SearchableSelect 
            label="Objetivo"
            options={OBJETIVOS_OPTIONS}
            value={objetivoPaso}
            onChange={(val) => {
              setObjetivoPaso(val);
              setFocoPaso(''); // Reset foco when objetivo changes
            }}
            placeholder="Seleccionar objetivo..."
          />
          <SearchableSelect 
            label="Foco"
            options={FOCOS_OPTIONS}
            value={focoPaso}
            onChange={setFocoPaso}
            placeholder="Seleccionar foco..."
            disabled={!objetivoPaso}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recursos Musicales</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect 
              options={RECURSOS_MUSICALES_OPTIONS}
              value=""
              onChange={(val) => {
                if (!val) return;
                const current = recursosMusicales.split(',').map(s => s.trim()).filter(Boolean);
                if (!current.includes(val)) {
                  setRecursosMusicales([...current, val].join(', '));
                }
              }}
              placeholder="Añadir recurso..."
            />
            <input 
              type="text" 
              required 
              value={recursosMusicales || ''}
              onChange={(e) => setRecursosMusicales(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" 
              placeholder="Ej. Guitarra, Pandereta, Voz..." 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Énfasis Musical</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect 
              options={ENFASIS_MUSICAL_OPTIONS}
              value=""
              onChange={(val) => {
                if (!val) return;
                const current = enfasisMusical.split(',').map(s => s.trim()).filter(Boolean);
                if (!current.includes(val)) {
                  setEnfasisMusical([...current, val].join(', '));
                }
              }}
              placeholder="Añadir énfasis..."
            />
            <input 
              type="text" 
              required 
              value={enfasisMusical || ''}
              onChange={(e) => setEnfasisMusical(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" 
              placeholder="Ej. Encuadre Jazz, Escucha Activa..." 
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <SearchableSelect 
            label="Enfoque"
            options={ENFOQUES_OPTIONS}
            value={enfoque}
            onChange={setEnfoque}
            placeholder="Seleccionar enfoque..."
          />
          <SearchableSelect 
            label="MLT"
            options={MLT_OPTIONS}
            value={mltEnfoque}
            onChange={setMltEnfoque}
            placeholder="Seleccionar MLT..."
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button type="submit" className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">
            {editingStepId ? 'Actualizar Paso' : 'Añadir Paso'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
