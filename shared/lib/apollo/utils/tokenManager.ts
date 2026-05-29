import { isBrowser } from './isBrowser';
import {useAuthStore} from "@/shared/hooks/useAuthStore";

/**
 * Gestor centralizado de tokens de autenticación
 * Encapsula toda la lógica de refresh, storage y logout
 */
export const TokenManager = {
    /**
     * Procesa la respuesta exitosa del refresh token
     * @param payload - Datos devueltos por la mutación refreshToken
     */
    handleRefreshSuccess: (payload?: {
        payload?: string;
        refreshExpiresIn?: number;
        [key: string]: any;
    }): void => {
        // Si tu backend usa cookies httpOnly, el token se gestiona automáticamente
        // Solo necesitamos confirmar que el refresh fue exitoso

        if (payload?.payload) {
            // Caso: backend devuelve token en response body (menos seguro)
            // Aquí podrías guardarlo en memoria si es necesario
            console.debug('[TokenManager] Token refreshed successfully');
        } else {
            // Caso: backend usa cookies httpOnly (recomendado)
            console.debug('[TokenManager] Session refreshed via httpOnly cookie');
        }
    },

    /**
     * Maneja el fallo del refresh token
     * Limpia estado y redirige al login
     */
    handleRefreshFailure: (error?: any): void => {
        console.error('[TokenManager] Refresh token failed', error);

        // Limpiar estado de autenticación
        useAuthStore.getState().logout();

        // Redirigir al login solo en cliente
        if (isBrowser() && window.location.pathname !== '/login') {
            // Usar replace para no permitir volver atrás con el botón "atrás"
            window.location.replace('/login');
        }
    },

    /**
     * Logout completo: limpia store, cookies y redirige
     * Útil para logout explícito del usuario
     */
    logout: (): void => {
        // 1. Limpiar estado de Zustand
        useAuthStore.getState().logout();

        // 2. Limpiar cookies si es necesario (opcional, depende del backend)
        if (isBrowser()) {
            // Ejemplo: borrar cookie de sesión si el backend no lo hace automáticamente
            // document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }

        // 3. Redirigir al login
        if (isBrowser() && window.location.pathname !== '/login') {
            window.location.replace('/login');
        }
    },

    /**
     * Verifica si el usuario está autenticado según el store
     * Útil para guards en rutas o componentes
     */
    isAuthenticated: (): boolean => {
        return useAuthStore.getState().isAuthenticated;
    },

    /**
     * Obtiene el usuario actual del store
     */
    getUser: () => {
        return useAuthStore.getState().user;
    },
};