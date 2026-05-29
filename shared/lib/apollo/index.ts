/**
 * Punto de entrada público para el módulo Apollo
 *
 * Los módulos de la app deben importar desde aquí,
 * no directamente de los archivos internos.
 */

// Provider para envolver la app
export { ApolloWrapper } from './ApolloWrapper';

// Hooks de Apollo (re-exportados para conveniencia)
export { gql } from '@apollo/client';
export {useApolloClient, useLazyQuery, useMutation, useQuery, useSubscription} from "@apollo/client/react";
// Tipos útiles
export type { GraphQLError, ApolloError } from './types';
export { isAuthError, AUTH_ERRORS } from './types';

// Utilidades avanzadas (para casos específicos)
export { getApolloClient, resetApolloClient } from './createClient';
export { TokenManager } from './utils/tokenManager';
export { getCookie, ensureCsrfToken, getGraphQLHeaders } from './utils/csrf';
