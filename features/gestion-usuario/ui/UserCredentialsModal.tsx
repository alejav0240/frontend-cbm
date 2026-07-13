"use client";

import React, { useCallback, useState } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Usuario } from "@/entities/usuario";
import { toast } from "sonner";

interface UserCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario | null;
  showPassword: boolean;
  onTogglePassword: () => void;
  password?: string;
}

function CopyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copiado al portapapeles`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar");
    }
  }, [value, label]);

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-stretch">
        <input
          type="text"
          readOnly
          value={value}
          className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-l-xl text-sm font-mono font-bold dark:text-white outline-none select-all cursor-text"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 bg-gray-50 dark:bg-white/10 border-2 border-l-0 border-gray-100 dark:border-white/10 rounded-r-xl hover:bg-gray-100 dark:hover:bg-white/15 transition-all flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300"
          title={`Copiar ${label.toLowerCase()}`}
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} className="text-gray-400" />
          )}
          <span className="hidden sm:inline">
            {copied ? "Copiado" : "Copiar"}
          </span>
        </button>
      </div>
    </div>
  );
}

export function UserCredentialsModal({
  isOpen,
  onClose,
  user,
  showPassword,
  onTogglePassword,
  password: propPassword,
}: UserCredentialsModalProps) {
  const displayPassword = propPassword || "No asignada";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Credenciales de Acceso">
      {user && (
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                {user.fullName}
              </p>
            </div>

            <CopyField
              label="Usuario"
              value={user.username || "No asignado"}
            />

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Contraseña
              </p>
              <div className="flex items-stretch">
                <input
                  type={showPassword ? "text" : "password"}
                  readOnly
                  value={displayPassword}
                  className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-l-xl text-sm font-mono font-bold dark:text-white outline-none select-all cursor-text"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="px-3 bg-gray-50 dark:bg-white/10 border-2 border-l-0 border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/15 transition-all text-gray-400 hover:text-[#008080]"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <CopyPasswordButton value={displayPassword} />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Por seguridad, comparte estas credenciales de forma privada con el
            usuario.
          </p>

          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="bg-[#008080] text-white px-12 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function CopyPasswordButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Contraseña copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar");
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="px-4 bg-gray-50 dark:bg-white/10 border-2 border-l-0 border-gray-100 dark:border-white/10 rounded-r-xl hover:bg-gray-100 dark:hover:bg-white/15 transition-all flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300"
      title="Copiar contraseña"
    >
      {copied ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <Copy size={16} className="text-gray-400" />
      )}
      <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
    </button>
  );
}
