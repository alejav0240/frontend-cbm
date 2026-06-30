import { useLazyQuery } from "@apollo/client/react";
import { VER_SESION } from "./consultas";

export function useSesionDetalles() {
  const [obtenerSesion, { loading, error, data }] = useLazyQuery<any>(VER_SESION);

  return {
    obtenerSesion,
    cargando: loading,
    error,
    sesion: data?.session,
  };
}
