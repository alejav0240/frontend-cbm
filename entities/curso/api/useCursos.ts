import { useQuery } from "@apollo/client/react";
import { OBTENER_CURSOS } from "./consultas";
import { Curso } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerCursosQuery } from "@/shared/api/generated/graphql";

export const useCursos = (estado?: string) => {
  const { data, loading, error, refetch } = useQuery<ObtenerCursosQuery>(
    OBTENER_CURSOS,
    {
      variables: { state: estado },
    },
  );

  const cursos: Curso[] = useMemo(() => {
    if (!data?.courses) return [];

    return data.courses
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
    cargando: loading,
    error,
    refetch,
  };
};
