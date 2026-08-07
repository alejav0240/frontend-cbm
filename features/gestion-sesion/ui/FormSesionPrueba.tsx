"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaSesionPrueba,
  type DatosFormularioSesionPrueba,
} from "@/entities/sesion";

// Interfaz para los datos limpios que se enviarán al Backend / Mutación
export type FormSesionPruebaData = DatosFormularioSesionPrueba;

interface FormSesionPruebaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormSesionPruebaData) => void;
  therapists: { label: string; value: string }[];
  onSearchTherapist?: (term: string) => void;
  isLoadingTherapists?: boolean;
}

// Función auxiliar para obtener los valores limpios por defecto
const obtenerValoresIniciales = (
  defaultTherapistId = "",
): DatosFormularioSesionPrueba => ({
  testPatientName: "",
  testFatherPhone: "",
  testDate: new Date().toISOString().split("T")[0],
  testTime: "09:00",
  testType: "Individual",
  testTherapist: defaultTherapistId,
});

export function FormSesionPrueba({
  isOpen,
  onClose,
  onSubmit,
  therapists,
  onSearchTherapist,
  isLoadingTherapists,
}: FormSesionPruebaProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioSesionPrueba>({
    resolver: zodResolver(esquemaSesionPrueba),
    defaultValues: obtenerValoresIniciales(therapists[0]?.value),
  });

  // Reset del formulario cada vez que se abre el modal
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen !== prevIsOpen.current) {
      prevIsOpen.current = isOpen;
      if (isOpen) {
        reset(obtenerValoresIniciales(therapists[0]?.value || ""));
      }
    }
  }, [isOpen, reset, therapists]);

  const handleSubmitForm = (data: DatosFormularioSesionPrueba) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agendar Sesión de Prueba">
      <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Nombre del Paciente
            </label>
            <input
              type="text"
              {...register("testPatientName")}
              placeholder="Ej. Juanito Pérez"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.testPatientName && (
              <p className="text-xs text-red-500">
                {errors.testPatientName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Número del Papá/Tutor
            </label>
            <input
              type="tel"
              {...register("testFatherPhone")}
              placeholder="Ej. 70000000"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.testFatherPhone && (
              <p className="text-xs text-red-500">
                {errors.testFatherPhone.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Fecha
            </label>
            <input
              type="date"
              {...register("testDate")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.testDate && (
              <p className="text-xs text-red-500">{errors.testDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hora
            </label>
            <input
              type="time"
              {...register("testTime")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.testTime && (
              <p className="text-xs text-red-500">{errors.testTime.message}</p>
            )}
          </div>

          <Controller
            name="testType"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Tipo de Sesión"
                options={["Individual", "Grupal"]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="testTherapist"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                className="col-span-3"
                label="Terapeuta"
                options={therapists}
                value={field.value}
                onChange={field.onChange}
                onSearch={onSearchTherapist}
                isLoading={isLoadingTherapists}
              />
            )}
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
