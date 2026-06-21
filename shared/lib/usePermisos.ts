"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/shared/model/useAuthStore";

export const usePermisos = () => {
  const { usuario, estaAutenticado } = useAuthStore();

  const tienePermiso = useMemo(() => {
    return (permiso: string): boolean => {
      if (!estaAutenticado || !usuario) return false;
      if (usuario.role?.name === "admin" || usuario.isStaff) return true;

      const permisosUsuario = usuario.permissions || [];
      return permisosUsuario.includes(permiso);
    };
  }, [usuario, estaAutenticado]);

  const tieneCualquierPermiso = useMemo(() => {
    return (permisos: string[]): boolean => {
      return permisos.some((p) => tienePermiso(p));
    };
  }, [tienePermiso]);

  const tieneTodosLosPermisos = useMemo(() => {
    return (permisos: string[]): boolean => {
      return permisos.every((p) => tienePermiso(p));
    };
  }, [tienePermiso]);

  return {
    tienePermiso,
    tieneCualquierPermiso,
    tieneTodosLosPermisos,
    usuario,
    estaAutenticado,
  };
};

export const useTienePermiso = (permiso: string): boolean => {
  const { tienePermiso } = usePermisos();
  return tienePermiso(permiso);
};
