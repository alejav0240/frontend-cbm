"use client";

import { useRouter } from "next/navigation";
import { useExpedientes } from "@/entities/expediente";
import { Search, Loader2, Stethoscope, AlertCircle } from "lucide-react";
import { Pagination } from "@/shared/ui/Pagination";
import { ExpedientesHeader } from "./components/ExpedientesHeader";
import { ExpedienteCard } from "./components/ExpedienteCard";

export const ExpedientesPage = () => {
  const router = useRouter();
  const {
    expedientes,
    total,
    totalPages,
    currentPage,
    cargando,
    error,
    search,
    setSearch,
    setPage,
  } = useExpedientes();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-gray-500">Error al cargar expedientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ExpedientesHeader />

      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente por nombre..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
        />
      </div>

      {cargando ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-[#008080]" size={36} />
        </div>
      ) : expedientes.length === 0 ? (
        <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-6">
            <Stethoscope size={40} />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            {search ? "Sin resultados" : "Visor de Expedientes en Desarrollo"}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {search
              ? `No se encontraron pacientes que coincidan con "${search}"`
              : "Pronto podrás navegar por la línea de tiempo clínica de cada paciente de forma interactiva."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} paciente{total !== 1 ? "s" : ""} en total
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expedientes.map((exp, idx) => (
              <ExpedienteCard
                key={exp.id}
                expediente={exp}
                index={idx}
                onClick={() =>
                  router.push(
                    `/dashboard/expedientes/${encodeURIComponent(exp.patientId)}`,
                  )
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};
