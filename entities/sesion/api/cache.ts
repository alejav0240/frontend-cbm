import type { ApolloClient } from "@apollo/client";
import {
  OBTENER_CICLOS,
  OBTENER_CICLOS_PACIENTE,
  OBTENER_CICLOS_PACIENTES,
  OBTENER_SESIONES,
} from "./consultas";

const SESSION_QUERY_DOCUMENTS = [
  OBTENER_SESIONES,
  OBTENER_CICLOS,
  OBTENER_CICLOS_PACIENTE,
  OBTENER_CICLOS_PACIENTES,
];

/**
 * Refreshes every active session-related query after a session mutation.
 * Apollo only refetches active observers, so inactive screens keep their
 * normalized cache until they become visible and apply their own policy.
 */
export function refetchActiveSessionQueries(client: ApolloClient) {
  return client
    .refetchQueries({
      include: SESSION_QUERY_DOCUMENTS,
    })
    .catch((error: unknown) => {
      // The mutation has already succeeded; a refresh failure must not turn it
      // into a false mutation error or interrupt the user flow.
      console.warn("Session cache refresh failed", error);
    });
}
