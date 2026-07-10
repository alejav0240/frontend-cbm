"use client";

import React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Video,
  Music,
  Image,
  FileSpreadsheet,
  Globe,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Pagination } from "@/shared/ui/Pagination";
import { PermissionGuard } from "@/shared/ui/components/PermissionGuard";
import { RecursoDigital } from "@/entities/recurso";

interface TablaRecursosProps {
  recursos: RecursoDigital[];
  alEditar: (recurso: RecursoDigital) => void;
  alEliminar: (id: string) => void;
  alAbrirEnlace: (url: string) => void;
  totalPaginas: number;
  paginaActual: number;
  alCambiarPagina: (page: number) => void;
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "VIDEO":
      return <Video size={18} />;
    case "AUDIO":
      return <Music size={18} />;
    case "IMAGE":
      return <Image size={18} />;
    case "SHEET_MUSIC":
      return <FileSpreadsheet size={18} />;
    case "WEB_LINK":
      return <Globe size={18} />;
    default:
      return <FileText size={18} />;
  }
};

const getTipoColors = (tipo: string) => {
  switch (tipo) {
    case "VIDEO":
      return "bg-blue-500/10 text-blue-500";
    case "AUDIO":
      return "bg-purple-500/10 text-purple-500";
    case "IMAGE":
      return "bg-pink-500/10 text-pink-500";
    case "SHEET_MUSIC":
      return "bg-amber-500/10 text-amber-500";
    case "WEB_LINK":
      return "bg-green-500/10 text-green-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export const TablaRecursos = ({
  recursos,
  alEditar,
  alEliminar,
  alAbrirEnlace,
  totalPaginas,
  paginaActual,
  alCambiarPagina,
}: TablaRecursosProps) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Tipo
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Título
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Categoría
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                URL
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {recursos.map((recurso, idx) => (
              <motion.tr
                key={recurso.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${getTipoColors(recurso.tipo)}`}
                  >
                    {getTipoIcon(recurso.tipo)}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors line-clamp-1">
                    {recurso.titulo}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    {recurso.tipoMostrado}
                  </p>
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400">
                  {recurso.categoria}
                </td>
                <td className="px-8 py-5">
                  <a
                    href={recurso.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#008080] hover:underline line-clamp-1 max-w-[200px] block"
                  >
                    {recurso.url}
                  </a>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => alAbrirEnlace(recurso.url)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
                      title="Abrir enlace"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <PermissionGuard permission="recursos:change">
                      <button
                        onClick={() => alEditar(recurso)}
                        className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission="recursos:delete">
                      <button
                        onClick={() => alEliminar(recurso.id)}
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
