import { useQuery } from "@apollo/client/react";
import { OBTENER_DETALLE_INSTITUCION } from "./consultas";
import { DetalleInstitucion } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerDetalleInstitucionQuery } from "@/shared/api/generated/graphql";

export const useDetalleInstitucion = (id: string) => {
  const { data, loading, error } = useQuery<ObtenerDetalleInstitucionQuery>(
    OBTENER_DETALLE_INSTITUCION,
    { variables: { id }, skip: !id },
  );

  const institucion = useMemo(() => {
    if (!data?.institution) return null;
    return data.institution as unknown as DetalleInstitucion;
  }, [data]);

  return { institucion, cargando: loading, error };
};
