import { ApolloLink, Operation } from "@apollo/client";
import { getCookie } from "../utils/csrf";

/**
 * Middleware que inyecta headers de autenticación en cada request
 * - CSRF token desde cookies
 * - La autenticación se transporta mediante cookies HttpOnly.
 */
export const createAuthLink = () => {
  return new ApolloLink((operation: Operation, forward) => {
    // Obtener CSRF token de cookies (solo en cliente)
    const csrftoken = getCookie("csrftoken");

    // Obtener contexto actual de headers
    const context = operation.getContext();
    const existingHeaders = context.headers || {};

    // Construir nuevos headers
    const headers: Record<string, string> = {
      ...existingHeaders,
      // CSRF para Django/DRF o similares
      ...(csrftoken && { "X-CSRFToken": csrftoken }),
    };

    // Actualizar contexto de la operación
    operation.setContext({ headers });

    return forward(operation);
  });
};
