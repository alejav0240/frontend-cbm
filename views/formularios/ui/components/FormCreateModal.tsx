"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { InputField } from "@/shared/ui/form/InputField";
import { TextAreaField } from "@/shared/ui/form/TextAreaField";
import {
  esquemaCrearFormulario,
  type DatosCrearFormulario,
} from "@/entities/formulario";

interface FormCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatosCrearFormulario) => void;
  creando?: boolean;
}

const TIPOS_CAMPO = [
  { label: "Texto Corto", value: "text" },
  { label: "Texto Libre", value: "text_long" },
  { label: "Número", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Sí / No", value: "boolean" },
  { label: "Escala", value: "scale" },
  { label: "Opción Múltiple", value: "multiple_choice" },
];

export function FormCreateModal({
  isOpen,
  onClose,
  onSubmit,
  creando = false,
}: FormCreateModalProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DatosCrearFormulario>({
    resolver: zodResolver(esquemaCrearFormulario),
    defaultValues: {
      name: "",
      description: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const addField = () => {
    append({
      question: "",
      questionType: "text",
      isRequired: false,
    });
  };

  const handleFormSubmit = (data: DatosCrearFormulario) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Formulario">
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <InputField
          label="Nombre del Formulario"
          placeholder="Ej. Encuesta de Satisfacción"
          error={errors.name?.message}
          {...register("name")}
        />

        <TextAreaField
          label="Descripción"
          placeholder="Describe el propósito del formulario..."
          error={errors.description?.message}
          rows={2}
          {...register("description")}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Campos del Formulario
            </label>
            <button
              type="button"
              onClick={addField}
              className="text-[10px] font-bold text-[#008080] hover:underline uppercase tracking-widest"
            >
              + Añadir Campo
            </button>
          </div>

          {errors.questions && (
            <p className="text-xs text-red-500">{errors.questions.message}</p>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5"
              >
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Etiqueta del campo"
                    {...register(`questions.${index}.question`)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 rounded-lg text-xs outline-none focus-visible:ring-1 focus-visible:ring-[#008080] dark:text-white"
                  />
                  <div className="flex gap-3">
                    <SearchableSelect
                      value={watch(`questions.${index}.questionType`)}
                      onChange={(val) =>
                        setValue(`questions.${index}.questionType`, val)
                      }
                      options={TIPOS_CAMPO}
                      className="flex-1"
                      clearable={false}
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(`questions.${index}.isRequired`)}
                        className="w-4 h-4 rounded border-gray-300 text-[#008080] focus-visible:ring-[#008080]"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Requerido
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
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
            disabled={creando}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50"
          >
            {creando ? "Creando..." : "Crear Formulario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
