"use client";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useLazyQuery} from "@apollo/client/react";
import {BUSCAR_PACIENTES} from "./consultas";
import type {BuscarPacientesQuery} from "@/shared/api/generated/graphql";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

type Option = { label: string; value: string };

export function useBuscarPacientes() {
    const [buscar, {loading, error}] = useLazyQuery<BuscarPacientesQuery>(
        BUSCAR_PACIENTES,
        {fetchPolicy: "network-only"},
    );

    const [options, setOptions] = useState<Option[]>([]);

    // Evita pisar resultados con respuestas de búsquedas viejas (race conditions)
    const requestIdRef = useRef(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const ejecutarBusqueda = useCallback(
        async (term: string) => {
            const currentId = ++requestIdRef.current;
            try {
                const {data} = await buscar({variables: {search: term}});

                // Si llegó una búsqueda más nueva mientras esperábamos, descartamos esta
                if (currentId !== requestIdRef.current) return;

                const results = data?.patients?.results ?? [];
                setOptions(
                    results
                        .filter((p): p is NonNullable<typeof p> => p != null)
                        .map((p) => ({
                            label: p.fullName ?? "",
                            value: p.id,
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
        () => ({options, onSearch, buscando: loading, error}),
        [options, onSearch, loading, error],
    );
}