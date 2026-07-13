"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormularioClinicoDataSchema,
  formularioClinicoSchema,
} from "@/features/gestion-paciente/model/FormularioClinicoData.schema";
import { InputField } from "@/shared/ui/form/InputField";
import { TextAreaField } from "@/shared/ui/form/TextAreaField";

interface FormularioClinicoProps {
  paciente: any | null;
  alEnviar: (data: FormularioClinicoDataSchema) => void;
  alCancelar: () => void;
  estaCargando?: boolean;
}

export function FormularioClinico({
  paciente,
  alEnviar,
  alCancelar,
  estaCargando,
}: FormularioClinicoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioClinicoDataSchema>({
    resolver: zodResolver(formularioClinicoSchema),
    defaultValues: {
      objetivosGenerales:
        paciente?.objetivosGenerales === "No registrado"
          ? ""
          : paciente?.objetivosGenerales || "",
      fisico:
        paciente?.fisico === "No registrado" ? "" : paciente?.fisico || "",
      emocional:
        paciente?.emocional === "No registrado"
          ? ""
          : paciente?.emocional || "",
      cognitivo:
        paciente?.cognitivo === "No registrado"
          ? ""
          : paciente?.cognitivo || "",
      social:
        paciente?.social === "No registrado" ? "" : paciente?.social || "",
      metodosAUsar:
        paciente?.metodosAUsar === "No registrado"
          ? ""
          : paciente?.metodosAUsar || "",
      notas: paciente?.notas === "No registrado" ? "" : paciente?.notas || "",
    },
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(alEnviar)}>
      <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-200 dark:border-amber-500/10 flex items-start gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
            Paciente: {paciente?.name || paciente?.nombre}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500/80">
            Por favor, completa los objetivos y el perfil clínico para finalizar
            el registro.
          </p>
        </div>
      </div>

      <TextAreaField
        label="Objetivos Generales"
        rows={2}
        placeholder="Ej. Mejorar la comunicación verbal..."
        error={errors.objetivosGenerales?.message}
        {...register("objetivosGenerales")}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <InputField
          label="Perfil Físico"
          placeholder="Ej. Sin limitaciones..."
          error={errors.fisico?.message}
          {...register("fisico")}
        />
        <InputField
          label="Perfil Emocional"
          placeholder="Ej. Estable..."
          error={errors.emocional?.message}
          {...register("emocional")}
        />
        <InputField
          label="Perfil Cognitivo"
          placeholder="Ej. Acorde a edad..."
          error={errors.cognitivo?.message}
          {...register("cognitivo")}
        />
        <InputField
          label="Perfil Social"
          placeholder="Ej. Introvertido..."
          error={errors.social?.message}
          {...register("social")}
        />
      </div>

      <InputField
        label="Métodos a Usar"
        placeholder="Ej. Musicoterapia Creativa..."
        error={errors.metodosAUsar?.message}
        {...register("metodosAUsar")}
      />

      <TextAreaField
        label="Notas Adicionales"
        rows={3}
        placeholder="Observaciones importantes..."
        {...register("notas")}
      />

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={alCancelar}
          className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Más tarde
        </button>
        <button
          type="submit"
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
        >
          Guardar Registro Clínico
        </button>
      </div>
    </form>
  );
}
