"use client";

import React from "react";
import { Settings, Bell, Lock, Globe, Palette, Save } from "lucide-react";

export const AjustesPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Ajustes del Sistema</h1>
        <p className="text-gray-400 text-sm">Configura las preferencias globales y parámetros del centro</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {[
            { icon: <Settings size={18} />, label: "General", active: true },
            { icon: <Bell size={18} />, label: "Notificaciones", active: false },
            { icon: <Lock size={18} />, label: "Seguridad", active: false },
            { icon: <Palette size={18} />, label: "Apariencia", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active 
                  ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20" 
                  : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-bold dark:text-white mb-6">Información del Centro</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Centro</label>
                  <input type="text" defaultValue="Musicoterapia Centro Integral" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:border-[#008080] outline-none text-sm dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email de Contacto</label>
                  <input type="email" defaultValue="contacto@centro.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:border-[#008080] outline-none text-sm dark:text-white" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#008080] text-white rounded-xl text-sm font-bold shadow-lg">
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
