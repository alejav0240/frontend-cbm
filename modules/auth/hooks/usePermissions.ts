"use client";

import { useMemo } from "react";
import {
  PERMISSIONS,
  PermissionKey,
  MenuGroup,
  MenuItem,
} from "@/shared/lib/permissions/permissions.config";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

/**
 * Hook para gestión de permisos en la UI
 *
 * Proporciona:
 * - hasPermission: verifica un permiso específico
 * - hasAnyPermission: verifica si tiene al menos uno de una lista
 * - hasAllPermissions: verifica si tiene todos los permisos de una lista
 * - filterMenuByPermissions: filtra items de menú por permisos
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = useMemo(() => {
    return (permission: PermissionKey | string): boolean => {
      // No autenticado = sin permisos
      if (!isAuthenticated || !user) return false;

      // Admin tiene todos los permisos
      if (user.role?.name === "admin" || user.isStaff) return true;

      // Verificar en lista de permisos del usuario
      const userPermissions = user.permissions ?? [];
      return userPermissions.includes(permission);
    };
  }, [user, isAuthenticated]);

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos listados
   */
  const hasAnyPermission = useMemo(() => {
    return (permissions: (PermissionKey | string)[]): boolean => {
      return permissions.some((perm) => hasPermission(perm));
    };
  }, [hasPermission]);

  /**
   * Verifica si el usuario tiene TODOS los permisos listados
   */
  const hasAllPermissions = useMemo(() => {
    return (permissions: (PermissionKey | string)[]): boolean => {
      return permissions.every((perm) => hasPermission(perm));
    };
  }, [hasPermission]);

  /**
   * Filtra un array de MenuGroup eliminando items sin permisos
   * Mantiene la estructura de grupos pero elimina grupos vacíos
   */
  const filterMenuByPermissions = useMemo(() => {
    return (menuGroups: MenuGroup[]): MenuGroup[] => {
      return menuGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item: MenuItem) => {
            // Si el item no requiere permiso, se muestra siempre
            if (!item.permission) return true;

            // Si requiere permisos, verificar
            if (Array.isArray(item.permission)) {
              // Si es array, usar lógica según requireAll
              return item.requireAll
                ? hasAllPermissions(item.permission)
                : hasAnyPermission(item.permission);
            }

            // Permiso único
            return hasPermission(item.permission);
          }),
        }))
        .filter((group) => group.items.length > 0); // Eliminar grupos vacíos
    };
  }, [hasPermission, hasAnyPermission, hasAllPermissions]);

  /**
   * Verifica permiso y retorna callback condicional (útil para handlers)
   */
  const withPermission = useMemo(() => {
    return <T extends (...args: any[]) => any>(
      permission: PermissionKey | string,
      callback: T,
      fallback?: () => void,
    ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
      return (...args: Parameters<T>) => {
        if (hasPermission(permission)) {
          return callback(...args);
        } else {
          fallback?.();
          return undefined;
        }
      };
    };
  }, [hasPermission]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    filterMenuByPermissions,
    withPermission,
    // Exposición útil para debugging o casos avanzados
    user,
    isAuthenticated,
  };
};

/**
 * Hook simplificado para verificar un solo permiso en componentes
 * @example const canEdit = useHasPermission('pacientes');
 */
export const useHasPermission = (
  permission: PermissionKey | string,
): boolean => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};

/**
 * Hook para múltiples permisos con lógica OR
 * @example const canAccess = useHasAnyPermission(['pacientes', 'agenda']);
 */
export const useHasAnyPermission = (
  permissions: (PermissionKey | string)[],
): boolean => {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(permissions);
};

/**
 * Hook para múltiples permisos con lógica AND
 * @example const canManage = useHasAllPermissions(['pacientes', 'expedientes']);
 */
export const useHasAllPermissions = (
  permissions: (PermissionKey | string)[],
): boolean => {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(permissions);
};
