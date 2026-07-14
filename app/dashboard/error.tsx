"use client";

import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="text-red-500" size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold dark:text-white">
          Algo salió mal
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Ocurrió un error inesperado. Por favor, intenta de nuevo.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mt-2">
            Error: {error.digest}
          </p>
        )}
      </div>
      <button
        onClick={reset}
        className="px-8 py-3 bg-[#008080] text-white rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20"
      >
        Reintentar
      </button>
    </div>
  );
}
