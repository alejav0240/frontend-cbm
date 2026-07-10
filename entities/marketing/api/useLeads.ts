import { useQuery } from "@apollo/client/react";
import { OBTENER_LEADS } from "./consultas";
import { Lead } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerLeadsQuery } from "@/shared/api/generated/graphql";

export const useLeads = (campanaId?: string, estado?: string) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerLeadsQuery>(OBTENER_LEADS, {
      variables: { campaignId: campanaId || null, status: estado || null },
    });

  const leads = useMemo(() => {
    return ((data?.leads || []).filter(Boolean) as NonNullable<ObtenerLeadsQuery["leads"]>[number][]).map(
      (l) => ({
        id: l!.id,
        nombre: l!.nombre,
        telefono: l!.telefono,
        email: l!.email,
        estado: l!.estado,
        fechaCreacion: l!.fechaCreacion,
        campana: l!.campana,
      }),
    ) as Lead[];
  }, [data]);

  return {
    leads,
    cargando: loading,
    error,
    refetch,
  };
};
