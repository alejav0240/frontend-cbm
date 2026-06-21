"use client";

import React from "react";
import { Heart, ShieldCheck, Mail } from "lucide-react";

export const PortalFamiliarPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Portal Familiar</h1>
        <p className="text-gray-400 text-sm">
          Espacio de comunicación y reportes para los tutores de los pacientes
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mx-auto mb-6">
          <Heart size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">
          Portal para Familias
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Estamos diseñando una interfaz segura para que los padres puedan ver
          el progreso y descargar informes.
        </p>
      </div>
    </div>
  );
};
