import { useQuery } from "@apollo/client/react";
import { OBTENER_CURSOS } from "./consultas";
import { Curso } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerCursosQuery } from "@/shared/api/generated/graphql";

interface UseCursosParams {
  page?: number;
  pageSize?: number;
  estado?: string;
}

export const useCursos = (params: UseCursosParams = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerCursosQuery>(
    OBTENER_CURSOS,
    {
      variables: {
        state: params.estado,
        page: params.page,
        pageSize: params.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const cursos: Curso[] = useMemo(() => {
    const results = data?.courses?.results;
    if (!results) return [];

    return results
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .map((c) => ({
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion || "Sin descripción",

        // SOLUCIÓN: Convertimos el string ("450.00") a un número real de JS
        precio: Number(c.precio) || 0,

        estado: c.estado,
        conteoEstudiantes: c.conteoEstudiantes ?? 0,
        ingresosTotales: c.ingresosTotales ?? 0,
      }));
  }, [data]);

  return {
    cursos,
    paginas: data?.courses?.totalPages || 0,
    cargando: loading,
    error,
    refetch,
  };
};
