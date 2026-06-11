import { isBrowser } from "./isBrowser";
import { useAuthStore } from "@/shared/model/useAuthStore";

/**
 * Gestor centralizado de tokens de autenticación
 * Encapsula toda la lógica de refresh, storage y logout
 */
export const TokenManager = {
  /**
   * Procesa la respuesta exitosa del refresh token
   */
  handleRefreshSuccess: (payload?: {
    payload?: string;
    refreshExpiresIn?: number;
    [key: string]: any;
  }): void => {
    if (payload?.payload) {
      console.debug("[TokenManager] Token refreshed successfully");
    } else {
      console.debug("[TokenManager] Session refreshed via httpOnly cookie");
    }
  },

  /**
   * Maneja el fallo del refresh token
   * Limpia estado y redirige al login
   */
  handleRefreshFailure: (error?: any): void => {
    console.error("[TokenManager] Refresh token failed", error);

    // Limpiar estado de autenticación
    useAuthStore.getState().cerrarSesion();

    // Redirigir al login solo en cliente
    if (isBrowser() && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  },

  /**
   * Logout completo: limpia store, cookies y redirige
   */
  logout: (): void => {
    useAuthStore.getState().cerrarSesion();

    if (isBrowser() && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  },

  /**
   * Verifica si el usuario está autenticado según el store
   */
  isAuthenticated: (): boolean => {
    return useAuthStore.getState().estaAutenticado;
  },

  /**
   * Obtiene el usuario actual del store
   */
  getUser: () => {
    return useAuthStore.getState().usuario;
  },
};
