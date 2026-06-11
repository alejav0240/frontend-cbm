"use client";

import React from "react";
import { useRecursosDigitales } from "@/entities/recurso";
import { FileText, Music, Video, Download, Search, Plus } from "lucide-react";

export const RecursosPage = () => {
  const { recursos, cargando } = useRecursosDigitales({ pagina: 1, pageSize: 12 });

  const getIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "video": return <Video size={20} />;
      case "audio": return <Music size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Recursos Profesionales</h1>
          <p className="text-gray-400 text-sm">Biblioteca de materiales, partituras y guías para terapeutas</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus size={18} />
          Subir Recurso
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recursos.map((recurso) => (
          <div key={recurso.id} className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 hover:border-[#008080] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#008080]/10 group-hover:text-[#008080] transition-all mb-4">
              {getIcon(recurso.tipo)}
            </div>
            <h3 className="text-sm font-bold dark:text-white mb-1 line-clamp-1">{recurso.titulo}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{recurso.categoria}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 dark:bg-white/2 px-2 py-1 rounded-md">
                {recurso.tipoMostrado}
              </span>
              <button className="p-2 text-gray-400 hover:text-[#008080] transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
