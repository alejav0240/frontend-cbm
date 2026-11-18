import { isBrowser } from "./isBrowser";
import { useAuthStore } from "@/shared/model/useAuthStore";
import type { ApolloError } from "@/shared/lib/apollo/types";

/**
 * Gestor centralizado de tokens de autenticación
 * Encapsula toda la lógica de refresh, storage y logout
 */
export const TokenManager = {
  /**
   * Procesa la respuesta exitosa del refresh token
   */
  handleRefreshSuccess: (): boolean => {
    if (!isBrowser()) return false;

    // El backend rota las cookies HttpOnly durante la mutación de refresh.
    console.debug("[TokenManager] Session cookies refreshed successfully");
    return true;
  },

  /**
   * Maneja el fallo del refresh token
   * Limpia estado y redirige al login
   */
  handleRefreshFailure: (error?: ApolloError): void => {
    console.error("[TokenManager] Refresh token failed", error);

    // Limpiar estado de autenticación
    void useAuthStore.getState().cerrarSesion();

    // Redirigir al login solo en cliente
    if (isBrowser() && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  },

  /**
   * Logout completo: limpia store, cookies y redirige
   */
  logout: (): void => {
    void useAuthStore.getState().cerrarSesion();

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
