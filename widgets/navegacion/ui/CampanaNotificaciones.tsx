"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { NotificationItem } from "@/shared/ui/components/NotificationItem";
import {
  useMarcarNotificacionLeida,
  useNotificaciones,
} from "@/entities/notificacion";
import type { Notificacion } from "@/entities/notificacion";

const tiempoRelativo = (iso: unknown): string => {
  const fecha = new Date(String(iso));
  if (Number.isNaN(fecha.getTime())) return "";
  const diff = Date.now() - fecha.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} d`;
};

const esFallo = (n: Notificacion): boolean => n.tipo === "subida_fallo";

const tituloPara = (n: Notificacion): string => {
  if (n.tipo === "subida_exitosa") return "Sesión subida";
  if (esFallo(n)) return "Error de subida";
  return "Notificación";
};

const iconoColorPara = (n: Notificacion): string =>
  esFallo(n)
    ? "bg-red-500/10 text-red-500"
    : "bg-[#008080]/10 text-[#008080]";

const metadatosDe = (n: Notificacion): { jobId?: string; sessionId?: string } => {
  if (!n.metadatos || typeof n.metadatos !== "object") return {};
  return n.metadatos as { jobId?: string; sessionId?: string };
};

export function CampanaNotificaciones() {
  const [abierto, setAbierto] = useState(false);
  const { notificaciones, noLeidas, cargando, refetch } = useNotificaciones();
  const { marcarLeida } = useMarcarNotificacionLeida();
  const panelRef = useRef<HTMLDivElement>(null);
  const vistosRef = useRef<Set<string>>(new Set());
  const primerCargaRef = useRef(true);
  const [reintentando, setReintentando] = useState<string | null>(null);

  const reintentar = useCallback(async (n: Notificacion) => {
    const metadatos = metadatosDe(n);
    if (reintentando) return;
    setReintentando(n.id);
    try {
      const response = await fetch("/api/upload/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          metadatos.jobId ? { jobId: metadatos.jobId } : { sessionId: metadatos.sessionId },
        ),
      });
      const data = (await response.json()) as { success?: boolean };
      if (!response.ok || !data.success) {
        throw new Error("No se pudo reintentar");
      }
      toast.success("Reintentando la subida de la grabación…");
    } catch {
      toast.error(
        "No se pudo reintentar ahora. Probá nuevamente en unos minutos.",
      );
    } finally {
      setReintentando(null);
    }
  }, [reintentando]);

  useEffect(() => {
    if (primerCargaRef.current) {
      for (const n of notificaciones) {
        vistosRef.current.add(n.id);
      }
      primerCargaRef.current = false;
      return;
    }

    for (const n of notificaciones) {
      if (vistosRef.current.has(n.id)) continue;
      vistosRef.current.add(n.id);
      if (n.tipo === "subida_exitosa") {
        toast.success(n.message);
      } else if (esFallo(n)) {
        toast.error(n.message, {
          action: metadatosDe(n).jobId
            ? {
                label: "Reintentar",
                onClick: () => {
                  void reintentar(n);
                },
              }
            : undefined,
        });
      }
    }
  }, [notificaciones, reintentar]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const marcarTodasLeidas = async () => {
    const noLeidasList = notificaciones.filter((n) => !n.isRead);
    for (const n of noLeidasList) {
      try {
        await marcarLeida(n.id);
      } catch {}
    }
    void refetch();
  };

  const abrirPanel = () => {
    setAbierto((prev) => !prev);
    if (!abierto && noLeidas > 0) {
      void marcarTodasLeidas();
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={abrirPanel}
        className="relative p-3 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 rounded-2xl transition-all"
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {noLeidas > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {noLeidas > 99 ? "99+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          className="absolute right-0 top-full mt-2 w-80 md:w-96 max-h-[28rem] overflow-y-auto bg-white dark:bg-accent border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 z-50"
        >
          <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white dark:bg-accent z-10">
            <p className="text-sm font-bold dark:text-white">
              Notificaciones
            </p>
            {noLeidas > 0 && (
              <button
                onClick={() => void marcarTodasLeidas()}
                className="text-[11px] font-bold text-[#008080] hover:underline flex items-center gap-1"
              >
                <CheckCheck size={14} /> Marcar todas como leídas
              </button>
            )}
          </div>

          {cargando && notificaciones.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : notificaciones.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              Sin notificaciones
            </p>
          ) : (
            notificaciones.map((n) => (
              <NotificationItem
                key={n.id}
                icon={<Bell size={18} />}
                title={tituloPara(n)}
                desc={n.message}
                time={tiempoRelativo(n.createdAt)}
                color={iconoColorPara(n)}
                isRead={n.isRead}
                acciones={
                  esFallo(n) ? (
                    <button
                      onClick={() => void reintentar(n)}
                      disabled={reintentando !== null}
                      className="flex items-center gap-1.5 rounded-lg bg-[#008080] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#006666] transition-colors disabled:opacity-60"
                    >
                      {reintentando === n.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <RefreshCw size={12} />
                      )}
                      Reintentar subida
                    </button>
                  ) : undefined
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
