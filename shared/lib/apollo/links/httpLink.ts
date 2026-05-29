import { HttpLink } from '@apollo/client';

/**
 * Configuración base del enlace HTTP para GraphQL
 * Centraliza la URI y opciones de conexión
 */
export const createHttpLink = () => {
    const uri = process.env.NEXT_PUBLIC_GRAPHQL_URI ||
        'http://localhost:8000/graphql/';

    return new HttpLink({
        uri,
        credentials: 'include', // Esencial para cookies de sesión y CSRF
        fetchOptions: {
            cache: 'no-store', // Evita caché del navegador para requests auth
        },
    });
};