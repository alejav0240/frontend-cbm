import { isBrowser } from './isBrowser';

/**
 * Obtiene el valor de una cookie por nombre
 * Safe para SSR (retorna undefined en servidor)
 */
export function getCookie(name: string): string | undefined {
    if (!isBrowser()) return undefined;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        const part = parts.pop();
        if (part) {
            return part.split(';').shift();
        }
    }
    return undefined;
}

/**
 * Asegura que el token CSRF esté inicializado
 * Hace una petición GET al endpoint GraphQL para que el backend setee la cookie
 */
export async function ensureCsrfToken(): Promise<void> {
    if (!isBrowser()) return;

    const csrftoken = getCookie('csrftoken');

    // Si ya existe, no hacer nada
    if (csrftoken) {
        return;
    }

    try {
        // Petición GET para inicializar sesión y obtener CSRF
        // Ajusta la URL si tu backend tiene un endpoint específico para CSRF
        const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URI ||
            'http://127.0.0.1:8000/graphql/';

        await fetch(graphqlUri, {
            method: 'GET',
            credentials: 'include', // Esencial para cookies
            headers: {
                'Accept': 'application/json',
            },
        });

        console.debug('[CSRF] Token initialized');
    } catch (error) {
        console.warn('[CSRF] Failed to initialize token', error);
        // No lanzar error para no bloquear la app, el backend puede manejar CSRF de otra forma
    }
}

/**
 * Headers base para requests GraphQL
 * Incluye CSRF token si está disponible
 */
export const getGraphQLHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (isBrowser()) {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
    }

    return headers;
};