"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Clock, Loader2, User } from "lucide-react";
import { esquemaCita, DatosCita } from "../../model/esquema-cita";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { usePacientes } from "@/entities/paciente";
import { useUsuarios } from "@/entities/usuario";
import { SesionAgenda } from "@/entities/sesion/model/tipos-agenda";
import { toast } from "sonner";

type FormMode = "create" | "edit" | "reschedule";

interface FormNuevaCitaProps {
  defaultDate?: string;
  defaultHour?: number;
  onClose: () => void;
  onSubmit: (data: DatosCita) => Promise<void>;
  editingSession?: SesionAgenda;
  mode?: FormMode;
}

function parseTimeToHHMM(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return "09:00";
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = match[3]?.toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m}`;
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 45;
}

export function FormNuevaCita({
  defaultDate,
  defaultHour,
  onClose,
  onSubmit,
  editingSession,
  mode = "create",
}: FormNuevaCitaProps) {
  const isEditing = mode !== "create";
  const esReagenda = mode === "reschedule";
  const today = new Date().toISOString().split("T")[0];
  const defaultTime =
    defaultHour !== undefined
      ? `${String(defaultHour).padStart(2, "0")}:00`
      : editingSession
        ? parseTimeToHHMM(editingSession.time)
        : "09:00";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DatosCita>({
    resolver: zodResolver(esquemaCita),
    defaultValues: {
      patientId: editingSession?.patientId || "",
      therapistId: editingSession?.therapistId || "",
      sessionDate: defaultDate || editingSession?.date || today,
      sessionTime: defaultTime,
      sessionType: editingSession?.type || "INDIVIDUAL",
      durationMinutes:
        editingSession?.durationMinutes ||
        parseDuration(editingSession?.duration || "") ||
        45,
      notes: editingSession?.notes || "",
    },
  });

  const [searchPaciente, setSearchPaciente] = useState(
    editingSession?.patientName || "",
  );
  const { pacientes, cargando: cargandoP } = usePacientes({
    search: searchPaciente || "",
    pageSize: 20,
  });
  const { usuarios: terapeutas, cargando: cargandoT } = useUsuarios({
    pagina: 1,
    pageSize: 50,
    nombreRol: "TERAPEUTA",
  });

  const pacientesOpciones = pacientes.map((p) => ({
    value: p.id,
    label: `${p.nombre} — ${p.cedula || "Sin CI"}`,
  }));

  const terapeutasOpciones = terapeutas
    .filter((t): t is { id: string; fullName: string } & typeof t =>
      Boolean(t.id && t.fullName),
    )
    .map((t) => ({
      value: t.id,
      label: t.fullName,
    }));

  useEffect(() => {
    if (!editingSession?.therapistId || terapeutas.length === 0) return;
    const found = terapeutas.find((t) => t.id === editingSession.therapistId);
    if (found) {
      setValue("therapistId", editingSession.therapistId, {
        shouldValidate: true,
      });
    }
  }, [editingSession?.therapistId, terapeutas, setValue]);

  const pacienteDeshabilitado = (isEditing && !esReagenda) || esReagenda;
  const terapeutaDeshabilitado = isEditing && !esReagenda;

  const handleFormSubmit = async (data: DatosCita) => {
    try {
      const dateTime = `${data.sessionDate}T${data.sessionTime}:00`;
      await onSubmit({ ...data, sessionDate: dateTime });
    } catch {
      toast.error(
        isEditing ? "Error al actualizar la cita" : "Error al crear la cita",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Paciente
        </label>
        {pacienteDeshabilitado ? (
          <div className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl text-sm dark:text-white font-medium">
            {editingSession?.patientName || "Sin paciente"}
          </div>
        ) : (
          <SearchableSelect
            options={pacientesOpciones}
            value={watch("patientId")}
            onChange={(val) =>
              setValue("patientId", val, { shouldValidate: true })
            }
            placeholder="Buscar paciente..."
            onSearch={setSearchPaciente}
            isLoading={cargandoP}
          />
        )}
        {errors.patientId && (
          <p className="text-xs text-red-500">{errors.patientId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Terapeuta
        </label>
        {terapeutaDeshabilitado ? (
          <div className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl text-sm dark:text-white font-medium">
            {editingSession?.therapist || "Sin terapeuta"}
          </div>
        ) : (
          <SearchableSelect
            options={terapeutasOpciones}
            value={watch("therapistId")}
            onChange={(val) =>
              setValue("therapistId", val, { shouldValidate: true })
            }
            placeholder="Seleccionar terapeuta..."
            isLoading={cargandoT}
          />
        )}
        {errors.therapistId && (
          <p className="text-xs text-red-500">{errors.therapistId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              {...register("sessionDate")}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
          {errors.sessionDate && (
            <p className="text-xs text-red-500">{errors.sessionDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Hora
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="time"
              {...register("sessionTime")}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
          {errors.sessionTime && (
            <p className="text-xs text-red-500">{errors.sessionTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Tipo de Sesión
          </label>
          <select
            {...register("sessionType")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="GROUP">Grupal</option>
          </select>
          {errors.sessionType && (
            <p className="text-xs text-red-500">{errors.sessionType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Duración (min)
          </label>
          <input
            type="number"
            {...register("durationMinutes", { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
          {errors.durationMinutes && (
            <p className="text-xs text-red-500">
              {errors.durationMinutes.message}
            </p>
          )}
        </div>
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
          disabled={isSubmitting}
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Guardar Cambios" : "Crear Cita"}
        </button>
      </div>
    </form>
  );
}
