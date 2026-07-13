import { useLazyQuery } from "@apollo/client/react";
import { VER_SESION } from "./consultas";
import {
  VerSesionQuery,
  VerSesionQueryVariables,
} from "@/shared/api/generated/graphql";

export function useSesionDetalles() {
  const [obtenerSesion, { loading, error, data }] = useLazyQuery<
    VerSesionQuery,
    VerSesionQueryVariables
  >(VER_SESION);

  return {
    obtenerSesion,
    cargando: loading,
    error,
    sesion: data?.session ?? null,
  };
}
