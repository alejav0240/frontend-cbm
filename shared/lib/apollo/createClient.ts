import {
  ApolloClient,
  InMemoryCache,
  from,
  type FieldPolicy,
} from "@apollo/client";
import {
  createHttpLink,
  createAuthLink,
  createErrorLink,
  createLoggerLink,
} from "./links";

/**
 * Políticas de cache para listados paginados.
 *
 * En esta app cada página/filtro se consulta con variables distintas, por lo
 * que Apollo guarda cada resultado por separado (cache key = query + args).
 * Estas políticas dejan explícito que `results` se reemplaza en cada fetch
 * (evitando concatenar páginas/filtros) y que cada entidad se normaliza por `id`.
 */
const reemplazarLista: FieldPolicy["merge"] = (_existing, incoming) => incoming;

const typePolicies = {
  Query: {
    fields: {
      sessions: { merge: reemplazarLista },
      patients: { merge: reemplazarLista },
      users: { merge: reemplazarLista },
      roles: { merge: reemplazarLista },
      payments: { merge: reemplazarLista },
      expenses: { merge: reemplazarLista },
      inventoryItems: { merge: reemplazarLista },
      scales: { merge: reemplazarLista },
      courses: { merge: reemplazarLista },
    },
  },
};

/**
 * Singleton del cliente Apollo para Next.js App Router
 *
 * Nota: En App Router, los componentes 'use client' se renderizan
 * en el cliente, por lo que un singleton a nivel de módulo es seguro.
 * Para SSR estricto, considera crear el cliente por request.
 */
let _client: ApolloClient | null = null;

/**
 * Crea o retorna la instancia singleton del ApolloClient
 */
export const createApolloClient = (): ApolloClient => {
  if (_client) {
    return _client;
  }

  // Construir cadena de links: error → logger → auth → http
  // El orden importa: los errores se capturan primero, luego se añaden headers
  const httpLink = createHttpLink();
  const authLink = createAuthLink();
  const errorLink = createErrorLink();

  // Logger link opcional: solo en desarrollo o si está habilitado
  const links = [errorLink];

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_APOLLO_LOGGING === "true"
  ) {
    links.push(createLoggerLink());
  }

  links.push(authLink, httpLink);

  _client = new ApolloClient({
    link: from(links),
    cache: new InMemoryCache({ typePolicies }),
  });

  return _client;
};

/**
 * Getter seguro para acceder al cliente desde cualquier módulo
 * Evita importaciones circulares con errorLink
 */
export const getApolloClient = (): ApolloClient => {
  return createApolloClient();
};

/**
 * Reset del cliente (útil para tests o re-auth forzado)
 */
export const resetApolloClient = (): void => {
  _client?.clearStore();
  _client = null;
};
