"use client";

import React, { useMemo, useRef } from "react";
import {
  TrendingUp,
  Camera,
  X,
  Upload,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import {
  patientSchema,
  PatientFormData,
} from "@/modules/atencion/pacientes/schemas/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface CreatePatientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isAdding?: boolean;
}

export default function CreatePatientForm({
  onSubmit,
  onCancel,
  isAdding = false,
}: CreatePatientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      selectedDay: "Lunes",
      selectedTime: "09:00",
      contactEmail: "",
      tutor: "",
      ciTutor: "",
      tutorPhone: "",
      residenciaActual: "",
      diagnostico: "",
      photo: null,
    },
  });

  const dob = watch("dob");
  const photo = watch("photo");
  const selectedDay = watch("selectedDay");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For preview
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);

      // Store the file object in the form
      setValue("photo", file as any);
    }
  };

  const removePhoto = () => {
    setValue("photo", null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clean up object URL to avoid memory leaks
  React.useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const age = useMemo(() => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [dob]);

  const onFormSubmit = (data: PatientFormData) => {
    onSubmit({ ...data, age });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombres
          </label>
          <input
            type="text"
            {...register("firstName")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.firstName ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. Juan"
          />
          {errors.firstName && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Apellidos
          </label>
          <input
            type="text"
            {...register("lastName")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.lastName ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. Pérez"
          />
          {errors.lastName && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            {...register("dob")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.dob ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
          />
          {errors.dob && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.dob.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Edad (Auto)
          </label>
          <input
            type="text"
            readOnly
            value={age !== null ? `${age} años` : ""}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 rounded-xl border-transparent outline-none text-sm dark:text-white cursor-not-allowed"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Carnet / ID Paciente
          </label>
          <input
            type="text"
            {...register("idCard")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.idCard ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. 1234567"
          />
          {errors.idCard && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.idCard.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fotografía
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            className="hidden"
          />
          {photoPreview ? (
            <div className="relative w-full h-12 rounded-xl overflow-hidden group">
              <Image
                src={photoPreview}
                alt="Vista previa"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-all"
                >
                  <Camera size={14} />
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="p-1.5 bg-red-500/50 hover:bg-red-500/80 rounded-lg text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-3 text-center hover:border-[#008080] hover:bg-[#008080]/5 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-2">
                <Upload
                  size={14}
                  className="text-gray-400 group-hover:text-[#008080] transition-colors"
                />
                <p className="text-[10px] font-bold text-gray-400 group-hover:text-[#008080] uppercase tracking-widest transition-colors">
                  Subir Foto
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Tutor / Responsable Legal
          </label>
          <input
            type="text"
            {...register("tutor")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. María Pérez (Madre)"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Carnet del Tutor
          </label>
          <input
            type="text"
            {...register("ciTutor")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.ciTutor ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. 7654321"
          />
          {errors.ciTutor && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.ciTutor.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Teléfono del Tutor
          </label>
          <input
            type="tel"
            {...register("tutorPhone")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. 70012345"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Email del Tutor
          </label>
          <input
            type="email"
            {...register("contactEmail")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.contactEmail ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. contacto@ejemplo.com"
          />
          {errors.contactEmail && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.contactEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Residencia Actual
          </label>
          <input
            type="text"
            {...register("residenciaActual")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. Zona Norte, Terminal"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Diagnóstico
          </label>
          <input
            type="text"
            {...register("diagnostico")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. TEA 2, TDAH"
          />
        </div>
      </div>

      <div className="p-6 bg-[#008080]/5 rounded-[32px] border border-[#008080]/10 space-y-6">
        <h3 className="text-sm font-bold text-[#008080] uppercase tracking-widest flex items-center gap-2">
          <TrendingUp size={16} />
          Programación de Primer Ciclo (4 Sesiones)
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <SearchableSelect
            label="Día de la Semana"
            options={[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ]}
            value={selectedDay}
            onChange={(val) => setValue("selectedDay", val)}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Horario de Inicio
            </label>
            <input
              type="time"
              {...register("selectedTime")}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.selectedTime ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            />
            {errors.selectedTime && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertCircle size={10} /> {errors.selectedTime.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isAdding}
          className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isAdding}
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAdding ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creando...
            </>
          ) : (
            "Crear Cliente"
          )}
        </button>
      </div>
    </form>
  );
}
