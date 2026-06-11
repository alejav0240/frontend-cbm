"use client";

import React from "react";
import { FileSearch, Plus, Layout, FormInput, Database } from "lucide-react";

export const FormulariosPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Constructor de Formularios</h1>
          <p className="text-gray-400 text-sm">Gestiona los campos y plantillas de registro clínico</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus size={18} />
          Crear Plantilla
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: <Layout />, title: "Registro Inicial", count: "12 campos", status: "Activo" },
          { icon: <FormInput />, title: "Evaluación MLT", count: "45 campos", status: "Activo" },
          { icon: <Database />, title: "Ficha Familiar", count: "20 campos", status: "Borrador" },
        ].map((form, idx) => (
          <div key={idx} className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 hover:border-[#008080] transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                {form.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                form.status === "Activo" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
              }`}>
                {form.status}
              </span>
            </div>
            <h3 className="text-lg font-bold dark:text-white mb-1">{form.title}</h3>
            <p className="text-sm text-gray-400">{form.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
