"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Palette,
  Save,
  CloudUpload,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PermissionGuard } from "@/shared/ui/components/PermissionGuard";

type OneDriveStatus = {
  connected: boolean;
  user_email?: string;
  error?: string;
};

const TarjetaOneDrive = () => {
  const [cargando, setCargando] = useState(true);
  const [status, setStatus] = useState<OneDriveStatus | null>(null);

  useEffect(() => {
    let activo = true;
    void (async () => {
      try {
        const response = await fetch("/api/onedrive/status", {
          cache: "no-store",
        });
        const data = (await response.json()) as OneDriveStatus;
        if (activo) setStatus(data);
      } catch {
        if (activo) setStatus({ connected: false, error: "backend_inaccesible" });
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  const conectar = () => {
    window.location.href = "/api/onedrive/connect";
  };

  const conectado = status?.connected === true;

  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5">
      <h3 className="text-lg font-bold dark:text-white mb-1">
        Almacenamiento de grabaciones (OneDrive)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Las grabaciones de sesión se suben a la cuenta de OneDrive conectada.
        Solo el administrador puede configurarla.
      </p>

      <div className="flex items-center gap-3 mb-6 text-sm">
        {cargando ? (
          <>
            <Loader2 size={18} className="animate-spin text-gray-400" />
            <span className="text-gray-400">Consultando estado...</span>
          </>
        ) : conectado ? (
          <>
            <CheckCircle2 size={18} className="text-green-500" />
            <span className="text-green-600 dark:text-green-400">
              Conectado a OneDrive
            </span>
            {status?.user_email && (
              <span className="text-gray-400">{status.user_email}</span>
            )}
          </>
        ) : (
          <>
            <AlertCircle size={18} className="text-amber-500" />
            <span className="text-amber-600 dark:text-amber-400">
              No conectado. Las grabaciones se guardarán en Cloudflare R2.
            </span>
          </>
        )}
      </div>

      <button
        onClick={conectar}
        disabled={cargando}
        className="flex items-center gap-2 px-6 py-3 bg-[#008080] text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-60"
      >
        <CloudUpload size={18} />
        {conectado ? "Reconectar OneDrive" : "Conectar OneDrive"}
      </button>
    </div>
  );
};

export const AjustesPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">
          Ajustes del Sistema
        </h1>
        <p className="text-gray-400 text-sm">
          Configura las preferencias globales y parámetros del centro
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {[
            { icon: <Settings size={18} />, label: "General", active: true },
            {
              icon: <Bell size={18} />,
              label: "Notificaciones",
              active: false,
            },
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
            <h3 className="text-lg font-bold dark:text-white mb-6">
              Información del Centro
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Nombre del Centro
                  </label>
                  <input
                    type="text"
                    defaultValue="Musicoterapia Centro Integral"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:border-[#008080] outline-none text-sm dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    defaultValue="contacto@centro.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:border-[#008080] outline-none text-sm dark:text-white"
                  />
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

          <PermissionGuard permission="ajustes">
            <TarjetaOneDrive />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};
