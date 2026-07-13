"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { BUSCAR_TERAPEUTAS } from "./consultas";
import type { BuscarTerapeutasQuery } from "@/shared/api/generated/graphql";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

type Option = { label: string; value: string };

export function useBuscarTerapeutas() {
  const [buscar, { loading, error }] = useLazyQuery<BuscarTerapeutasQuery>(
    BUSCAR_TERAPEUTAS,
    { fetchPolicy: "network-only" },
  );

  const [options, setOptions] = useState<Option[]>([]);

  const requestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const ejecutarBusqueda = useCallback(
    async (term: string) => {
      const currentId = ++requestIdRef.current;
      try {
        const { data } = await buscar({
          variables: { search: term, pageSize: 50 },
        });

        if (currentId !== requestIdRef.current) return;

        const results = data?.users?.results ?? [];
        setOptions(
          results
            .filter((t): t is NonNullable<typeof t> => t != null)
            .map((t) => ({
              label: t.fullName ?? "",
              value: t.id,
            })),
        );
      } catch {
        if (currentId === requestIdRef.current) setOptions([]);
      }
    },
    [buscar],
  );

  const onSearch = useCallback(
    (term: string) => {
      const normalizado = term.trim().length < MIN_CHARS ? "" : term.trim();

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void ejecutarBusqueda(normalizado);
      }, DEBOUNCE_MS);
    },
    [ejecutarBusqueda],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return useMemo(
    () => ({ options, onSearch, buscando: loading, error }),
    [options, onSearch, loading, error],
  );
}
