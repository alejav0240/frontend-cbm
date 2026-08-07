"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Sincroniza los filtros de un listado con la URL (searchParams).
 * Los valores vacíos se eliminan de la URL para mantenerla limpia
 * y permitir que el botón "atrás" restaure el estado previo.
 */
export function useUrlFiltros<K extends string>(claves: readonly K[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claveKey = claves.join("|");

  const filtros = useMemo(() => {
    const resultado = {} as Record<K, string>;
    for (const clave of claves) {
      resultado[clave] = searchParams.get(clave) ?? "";
    }
    return resultado;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, claveKey]);

  const setFiltro = useCallback(
    (clave: K, valor: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor) params.set(clave, valor);
      else params.delete(clave);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const setFiltros = useCallback(
    (cambios: Partial<Record<K, string>>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const clave of claves) {
        const valor = cambios[clave];
        if (valor) params.set(clave, valor);
        else params.delete(clave);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, claves],
  );

  const limpiar = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const clave of claves) params.delete(clave);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, claves]);

  return { filtros, setFiltro, setFiltros, limpiar };
}
