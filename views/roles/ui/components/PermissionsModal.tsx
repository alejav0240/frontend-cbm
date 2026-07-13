"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/shared/ui/components/Modal";
import { PermissionsPicker } from "@/shared/ui/components/PermissionsPicker";
import { Rol } from "@/entities/rol";

function calcularInterseccion(roles: Rol[]): string[] {
  if (roles.length === 0) return [];
  if (roles.length === 1) return [...roles[0].permisos];
  const sets = roles.map((r) => new Set(r.permisos));
  return sets[0]
    ? [...sets[0]].filter((p) => sets.every((s) => s.has(p)))
    : [];
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolesSeleccionadas: Rol[];
  onGuardar: (permisos: string[]) => void;
  estaActualizando?: boolean;
}

export function PermissionsModal({
  isOpen,
  onClose,
  rolesSeleccionadas,
  onGuardar,
  estaActualizando = false,
}: PermissionsModalProps) {
  const [permisosLocales, setPermisosLocales] = useState<string[]>([]);
  const prevOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setPermisosLocales(calcularInterseccion(rolesSeleccionadas));
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, rolesSeleccionadas]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Permisos — ${rolesSeleccionadas.length} ${rolesSeleccionadas.length === 1 ? "rol" : "roles"}`}
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Se aplicará el mismo conjunto de permisos a todos los roles
          seleccionados.
        </p>

        <PermissionsPicker
          value={permisosLocales}
          onChange={setPermisosLocales}
          disabled={estaActualizando}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onGuardar(permisosLocales)}
            disabled={estaActualizando}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {estaActualizando && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Guardar Cambios
          </button>
        </div>
      </div>
    </Modal>
  );
}
