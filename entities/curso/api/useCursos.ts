import { useQuery } from "@apollo/client/react";
import { OBTENER_CURSOS } from "./consultas";
import { Curso } from "../model/tipos";
import { useMemo } from "react";

export const useCursos = (estado?: string) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_CURSOS, {
    variables: { state: estado },
  });

  const cursos: Curso[] = useMemo(() => {
    return (data?.courses || []).map((c: any) => ({
      id: c.id,
      nombre: c.name,
      descripcion: c.description,
      precio: c.price,
      estado: c.state,
      conteoEstudiantes: c.studentsCount,
      ingresosTotales: c.totalIncome,
    }));
  }, [data]);

  return {
    cursos,
    cargando: loading,
    error,
    refetch,
  };
};
