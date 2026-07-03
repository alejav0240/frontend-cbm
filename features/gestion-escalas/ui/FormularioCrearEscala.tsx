'use client';

import React, {useState} from 'react';
import {useForm, type Resolver} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Modal from '@/shared/ui/components/Modal';
import {InputField} from '@/shared/ui/form/InputField';
import {TextAreaField} from '@/shared/ui/form/TextAreaField';
import {Plus, X} from 'lucide-react';
import {toast} from 'sonner';
import {
    esquemaCrearEscala,
    type EscalaFormData,
} from '@/features/gestion-escalas';

interface FormularioCrearEscalaProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EscalaFormData) => void;
    creando?: boolean;
}

export function FormularioCrearEscala({
                                          isOpen,
                                          onClose,
                                          onSubmit,
                                          creando,
                                      }: FormularioCrearEscalaProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
        reset,
    } = useForm<EscalaFormData>({
        resolver: zodResolver(esquemaCrearEscala) as unknown as Resolver<EscalaFormData>,
        defaultValues: {
            name: '',
            description: '',
            type: 'subscales',
            subscales: [],
            values: [],
        },
    });

    const type = watch('type');
    const subscales = watch('subscales');
    const values = watch('values');

    const [newSubscale, setNewSubscale] = useState({
        name: '',
        maxScore: 100,
        description: '',
    });

    const [newValue, setNewValue] = useState({
        label: '',
        value: 1,
    });

    const handleFormSubmit = (data: EscalaFormData) => {
        console.log(data);
        onSubmit(data);
        reset();
    };

    const addSubscaleToNew = () => {
        if (!newSubscale.name) {
            toast.error('El nombre de la subescala es obligatorio');
            return;
        }
        setValue('subscales', [
            ...subscales,
            {...newSubscale, id: Date.now()},
        ]);
        setNewSubscale({name: '', maxScore: 100, description: ''});
    };

    const addValueToNew = () => {
        if (!newValue.label) {
            toast.error('La etiqueta del valor es obligatoria');
            return;
        }
        setValue('values', [
            ...values,
            {...newValue, id: Date.now()},
        ]);
        setNewValue({label: '', value: values.length + 2});
    };

    const removeSubscaleFromNew = (id: number) => {
        setValue('subscales', subscales.filter((s) => s.id !== id));
    };

    const removeValueFromNew = (id: number) => {
        setValue('values', values.filter((v) => v.id !== id));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nueva Escala de Evaluación"
        >
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-8"
            >
                <div className="space-y-6">
                    <InputField
                        label="Nombre de la Escala"
                        placeholder="Ej. Escala de Autismo Infantil"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <TextAreaField
                        label="Descripción"
                        placeholder="Breve descripción del instrumento..."
                        rows={2}
                        error={errors.description?.message}
                        {...register('description')}
                    />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Tipo de Escala
                        </label>
                        <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-2xl gap-1">
                            <button
                                type="button"
                                onClick={() => setValue('type', 'subscales')}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'subscales' ? 'bg-white dark:bg-white/10 text-[#008080] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Con Subescalas
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue('type', 'value_list')}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'value_list' ? 'bg-white dark:bg-white/10 text-[#008080] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Con Valores Directos
                            </button>
                        </div>
                        {errors.type && (
                            <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                                {errors.type.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {type === 'subscales' ? (
                        <>
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-[#008080] uppercase tracking-widest">
                                    Subescalas / Dimensiones
                                </label>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {subscales.length} Añadidas
                </span>
                            </div>

                            <div
                                className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newSubscale.name}
                                        onChange={(e) =>
                                            setNewSubscale({...newSubscale, name: e.target.value})
                                        }
                                        placeholder="Nombre subescala"
                                        className="w-full px-4 py-2 bg-white dark:bg-white/5 rounded-lg border-transparent focus:border-[#008080] outline-none text-xs dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        value={newSubscale.maxScore}
                                        onChange={(e) =>
                                            setNewSubscale({
                                                ...newSubscale,
                                                maxScore: parseInt(e.target.value),
                                            })
                                        }
                                        placeholder="Puntaje Máx"
                                        className="w-full px-4 py-2 bg-white dark:bg-white/5 rounded-lg border-transparent focus:border-[#008080] outline-none text-xs dark:text-white"
                                    />
                                </div>
                                <textarea
                                    rows={1}
                                    value={newSubscale.description}
                                    onChange={(e) =>
                                        setNewSubscale({
                                            ...newSubscale,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Descripción de la dimensión..."
                                    className="w-full px-4 py-2 bg-white dark:bg-white/5 rounded-lg border-transparent focus:border-[#008080] outline-none text-xs dark:text-white resize-none"
                                />
                                <button
                                    type="button"
                                    onClick={addSubscaleToNew}
                                    className="w-full py-2 bg-[#008080]/10 text-[#008080] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#008080]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={14}/>
                                    Añadir Subescala
                                </button>
                            </div>

                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                {subscales.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex justify-between items-center p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5"
                                    >
                                        <div>
                                            <p className="text-xs font-bold dark:text-white">
                                                {sub.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                Máx: {sub.maxScore}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSubscaleFromNew(sub.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14}/>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {errors.subscales && (
                                <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                                    {errors.subscales.message || errors.subscales.root?.message}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-[#008080] uppercase tracking-widest">
                                    Valores de la Escala
                                </label>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {values.length} Añadidos
                </span>
                            </div>

                            <div
                                className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newValue.label}
                                        onChange={(e) =>
                                            setNewValue({...newValue, label: e.target.value})
                                        }
                                        placeholder="Etiqueta (Ej. Malo)"
                                        className="w-full px-4 py-2 bg-white dark:bg-white/5 rounded-lg border-transparent focus:border-[#008080] outline-none text-xs dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        value={newValue.value}
                                        onChange={(e) =>
                                            setNewValue({
                                                ...newValue,
                                                value: parseInt(e.target.value),
                                            })
                                        }
                                        placeholder="Valor numérico"
                                        className="w-full px-4 py-2 bg-white dark:bg-white/5 rounded-lg border-transparent focus:border-[#008080] outline-none text-xs dark:text-white"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addValueToNew}
                                    className="w-full py-2 bg-[#008080]/10 text-[#008080] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#008080]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={14}/>
                                    Añadir Valor
                                </button>
                            </div>

                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                {values.map((val) => (
                                    <div
                                        key={val.id}
                                        className="flex justify-between items-center p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                      <span
                          className="w-6 h-6 flex items-center justify-center bg-[#008080]/10 text-[#008080] rounded-full text-[10px] font-bold">
                        {val.value}
                      </span>
                                            <p className="text-xs font-bold dark:text-white">
                                                {val.label}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeValueFromNew(val.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14}/>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {errors.values && (
                                <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                                    {errors.values.message || errors.values.root?.message}
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={creando}
                        className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {creando ? 'Creando...' : 'Crear Escala'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
