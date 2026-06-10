"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { appointmentSchema } from "@/modules/atencion/agenda/schemas/schema";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  patientOptions: { label: string; value: string }[];
  therapists: { label: string; value: string }[];
  onSearchTherapist?: (term: string) => void;
  isLoadingTherapists?: boolean;
  initialData?: any;
}

export function AppointmentForm({
  isOpen,
  onClose,
  onSubmit,
  patientOptions,
  therapists,
  onSearchTherapist,
  isLoadingTherapists,
  initialData,
}: AppointmentFormProps) {
  const [patient, setPatient] = useState("");
  const [therapist, setTherapist] = useState(
    initialData?.therapistId || therapists[0]?.value || "",
  );
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState("Individual");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patientId || "");
      setTherapist(initialData.therapistId || therapists[0]?.value || "");
      setDate(initialData.date || new Date().toISOString().split("T")[0]);

      if (initialData.time) {
        // Extract time without AM/PM for the input if it's in "HH:MM AM/PM" format
        const timeParts = initialData.time.split(" ");
        if (timeParts.length > 1) {
          const [h, m] = timeParts[0].split(":");
          let hour = parseInt(h);
          if (timeParts[1] === "PM" && hour !== 12) hour += 12;
          if (timeParts[1] === "AM" && hour === 12) hour = 0;
          setTime(`${hour.toString().padStart(2, "0")}:${m}`);
        } else {
          setTime(initialData.time);
        }
      }

      setType(initialData.type || "Individual");
    } else {
      // Reset to defaults if no initialData
      setPatient("");
      setTherapist(therapists[0]?.value || "");
      setTime("09:00");
      setType("Individual");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [initialData, therapists, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      patient,
      therapist,
      time,
      type,
      date,
    };

    try {
      appointmentSchema.parse({
        patientName: patient,
        therapist,
        time,
        type,
        date,
      });
      setErrors({});
      onSubmit({
        ...formData,
        id: initialData?.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Reprogramar Cita" : "Programar Nueva Cita"}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <SearchableSelect
              label="Paciente"
              options={patientOptions}
              value={patient}
              onChange={setPatient}
            />
            {errors.patientName && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={10} /> {errors.patientName}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <SearchableSelect
              label="Terapeuta"
              options={therapists}
              value={therapist}
              onChange={setTherapist}
              onSearch={onSearchTherapist}
              isLoading={isLoadingTherapists}
            />
            {errors.therapist && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={10} /> {errors.therapist}
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
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.date ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            />
            {errors.date && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={10} /> {errors.date}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hora
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.time ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            />
            {errors.time && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={10} /> {errors.time}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <SearchableSelect
              label="Tipo"
              options={["Individual", "Grupal", "Evaluación", "Rehabilitación"]}
              value={type}
              onChange={setType}
            />
            {errors.type && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={10} /> {errors.type}
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
            {initialData ? "Guardar Cambios" : "Programar Cita"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
