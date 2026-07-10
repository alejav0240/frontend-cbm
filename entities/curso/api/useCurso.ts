import { useQuery } from "@apollo/client/react";
import { OBTENER_CURSO } from "./consultas";
import { useMemo } from "react";

export interface CursoDetalle {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  conteoEstudiantes: number;
  ingresosTotales: number;
  inscripciones: {
    id: string;
    nombreCompleto: string;
    carnet: string;
    fechaInscripcion: Date;
  }[];
}

export function useCurso(id: string) {
  const { data, loading, error, refetch } = useQuery(OBTENER_CURSO, {
    variables: { id },
    skip: !id,
  });

  const curso = useMemo((): CursoDetalle | null => {
    const c = (data as any)?.course;
    if (!c) return null;
    return {
      id: c.id,
      nombre: c.name ?? "",
      descripcion: c.description ?? "",
      precio: Number(c.price) || 0,
      estado: c.state ?? "ACTIVE",
      conteoEstudiantes: c.studentsCount ?? 0,
      ingresosTotales: c.totalIncome ?? 0,
      inscripciones: (c.enrollments ?? []).map((e: any) => ({
        id: e.id,
        nombreCompleto: e.fullName ?? "",
        carnet: e.carnet ?? "",
        fechaInscripcion: new Date(e.enrolledAt),
      })),
    };
  }, [data]);

  return { curso, cargando: loading, error, refetch };
}
