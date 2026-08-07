"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import {
  esquemaInstitucion,
  type DatosFormularioInstitucion,
} from "@/entities/institucion";

export type InstitutionFormData = DatosFormularioInstitucion;

interface InstitutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InstitutionFormData) => void;
}

export function InstitutionFormModal({
  isOpen,
  onClose,
  onSave,
}: InstitutionFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioInstitucion>({
    resolver: zodResolver(esquemaInstitucion),
    defaultValues: {
      nombre: "",
      direccion: "",
      nombreContacto: "",
      telefonoContacto: "",
      emailContacto: "",
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Institución">
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSave(data))}
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre de la Institución
          </label>
          <input
            type="text"
            {...register("nombre")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Colegio San Pepito"
          />
          {errors.nombre && (
            <p className="text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Dirección
          </label>
          <input
            type="text"
            {...register("direccion")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Av. Principal 123"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Persona de Contacto
          </label>
          <input
            type="text"
            {...register("nombreContacto")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Lic. Juan Pérez"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Teléfono
            </label>
            <input
              type="text"
              {...register("telefonoContacto")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej: +591 70000001"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              {...register("emailContacto")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej: contacto@institucion.com"
            />
            {errors.emailContacto && (
              <p className="text-xs text-red-500">
                {errors.emailContacto.message}
              </p>
            )}
          </div>
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
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Guardar Institución
          </button>
        </div>
      </form>
    </Modal>
  );
}
