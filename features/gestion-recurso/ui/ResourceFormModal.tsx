"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaRecurso,
  type DatosFormularioRecurso,
} from "@/entities/recurso";

const TYPE_OPTIONS = [
  { label: "Audio", value: "AUDIO" },
  { label: "Video", value: "VIDEO" },
  { label: "Imagen", value: "IMAGE" },
  { label: "Partitura", value: "SHEET_MUSIC" },
  { label: "Documento", value: "DOCUMENT" },
  { label: "Enlace Web", value: "WEB_LINK" },
];

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatosFormularioRecurso) => void;
  initialData?: {
    title?: string;
    type?: string;
    url?: string;
    category?: string;
  };
  estaCreando?: boolean;
}

function FormularioRecurso({
  onSubmit,
  onClose,
  initialData,
  estaCreando,
}: {
  onSubmit: ResourceFormModalProps["onSubmit"];
  onClose: () => void;
  initialData?: ResourceFormModalProps["initialData"];
  estaCreando: boolean;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioRecurso>({
    resolver: zodResolver(esquemaRecurso),
    defaultValues: {
      title: initialData?.title ?? "",
      type: initialData?.type ?? "DOCUMENT",
      category: initialData?.category ?? "",
      url: initialData?.url ?? "",
    },
  });

  const handleFormSubmit = (data: DatosFormularioRecurso) => {
    onSubmit({ ...data, url: data.url || "#" });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Título del Recurso
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          placeholder="Ej. Guía de Musicoterapia"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Tipo"
              options={TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Categoría
          </label>
          <input
            type="text"
            {...register("category")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. Infantil"
          />
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          URL / Enlace
        </label>
        <input
          type="text"
          {...register("url")}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          placeholder="https://..."
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
          disabled={estaCreando}
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50"
        >
          {estaCreando
            ? "Guardando..."
            : initialData?.title
              ? "Actualizar Recurso"
              : "Subir Recurso"}
        </button>
      </div>
    </form>
  );
}

export function ResourceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  estaCreando = false,
}: ResourceFormModalProps) {
  const formKey = useMemo(
    () => `${isOpen}-${initialData?.title ?? "new"}`,
    [isOpen, initialData?.title],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.title ? "Editar Recurso" : "Subir Nuevo Recurso"}
    >
      <FormularioRecurso
        key={formKey}
        onSubmit={onSubmit}
        onClose={onClose}
        initialData={initialData}
        estaCreando={estaCreando}
      />
    </Modal>
  );
}
