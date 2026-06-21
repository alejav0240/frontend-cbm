"use client";

import React from "react";
import { Brain } from "lucide-react";

export function NoData() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 mb-6">
        <Brain size={40} />
      </div>
      <h3 className="text-lg font-bold dark:text-white mb-2">
        Sin Análisis de IA
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Aún no se han procesado videos de sesiones para este paciente.
      </p>
    </div>
  );
}
