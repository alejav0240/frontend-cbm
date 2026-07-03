"use client";

import { useRouter } from "next/navigation";
import { useExpedientes } from "@/entities/expediente";
import { Search, Loader2, Stethoscope, AlertCircle } from "lucide-react";
import { Pagination } from "@/shared/ui/Pagination";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Activo", color: "bg-emerald-500" },
  DISCHARGED: { label: "Alta", color: "bg-blue-500" },
  INACTIVE: { label: "Inactivo", color: "bg-gray-400" },
  PENDING: { label: "Pendiente", color: "bg-amber-500" },
};

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Expedientes Clínicos
          </h1>
          <p className="text-gray-400 text-sm">
            {total} paciente{total !== 1 ? "s" : ""} en total
          </p>
        </div>
      </div>

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
          <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Paciente
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Ciclo
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">
                      Sesiones
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Estado
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">
                      Inicio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expedientes.map((exp) => {
                    const statusInfo = STATUS_MAP[exp.status] ?? {
                      label: exp.status || "Desconocido",
                      color: "bg-gray-400",
                    };
                    return (
                      <tr
                        key={exp.id}
                        onClick={() =>
                          router.push(
                            `/dashboard/expedientes/${encodeURIComponent(exp.patientId)}`,
                          )
                        }
                        className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <span className="font-semibold dark:text-white">
                            {exp.patientName}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">
                          #{exp.cycleNumber}
                        </td>
                        <td className="p-4 text-gray-500 hidden md:table-cell">
                          {exp.completedSessions}/{exp.totalSessions}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              exp.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : exp.status === "DISCHARGED"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : exp.status === "INACTIVE"
                                    ? "bg-gray-500/10 text-gray-500"
                                    : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`}
                            />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm hidden lg:table-cell">
                          {exp.startDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
