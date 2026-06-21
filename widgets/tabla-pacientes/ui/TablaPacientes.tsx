"use client";

import React from "react";
import { motion } from "motion/react";
import { FileSearch, Trash2, ClipboardCheck, AlertCircle } from "lucide-react";
import Image from "next/image";
import { differenceInYears } from "date-fns";
import { PermissionGuard } from "@/shared/ui/components/PermissionGuard";
import { PacienteNormalizado } from "@/entities/paciente";
import { Pagination } from "@/shared/ui/Pagination";

interface TablaPacientesProps {
  pacientes: PacienteNormalizado[];
  alVerPerfil: (id: string, nombre: string) => void;
  alEliminar: (id: string) => void;
  alCompletarClinico: (paciente: PacienteNormalizado) => void;
  paginaActual: number;
  totalPaginas: number;
  alCambiarPagina: (page: number) => void;
}

export const TablaPacientes = ({
  pacientes,
  alVerPerfil,
  alEliminar,
  alCompletarClinico,
  paginaActual,
  totalPaginas,
  alCambiarPagina,
}: TablaPacientesProps) => {
  console.log(pacientes);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Cliente
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                ID / Carnet
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Edad
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Tutor
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Estado
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {pacientes.map((paciente, idx) => (
              <motion.tr
                key={paciente.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] font-bold text-lg shadow-inner relative overflow-hidden">
                      {paciente.imageUrl ? (
                        <Image
                          src={paciente.imageUrl}
                          alt={paciente.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        paciente.nombre?.charAt(0) || "?"
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                          {paciente.nombre}
                        </p>
                        {paciente.registrationComplete === false && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 text-[9px] font-bold rounded-full uppercase tracking-tighter">
                            <AlertCircle size={10} />
                            Nuevo / Incompleto
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {paciente?.createdAt
                          ? new Intl.DateTimeFormat("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(paciente.createdAt))
                          : "Sin fecha"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-mono text-gray-500 dark:text-gray-400">
                  {paciente.ci || "1234567"}
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {paciente?.birthDate
                    ? differenceInYears(
                        new Date(),
                        new Date(paciente.birthDate),
                      )
                    : 0}{" "}
                  años
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400">
                  {paciente.tutor?.firstName || "N/A"}
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {paciente?.tutor?.celular
                      ? `+591 ${paciente.tutor.celular}`
                      : "Sin Celular"}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      paciente.status === "Activo"
                        ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                        : paciente.status === "Inactivo"
                          ? "bg-red-100 text-red-600 dark:bg-red-500/10"
                          : paciente.status === "Alta"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-500/10"
                    }`}
                  >
                    {paciente.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    {paciente.registrationComplete === false && (
                      <button
                        onClick={() => alCompletarClinico(paciente)}
                        className="p-2.5 bg-amber-50 dark:bg-amber-500/5 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 transition-all"
                        title="Completar Registro Clínico"
                      >
                        <ClipboardCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => alVerPerfil(paciente.id, paciente.nombre)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
                      title="Ver Perfil Clínico"
                    >
                      <FileSearch size={18} />
                    </button>

                    <PermissionGuard permission="pacientes:delete">
                      <button
                        onClick={() => alEliminar(String(paciente.databaseId))}
                        className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </PermissionGuard>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={alCambiarPagina}
      />
    </>
  );
};
