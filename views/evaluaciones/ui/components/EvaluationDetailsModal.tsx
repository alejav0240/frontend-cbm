'use client';

import React from 'react';
import {motion} from 'motion/react';
import {FileText, Download} from 'lucide-react';
import {Modal} from '@/shared/ui/components/Modal';

interface EvaluationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    evaluation: any;
    evaluationScales: any[];
    onExport: () => void;
}

export function EvaluationDetailsModal({
                                           isOpen,
                                           onClose,
                                           evaluation,
                                           evaluationScales,
                                           onExport
                                       }: EvaluationDetailsModalProps) {
    if (!evaluation) return null;

    console.log('Evaluation Details Modal Data:', evaluation);

    const realData = evaluation.originalData;
    const currentScale = evaluationScales.find(s => s.id == (realData?.scale?.id || evaluation.scaleId));

    console.log('Current Scale:', currentScale);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Evaluación">
            <div className="space-y-8">
                <div
                    className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-white/2 rounded-[32px] border border-gray-100 dark:border-white/5">
                    <div
                        className="w-16 h-16 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                        <FileText size={32}/>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">{evaluation.patient}</h3>
                        <p className="text-sm text-gray-500">{evaluation.type} • {evaluation.date}</p>
                    </div>
                </div>

                {currentScale && (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {currentScale.scaleType === 'subscale' ? 'Resultados por Dimensión' : 'Resultado de la Escala'}
                        </h4>
                        {currentScale.scaleType?.toLowerCase() === 'subscale' ? (
                            <div className="grid gap-4">
                                {currentScale.subscales?.map((sub: any) => {
                                    const response = realData?.subscaleResponses?.find((r: any) => r.subscale.id === sub.id);
                                    const score = response ? response.score : (evaluation.subscaleScores?.[sub.id] || 0);

                                    return (
                                        <div key={sub.id}
                                             className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold dark:text-white">{sub.name}</span>
                                                <span
                                                    className="text-sm font-bold text-[#008080]">{score} / {sub.maxValue}</span>
                                            </div>
                                            <div
                                                className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{width: 0}}
                                                    animate={{width: `${(score / sub.maxValue) * 100}%`}}
                                                    className="h-full bg-[#008080]"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold dark:text-white">Valor Seleccionado</p>
                                    <p className="text-xs text-gray-500">
                                        {currentScale?.values?.find((v: any) => v.value === parseInt(evaluation.score))?.label || 'N/A'}
                                    </p>
                                </div>
                                <span className="text-3xl font-bold text-[#008080]">{evaluation.score}</span>
                            </div>
                        )}
                        <div
                            className="p-6 bg-[#008080] rounded-3xl text-white flex justify-between items-center shadow-lg shadow-[#008080]/20">
                            <span className="font-bold">Puntaje Global</span>
                            <span className="text-3xl font-bold">{evaluation.score}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onExport}
                        className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg flex items-center gap-2"
                    >
                        <Download size={18}/>
                        Exportar PDF
                    </button>
                </div>
            </div>
        </Modal>
    );
}
