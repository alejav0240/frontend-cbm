'use client';

import { ReactNode, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from './createClient';
import { ensureCsrfToken } from './utils/csrf';

/**
 * Provider de Apollo para envolver la aplicación
 *
 * Características:
 * - useMemo para crear el cliente una sola vez por mount
 * - ensureCsrfToken para inicializar cookies CSRF en cliente
 * - Compatible con Next.js App Router ('use client')
 */
export function ApolloWrapper({ children }: { children: ReactNode }) {
    // Crear cliente Apollo una sola vez cuando el componente se monta
    // useMemo previene recreación en re-renders
    const client = useMemo(() => createApolloClient(), []);

    // Inicializar CSRF token solo en el cliente
    // Usamos useMemo con efecto lateral controlado para SSR safety
    useMemo(() => {
        if (typeof window !== 'undefined') {
            ensureCsrfToken().catch((err) => {
                console.warn('[ApolloWrapper] CSRF init warning', err);
            });
        }
    }, []);

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}