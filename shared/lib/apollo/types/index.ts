/**
 * Tipos compartidos para toda la capa GraphQL
 * Centraliza definiciones para evitar duplicación en módulos
 */

export interface GraphQLErrorExtension {
    code?: string;
    exception?: {
        status?: number;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface GraphQLError {
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: GraphQLErrorExtension;
    [key: string]: any;
}

export interface NetworkError {
    statusCode?: number;
    bodyText?: string;
    result?: {
        errors?: GraphQLError[];
        [key: string]: any;
    };
    [key: string]: any;
}

export interface ApolloError {
    graphQLErrors?: readonly GraphQLError[];
    networkError?: NetworkError | null;
    message: string;
    [key: string]: any;
}

/**
 * Códigos de error de autenticación reconocidos
 * Adapta estos valores a los que devuelve tu backend
 */
export const AUTH_ERRORS = [
    'UNAUTHENTICATED',
    'No autenticado',
    'invalid_token',
    'token_expired',
    'authentication_required',
] as const;

export type AuthErrorCode = typeof AUTH_ERRORS[number];

/**
 * Helper para verificar si un error es de autenticación
 */
export const isAuthError = (error?: ApolloError | null): boolean => {
    if (!error) return false;

    // GraphQL errors
    if (error.graphQLErrors?.length) {
        return error.graphQLErrors.some((err) =>
            AUTH_ERRORS.includes(err.extensions?.code as AuthErrorCode) ||
            AUTH_ERRORS.some(keyword => err.message?.includes(keyword))
        );
    }

    // Network errors (HTTP 401)
    if (error.networkError?.statusCode === 401) {
        return true;
    }

    // Parse bodyText si existe
    if (error.networkError?.bodyText) {
        try {
            const body = JSON.parse(error.networkError.bodyText);
            if (body?.errors?.length) {
                return body.errors.some((err: any) =>
                    AUTH_ERRORS.includes(err.extensions?.code) ||
                    AUTH_ERRORS.some(keyword => err.message?.includes(keyword))
                );
            }
        } catch {
            // Si no es JSON válido, ignorar
        }
    }

    return false;
};