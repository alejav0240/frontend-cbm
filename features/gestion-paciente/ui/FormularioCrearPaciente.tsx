"use client";

import React, { useMemo, useRef } from "react";
import { Camera, X, Upload, AlertCircle, Loader2, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaPaciente, DatosFormularioPaciente } from "@/entities/paciente";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface FormularioCrearPacienteProps {
  alEnviar: (datos: any) => void;
  alCancelar: () => void;
  estaCreando?: boolean;
}

export const FormularioCrearPaciente = ({
  alEnviar,
  alCancelar,
  estaCreando = false,
}: FormularioCrearPacienteProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DatosFormularioPaciente>({
    resolver: zodResolver(esquemaPaciente),
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

  const fechaNacimiento = watch("dob");
  const seleccionadoDia = watch("selectedDay");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [vistaPreviaFoto, setVistaPreviaFoto] = React.useState<string | null>(null);

  const edad = useMemo(() => {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalculada--;
    }
    return edadCalculada;
  }, [fechaNacimiento]);

  const manejarCambioFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setVistaPreviaFoto(url);
      setValue("photo", archivo as any);
    }
  };

  const eliminarFoto = () => {
    setValue("photo", null);
    setVistaPreviaFoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(alEnviar)}>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombres</label>
          <input
            type="text"
            {...register("firstName")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 outline-none transition-all text-sm dark:text-white ${errors.firstName ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. Juan"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Apellidos</label>
          <input
            type="text"
            {...register("lastName")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 outline-none transition-all text-sm dark:text-white ${errors.lastName ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. Pérez"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha de Nacimiento</label>
          <input
            type="date"
            {...register("dob")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 outline-none transition-all text-sm dark:text-white ${errors.dob ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Edad (Auto)</label>
          <input
            type="text"
            readOnly
            value={edad !== null ? `${edad} años` : ""}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 rounded-xl border-transparent outline-none text-sm dark:text-white cursor-not-allowed"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Carnet / ID</label>
          <input
            type="text"
            {...register("idCard")}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 outline-none transition-all text-sm dark:text-white ${errors.idCard ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
            placeholder="Ej. 1234567"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fotografía</label>
          <input type="file" ref={fileInputRef} onChange={manejarCambioFoto} accept="image/*" className="hidden" />
          {vistaPreviaFoto ? (
            <div className="relative w-full h-12 rounded-xl overflow-hidden group">
              <Image src={vistaPreviaFoto} alt="Vista previa" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 bg-white/20 rounded-lg text-white">
                  <Camera size={14} />
                </button>
                <button type="button" onClick={eliminarFoto} className="p-1.5 bg-red-500/50 rounded-lg text-white">
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-3 text-center hover:border-[#008080] cursor-pointer">
              <Upload size={14} className="inline mr-2 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subir Foto</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={alCancelar} disabled={estaCreando} className="px-6 py-3 rounded-2xl font-bold text-gray-500">
          Cancelar
        </button>
        <button type="submit" disabled={estaCreando} className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-70 flex items-center gap-2">
          {estaCreando ? <Loader2 className="animate-spin" size={18} /> : "Crear Cliente"}
        </button>
      </div>
    </form>
  );
};
