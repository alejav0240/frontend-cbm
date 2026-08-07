"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaEvaluacion,
  type DatosFormularioEvaluacion,
} from "@/entities/escalas";
import { EscalaEvaluacion } from "../tipos";

export interface DatosEvaluacionEnviar {
  patientId: string;
  type: string;
  date: string;
  scaleId: string;
  score: number;
  subscaleScores: Record<string, number>;
}

interface EvaluationFormProps {
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
  evaluationScales: EscalaEvaluacion[];
  onSubmit: (data: DatosEvaluacionEnviar) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EvaluationForm({
  patientOptions,
  onSearchPatient,
  evaluationScales,
  onSubmit,
  onCancel,
}: EvaluationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DatosFormularioEvaluacion>({
    resolver: zodResolver(esquemaEvaluacion),
    defaultValues: {
      patientId: "",
      type: "Inicial",
      date: new Date().toISOString().split("T")[0],
      scaleId: "",
    },
  });

  const scaleId = watch("scaleId");
  const currentScale = evaluationScales.find((s) => s.id === String(scaleId));
  const isSubscale =
    (currentScale?.tipoEscala ?? currentScale?.scaleType)?.toLowerCase() ===
    "subscale";

  const [subscaleScores, setSubscaleScores] = useState<Record<string, number>>(
    {},
  );
  const [score, setScore] = useState(0);

  const handleScaleChange = (val: string) => {
    setValue("scaleId", val, { shouldValidate: true });
    setSubscaleScores({});
    setScore(0);
  };

  const handleSubscaleScoreChange = (subId: string, value: number) => {
    const updated = { ...subscaleScores, [subId]: value };
    setSubscaleScores(updated);
    setScore(Object.values(updated).reduce((a, b) => a + b, 0));
  };

  const handleFormSubmit = (data: DatosFormularioEvaluacion) => {
    if (scaleId && !isSubscale) {
      const hasSelectedValue = (currentScale?.valores ?? currentScale?.values)
        ?.some((v) => (v.valor ?? v.value) === score);
      if (!hasSelectedValue) {
        toast.error("Selecciona un valor de la escala");
        return;
      }
    }
    onSubmit({
      ...data,
      score,
      subscaleScores,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Paciente"
              options={patientOptions}
              value={field.value}
              onChange={field.onChange}
              onSearch={onSearchPatient}
              placeholder="Buscar paciente..."
            />
          )}
        />
        {errors.patientId && (
          <p className="text-xs text-red-500">{errors.patientId.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Etapa de Evaluación"
                options={["Inicial", "Seguimiento", "Final"]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha
          </label>
          <input
            type="date"
            {...register("date")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Controller
          name="scaleId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Escala de Evaluación"
              options={evaluationScales.map((scale) => ({
                label: scale.nombre ?? scale.name ?? "",
                value: String(scale.id),
              }))}
              value={field.value}
              onChange={handleScaleChange}
              placeholder="Seleccionar Escala..."
            />
          )}
        />
        {errors.scaleId && (
          <p className="text-xs text-red-500">{errors.scaleId.message}</p>
        )}
      </div>

      {scaleId && (
        <div className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
          {isSubscale ? (
            <>
              <p className="text-xs font-bold text-[#008080] uppercase tracking-widest mb-4">
                Puntuación por Subescalas
              </p>
              <div className="grid gap-4">
                {(currentScale?.subescalas ?? currentScale?.subscales ?? [])?.map(
                  (sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-bold dark:text-white">
                          {sub.nombre ?? sub.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {sub.descripcion ?? sub.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          max={sub.valorMaximo ?? sub.maxValue ?? undefined}
                          min={0}
                          value={subscaleScores[sub.id] || 0}
                          onChange={(e) =>
                            handleSubscaleScoreChange(
                              sub.id,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-20 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border-transparent focus-visible:border-[#008080] outline-none text-xs dark:text-white text-center"
                        />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          / {sub.valorMaximo ?? sub.maxValue}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#008080] uppercase tracking-widest mb-4">
                Seleccionar Valor
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(currentScale?.valores ?? currentScale?.values ?? [])?.map(
                  (val) => (
                    <button
                      key={val.id}
                      type="button"
                      onClick={() =>
                        setScore(val.valor ?? val.value ?? 0)
                      }
                      className={`p-4 rounded-2xl border transition-all text-center ${
                        score === (val.valor ?? val.value)
                          ? "bg-[#008080] text-white border-[#008080] shadow-md"
                          : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-[#008080]"
                      }`}
                    >
                      <p className="text-xl font-bold mb-1">
                        {val.valor ?? val.value}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        {val.etiqueta ?? val.label}
                      </p>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200 dark:border-white/5 flex justify-between items-center">
            <span className="text-sm font-bold dark:text-white">
              Puntaje Total:
            </span>
            <span className="text-xl font-bold text-[#008080]">
              {score}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
        >
          Registrar Evaluación
        </button>
      </div>
    </form>
  );
}
