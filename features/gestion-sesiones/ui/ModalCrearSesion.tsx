"use client";

import React, { useState } from "react";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  esquemaSesion,
  type SessionFormData,
} from "@/shared/lib/schemas/sesion";
import { useCrearSesionAgenda } from "@/entities/sesion";
import { toast } from "sonner";

interface ModalCrearSesionProps {
  isOpen: boolean;
  onClose: () => void;
  onCreada: () => void;
  opcionesPacientes: { label: string; value: string }[];
  onBuscarPaciente: (termino: string) => void;
  cargandoPacientes: boolean;
}

export function ModalCrearSesion({
  isOpen,
  onClose,
  onCreada,
  opcionesPacientes,
  onBuscarPaciente,
  cargandoPacientes,
}: ModalCrearSesionProps) {
  const [enviando, setEnviando] = useState(false);
  const { crearSesion } = useCrearSesionAgenda();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(esquemaSesion),
    defaultValues: {
      sessionType: "individual",
      durationMinutes: 45,
    },
  });

  const onSubmit = async (data: SessionFormData) => {
    if (enviando) return;
    setEnviando(true);
    try {
      const fechaCompleta = `${data.sessionDate}T${data.sessionTime}:00`;
      await crearSesion({
        patientId: data.patientId,
        therapistId: data.therapistId,
        sessionDate: fechaCompleta,
        sessionType: data.sessionType,
        durationMinutes: data.durationMinutes,
        notes: data.notes || undefined,
      });
      toast.success("Sesión creada correctamente");
      reset();
      onClose();
      onCreada();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al crear la sesión");
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    if (enviando) return;
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Sesión">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-cols-2 gap-6">
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Paciente"
                options={opcionesPacientes}
                value={field.value}
                onChange={field.onChange}
                onSearch={onBuscarPaciente}
                isLoading={cargandoPacientes}
                placeholder="Buscar paciente..."
                className={errors.patientId ? "border-red-500" : ""}
              />
            )}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tipo de Sesión
            </label>
            <select
              {...register("sessionType")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            >
              <option value="individual">Individual</option>
              <option value="group">Grupal</option>
            </select>
            {errors.sessionType && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.sessionType.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Fecha
            </label>
            <input
              type="date"
              {...register("sessionDate")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.sessionDate && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.sessionDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hora
            </label>
            <input
              type="time"
              {...register("sessionTime")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.sessionTime && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.sessionTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Controller
            name="therapistId"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Terapeuta (ID)
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="ID del terapeuta"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                />
                {errors.therapistId && (
                  <p className="text-[10px] text-red-500 font-bold uppercase">
                    {errors.therapistId.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Duración (min)
            </label>
            <input
              type="number"
              {...register("durationMinutes")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="45"
            />
            {errors.durationMinutes && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.durationMinutes.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Notas
          </label>
          <textarea
            rows={3}
            {...register("notes")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            placeholder="Observaciones de la sesión..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={enviando}
          >
            {enviando && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {enviando ? "Creando..." : "Crear Sesión"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
