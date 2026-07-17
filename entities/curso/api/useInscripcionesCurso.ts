import { useQuery } from "@apollo/client/react";
import { OBTENER_INSCRIPCIONES_CURSO } from "./consultas";
import {
  ObtenerInscripcionesCursoQuery,
  ObtenerInscripcionesCursoQueryVariables,
} from "@/shared/api/generated/graphql";
import { InscripcionCurso } from "../model/tipos";
import { useMemo } from "react";

export function useInscripcionesCurso(courseId?: string | number) {
  const { data, loading, error, refetch } = useQuery<
    ObtenerInscripcionesCursoQuery,
    ObtenerInscripcionesCursoQueryVariables
  >(OBTENER_INSCRIPCIONES_CURSO, {
    variables: { courseId },
    skip: !courseId,
  });

  const inscripciones: InscripcionCurso[] = useMemo(() => {
    if (!data?.courseEnrollments?.results) return [];

    return data.courseEnrollments.results
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .map((e) => ({
        id: e.id,
        nombreCompleto: e.nombreCompleto,
        carnet: e.carnet ?? "",
        fechaInscripcion: new Date(
          typeof e.fechaInscripcion === "string"
            ? e.fechaInscripcion
            : Number(e.fechaInscripcion),
        ),
        pago: {
          id: e.pago?.id ?? "",
          monto: Number(e.pago?.monto) || 0,
          metodoPago: e.pago?.metodoPago ?? "",
          estadoPago: e.pago?.estadoPago ?? "",
        },
      }));
  }, [data]);

  return { inscripciones, cargando: loading, error, refetch };
}
