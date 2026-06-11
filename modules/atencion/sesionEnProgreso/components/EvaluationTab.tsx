'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Layers, FileText, X } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

interface EvaluationTabProps {
    evaluationScales: any[];
    selectedScales: number[];
    toggleScale: (id: number) => void;
    formTemplates: any[];
    selectedForms: number[];
    toggleForm: (id: number) => void;
    formResponses: Record<string, any>;
    updateForm: (key: string, value: any) => void;
}

export function EvaluationTab({
                                  evaluationScales,
                                  selectedScales,
                                  toggleScale,
                                  formTemplates,
                                  selectedForms,
                                  toggleForm,
                                  formResponses,
                                  updateForm
                              }: EvaluationTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            {/* Scales Selection */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-lg md:text-xl font-bold dark:text-white serif flex items-center gap-3">
                        <Layers className="text-[#008080]" size={20} />
                        Escalas de Evaluación
                    </h3>
                    <div className="w-full md:w-64">
                        <SearchableSelect
                            options={evaluationScales.map(s => s.name)}
                            value=""
                            onChange={(name) => {
                                const scale = evaluationScales.find(s => s.name === name);
                                if (scale) toggleScale(scale.id);
                            }}
                            placeholder="Añadir Escala..."
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {selectedScales.map(scaleId => {
                        const scale = evaluationScales.find(s => s.id === scaleId);
                        if (!scale) return null;
                        return (
                            <div key={scale.id} className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative group">
                                <button
                                    onClick={() => toggleScale(scale.id)}
                                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-xl"
                                >
                                    <X size={16} />
                                </button>
                                <h4 className="font-bold dark:text-white mb-2 pr-10">{scale.name}</h4>
                                <p className="text-xs text-gray-500 mb-6">{scale.description}</p>

                                <div className="grid gap-6">
                                    {scale.type === 'subscales' ? (
                                        scale.subscales?.map((sub: any) => (
                                            <div key={sub.id} className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub.name}</label>
                                                    <span className="text-[10px] font-bold text-[#008080]">Puntaje: {formResponses[`scale_${scale.id}_sub_${sub.id}`] || 0} / {sub.maxScore}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={sub.maxScore}
                                                    value={formResponses[`scale_${scale.id}_sub_${sub.id}`] || 0}
                                                    onChange={(e) => updateForm(`scale_${scale.id}_sub_${sub.id}`, parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-[#008080]"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            {scale.values?.map((val: any) => (
                                                <button
                                                    key={val.id}
                                                    type="button"
                                                    onClick={() => updateForm(`scale_${scale.id}_value`, val.value)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formResponses[`scale_${scale.id}_value`] === val.value ? 'bg-[#008080] text-white border-[#008080]' : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-transparent hover:border-[#008080]/30'}`}
                                                >
                                                    {val.label} ({val.value})
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Forms Selection */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-lg md:text-xl font-bold dark:text-white serif flex items-center gap-3">
                        <FileText className="text-[#008080]" size={20} />
                        Formularios Adicionales
                    </h3>
                    <div className="w-full md:w-64">
                        <SearchableSelect
                            options={formTemplates.map(f => f.name)}
                            value=""
                            onChange={(name) => {
                                const form = formTemplates.find(f => f.name === name);
                                if (form) toggleForm(form.id);
                            }}
                            placeholder="Añadir Formulario..."
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {selectedForms.map(formId => {
                        const form = formTemplates.find(f => f.id === formId);
                        if (!form) return null;
                        return (
                            <div key={form.id} className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative group">
                                <button
                                    onClick={() => toggleForm(form.id)}
                                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-xl"
                                >
                                    <X size={16} />
                                </button>
                                <h4 className="font-bold dark:text-white mb-2 pr-10">{form.name}</h4>
                                <p className="text-xs text-gray-500 mb-6">{form.description}</p>

                                <div className="grid gap-6">
                                    {form.fields.map((field: any) => (
                                        <div key={field.id} className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={formResponses[`form_${form.id}_field_${field.id}`] || ''}
                                                    onChange={(e) => updateForm(`form_${form.id}_field_${field.id}`, e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                                                />
                                            )}
                                            {field.type === 'number' && (
                                                <input
                                                    type="number"
                                                    value={formResponses[`form_${form.id}_field_${field.id}`] || ''}
                                                    onChange={(e) => updateForm(`form_${form.id}_field_${field.id}`, e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                                                />
                                            )}
                                            {field.type === 'textarea' && (
                                                <textarea
                                                    rows={3}
                                                    value={formResponses[`form_${form.id}_field_${field.id}`] || ''}
                                                    onChange={(e) => updateForm(`form_${form.id}_field_${field.id}`, e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
                                                />
                                            )}
                                            {field.type === 'select' && (
                                                <SearchableSelect
                                                    options={field.options || []}
                                                    value={formResponses[`form_${form.id}_field_${field.id}`] || ''}
                                                    onChange={(v) => updateForm(`form_${form.id}_field_${field.id}`, v)}
                                                />
                                            )}
                                            {field.type === 'checkbox' && (
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={formResponses[`form_${form.id}_field_${field.id}`] || false}
                                                        onChange={(e) => updateForm(`form_${form.id}_field_${field.id}`, e.target.checked)}
                                                        className="w-5 h-5 rounded border-gray-300 text-[#008080] focus:ring-[#008080]"
                                                    />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Marcar si aplica</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}