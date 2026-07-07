import { useQuery } from "@apollo/client/react";
import { OBTENER_DESCUENTOS } from "./consultas";
import { Descuento } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerDescuentosQuery } from "@/shared/api/generated/graphql";

export const useDescuentos = () => {
  const { data, loading, error, refetch } = useQuery<ObtenerDescuentosQuery>(
    OBTENER_DESCUENTOS,
    { notifyOnNetworkStatusChange: true },
  );

  const descuentos = useMemo(() => {
    return (data?.discounts || []).filter(Boolean) as unknown as Descuento[];
  }, [data]);

  return {
    descuentos,
    cargando: loading,
    error,
    refetch,
  };
};
