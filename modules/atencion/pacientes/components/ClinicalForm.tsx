'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { clinicalSchema, ClinicalFormData } from '@/modules/atencion/pacientes/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NormalizedPatient } from "@/modules/atencion/pacientes/types/patient";

interface ClinicalFormProps {
  patient: NormalizedPatient | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ClinicalForm({ patient, onSubmit, onCancel }: ClinicalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicalFormData>({
    resolver: zodResolver(clinicalSchema),
    defaultValues: {
      objetivosGenerales: patient?.objetivosGenerales === 'No registrado' ? '' : patient?.objetivosGenerales || '',
      fisico: patient?.fisico === 'No registrado' ? '' : patient?.fisico || '',
      emocional: patient?.emocional === 'No registrado' ? '' : patient?.emocional || '',
      cognitivo: patient?.cognitivo === 'No registrado' ? '' : patient?.cognitivo || '',
      social: patient?.social === 'No registrado' ? '' : patient?.social || '',
      metodosAUsar: patient?.metodosAUsar === 'No registrado' ? '' : patient?.metodosAUsar || '',
      notas: patient?.notas === 'No registrado' ? '' : patient?.notas || '',
    }
  });

  const onFormSubmit = (data: ClinicalFormData) => {
    onSubmit({
      ...data,
      registrationComplete: true
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-200 dark:border-amber-500/10 flex items-start gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Paciente: {patient?.fullName}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500/80">Por favor, completa los objetivos y el perfil clínico para finalizar el registro.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Objetivos Generales</label>
        <textarea 
          {...register('objetivosGenerales')}
          rows={2}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white resize-none ${errors.objetivosGenerales ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`}
          placeholder="Ej. Mejorar la comunicación verbal..."
        />
        {errors.objetivosGenerales && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.objetivosGenerales.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Perfil Físico</label>
          <input 
            type="text" 
            {...register('fisico')}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.fisico ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
            placeholder="Ej. Sin limitaciones..." 
          />
          {errors.fisico && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.fisico.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Perfil Emocional</label>
          <input 
            type="text" 
            {...register('emocional')}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.emocional ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
            placeholder="Ej. Estable..." 
          />
          {errors.emocional && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.emocional.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Perfil Cognitivo</label>
          <input 
            type="text" 
            {...register('cognitivo')}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.cognitivo ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
            placeholder="Ej. Acorde a edad..." 
          />
          {errors.cognitivo && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.cognitivo.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Perfil Social</label>
          <input 
            type="text" 
            {...register('social')}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.social ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
            placeholder="Ej. Introvertido..." 
          />
          {errors.social && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.social.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Métodos a Usar</label>
        <input 
          type="text" 
          {...register('metodosAUsar')}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.metodosAUsar ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
          placeholder="Ej. Musicoterapia Creativa..." 
        />
        {errors.metodosAUsar && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.metodosAUsar.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notas Adicionales</label>
        <textarea 
          {...register('notas')}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
          placeholder="Observaciones importantes..."
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Más tarde</button>
        <button type="submit" className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">Guardar Registro Clínico</button>
      </div>
    </form>
  );
}
