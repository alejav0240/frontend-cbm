"use client";

import { useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { BUSCAR_PACIENTES } from "./consultas";
import type { BuscarPacientesQuery } from "@/shared/api/generated/graphql";

export function useBuscarPacientes() {
  const [buscar, { loading }] =
    useLazyQuery<BuscarPacientesQuery>(BUSCAR_PACIENTES);
  const [options, setOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const onSearch = useCallback(
    async (term: string) => {
      if (!term || term.length < 2) {
        setOptions([]);
        return;
      }
      const { data } = await buscar({ variables: { search: term } });
      const results = data?.patients?.results ?? [];
      setOptions(
        results
          .filter((p): p is NonNullable<typeof p> => p != null)
          .map((p) => ({
            label: p.fullName ?? "",
            value: p.id,
          })),
      );
    },
    [buscar],
  );

  return { options, onSearch, buscando: loading };
}
