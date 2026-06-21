"use client";

import React from "react";
import { PacienteDetalleSerializado } from "@/entities/paciente";

interface InfoItemProps {
  label: string;
  value?: string | number;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm dark:text-white font-medium">
        {value || "No registrado"}
      </p>
    </div>
  );
}

interface GeneralInfoProps {
  patient: PacienteDetalleSerializado;
}

export function InformacionGeneral({ patient }: GeneralInfoProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm space-y-6">
      <h2 className="text-lg font-bold dark:text-white serif">
        Información General
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <InfoItem
          label="Residencia Actual"
          value={patient?.residenciaActual ?? "Sin Residencia"}
        />
        <InfoItem
          label="Diagnóstico"
          value={patient?.diagnostico ?? "Sin Diagnostico"}
        />
        <InfoItem
          label="Tipo de Tratamiento"
          value={patient?.tipoTratamiento ?? "Sin Tipo de Tratamiento"}
        />
        <InfoItem
          label="Duración"
          value={patient?.duracion ?? "Sin Duracion"}
        />
        <InfoItem label="Tutor" value={patient?.tutor ?? "Sin Tutor"} />
        <InfoItem
          label="Frecuencia"
          value={patient?.frecuenciaSesiones ?? "Sin Frecuencia"}
        />
      </div>
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
        <InfoItem
          label="Objetivos Generales"
          value={patient?.objetivosGenerales ?? "Sin Objetivos"}
        />
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Físico" value={patient?.fisico ?? "Sin Fisico"} />
          <InfoItem
            label="Emocional"
            value={patient?.emocional ?? "Sin Emocional"}
          />
          <InfoItem
            label="Cognitivo"
            value={patient?.cognitivo ?? "Sin Cognitivo"}
          />
          <InfoItem label="Social" value={patient?.social ?? "Sin Social"} />
        </div>
        <InfoItem
          label="Métodos a Usar"
          value={patient?.metodosAUsar ?? "Sin Metodos"}
        />
        <InfoItem label="Notas" value={patient?.notas ?? "Sin Notas"} />
      </div>
    </div>
  );
}
