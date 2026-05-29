import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client';
import { isAuthError } from '../types';
import { TokenManager } from '@/shared/lib/apollo';
import { REFRESH_TOKEN_MUTATION } from '../operations/auth';
import { getApolloClient } from '../createClient';

/**
 * Estado del refresh token (módulo-level, seguro en App Router)
 */
let isRefreshing = false;
type RefreshSubscriber = (success: boolean) => void;
let refreshQueue: RefreshSubscriber[] = [];

/**
 * Notifica a todas las requests en espera del resultado del refresh
 */
const flushRefreshQueue = (success: boolean): void => {
    refreshQueue.forEach((callback) => callback(success));
    refreshQueue = [];
};

/**
 * Link de manejo de errores con refresh automático de token
 * Detecta errores 401/UNAUTHENTICATED y gestiona el flujo de refresh
 */
export const createErrorLink = () => {
    return onError(({ error, operation, forward }) => {
        // Ignorar si es la propia mutación de refresh (evita loops infinitos)
        if (operation.operationName === 'RefreshToken') {
            return;
        }

        // Verificar si es un error de autenticación
        if (!isAuthError(error)) {
            return;
        }

        // Evitar redirect si ya estamos en la página de login
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
            return;
        }

        console.debug('[Apollo] Auth error detected, attempting refresh...');

        // Si ya hay un refresh en progreso, encolar esta request
        if (isRefreshing) {
            return new Observable((observer) => {
                const subscriber: RefreshSubscriber = (success: boolean) => {
                    if (success) {
                        // Reintentar la operación original
                        forward?.(operation)?.subscribe(observer);
                    } else {
                        // Propagar error si el refresh falló
                        observer.error(error);
                    }
                };
                refreshQueue.push(subscriber);
            });
        }

        // Iniciar proceso de refresh
        isRefreshing = true;

        return new Observable((observer) => {
            const client = getApolloClient();

            client
                .mutate({
                    mutation: REFRESH_TOKEN_MUTATION,
                    fetchPolicy: 'network-only', // Forzar request a red, no caché
                    errorPolicy: 'none',
                })
                .then((response) => {
                    const payload = (response.data as any)?.refreshToken;
                    TokenManager.handleRefreshSuccess(payload);
                    flushRefreshQueue(true);

                    // Reintentar la operación original con nueva sesión
                    forward?.(operation)?.subscribe(observer);
                })
                .catch((refreshError) => {
                    console.error('[Apollo] Token refresh failed', refreshError);
                    TokenManager.handleRefreshFailure(refreshError);
                    flushRefreshQueue(false);
                    observer.error(refreshError);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        });
    });
};