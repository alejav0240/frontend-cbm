"use client";

import React from "react";
import {
  Stethoscope,
  ClipboardList,
  ListChecks,
  FileText,
  Target,
} from "lucide-react";

export const ExpedientesPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">
          Expedientes Clínicos
        </h1>
        <p className="text-gray-400 text-sm">
          Consulta la historia clínica completa y centralizada de tus pacientes
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: <ClipboardList />,
            title: "Evaluaciones",
            desc: "Pruebas y diagnósticos iniciales",
          },
          {
            icon: <Target />,
            title: "Planes de Intervención",
            desc: "Objetivos y pasos terapéuticos",
          },
          {
            icon: <FileText />,
            title: "Informes Clínicos",
            desc: "Documentos de evolución y alta",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 hover:border-[#008080] transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] mb-4 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold dark:text-white mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-6">
          <Stethoscope size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">
          Visor de Expedientes en Desarrollo
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Pronto podrás navegar por la línea de tiempo clínica de cada paciente
          de forma interactiva.
        </p>
      </div>
    </div>
  );
};
