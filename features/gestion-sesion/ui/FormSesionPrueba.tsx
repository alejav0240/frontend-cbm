'use client';

import React, {useState, useEffect} from 'react';
import Modal from "@/shared/ui/components/Modal";
import {SearchableSelect} from "@/shared/ui/components/SearchableSelect";

// Interfaz para los datos limpios que se enviarán al Backend / Mutación
export interface FormSesionPruebaData {
    testPatientName: string;
    testFatherPhone: string;
    testDate: string;
    testTime: string;
    testType: string;
    testTherapist: string;
}

interface FormSesionPruebaProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormSesionPruebaData) => void;
    therapists: { label: string; value: string }[];
    onSearchTherapist?: (term: string) => void;
    isLoadingTherapists?: boolean;
}

// Función auxiliar para obtener los valores limpios por defecto
const obtenerValoresIniciales = (defaultTherapistId = ''): FormSesionPruebaData => ({
    testPatientName: '',
    testFatherPhone: '',
    testDate: new Date().toISOString().split('T')[0],
    testTime: '09:00',
    testType: 'Individual',
    testTherapist: defaultTherapistId,
});

export function FormSesionPrueba({
                                     isOpen,
                                     onClose,
                                     onSubmit,
                                     therapists,
                                     onSearchTherapist,
                                     isLoadingTherapists
                                 }: FormSesionPruebaProps) {

    // Estado unificado en un solo objeto para optimizar renders
    const [formValues, setFormValues] = useState<FormSesionPruebaData>(() =>
        obtenerValoresIniciales(therapists[0]?.value)
    );

    // SOLUCIÓN AL SETSTATE-IN-EFFECT:
    // Solo reseteamos cuando 'isOpen' pasa a true de forma controlada y aislada
    useEffect(() => {
        if (isOpen) {
            setFormValues(obtenerValoresIniciales(therapists[0]?.value || ''));
        }
        // Dejamos intencionalmente fuera a 'therapists' para evitar sobreescribir
        // la selección del usuario si el array cambia su referencia asíncronamente.
    }, [isOpen]);

    // Manejador genérico para inputs tradicionales (Texto, Tel, Date, Time)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manejador para los componentes controlados de tipo Select
    const handleSelectChange = (name: keyof FormSesionPruebaData, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Agendar Sesión de Prueba">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Nombre del Paciente
                        </label>
                        <input
                            type="text"
                            name="testPatientName"
                            required
                            value={formValues.testPatientName}
                            onChange={handleInputChange}
                            placeholder="Ej. Juanito Pérez"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Número del Papá/Tutor
                        </label>
                        <input
                            type="tel"
                            name="testFatherPhone"
                            required
                            value={formValues.testFatherPhone}
                            onChange={handleInputChange}
                            placeholder="Ej. 70000000"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha</label>
                        <input
                            type="date"
                            name="testDate"
                            required
                            value={formValues.testDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hora</label>
                        <input
                            type="time"
                            name="testTime"
                            required
                            value={formValues.testTime}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                        />
                    </div>

                    <SearchableSelect
                        label="Tipo de Sesión"
                        options={['Individual', 'Grupal']}
                        value={formValues.testType}
                        onChange={(val) => handleSelectChange('testType', val)}
                    />

                    <SearchableSelect
                        className='col-span-3'
                        label="Terapeuta"
                        options={therapists}
                        value={formValues.testTherapist}
                        onChange={(val) => handleSelectChange('testTherapist', val)}
                        onSearch={onSearchTherapist}
                        isLoading={isLoadingTherapists}
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
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg"
                    >
                        Agendar Prueba
                    </button>
                </div>
            </form>
        </Modal>
    );
}