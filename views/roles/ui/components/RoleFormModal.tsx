"use client";

import React, { useEffect } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { PermissionsPicker } from "@/shared/ui/components/PermissionsPicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaRol, DatosFormularioRol } from "@/entities/rol/model/esquema";
import { Loader2, UserCog } from "lucide-react";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (datos: DatosFormularioRol) => void;
  initialValues?: { nombre: string; permisos: string[] };
  estaCreando?: boolean;
}

export function RoleFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  estaCreando = false,
}: RoleFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioRol>({
    resolver: zodResolver(esquemaRol),
    defaultValues: {
      nombre: initialValues?.nombre || "",
      permisos: initialValues?.permisos || [],
    },
  });

  const permisos = watch("permisos");

  useEffect(() => {
    if (isOpen && initialValues) {
      reset(initialValues);
    } else if (isOpen) {
      reset({ nombre: "", permisos: [] });
    }
  }, [isOpen, initialValues, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        initialValues
          ? `Editar Rol: ${initialValues.nombre}`
          : "Crear Nuevo Rol"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Rol
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <UserCog size={16} />
            </div>
            <input
              type="text"
              {...register("nombre")}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej. Terapeuta Senior"
            />
          </div>
          {errors.nombre && (
            <p className="text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-white/5 pt-4">
          <PermissionsPicker
            value={permisos}
            onChange={(p) => setValue("permisos", p, { shouldValidate: true })}
          />
          {errors.permisos && (
            <p className="text-xs text-red-500 mt-2">
              {errors.permisos.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={estaCreando}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {estaCreando && <Loader2 size={16} className="animate-spin" />}
            {initialValues ? "Guardar Cambios" : "Crear Rol"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
