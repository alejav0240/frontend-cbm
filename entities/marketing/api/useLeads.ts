import { useQuery } from "@apollo/client/react";
import { OBTENER_LEADS } from "./consultas";
import { Lead } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerLeadsQuery } from "@/shared/api/generated/graphql";

interface UseLeadsParams {
  campanaId?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
}

export const useLeads = (params: UseLeadsParams = {}) => {
  const { campanaId, estado, page, pageSize } = params;

  const { data, loading, error, refetch } = useQuery<ObtenerLeadsQuery>(
    OBTENER_LEADS,
    {
      variables: {
        campaignId: campanaId || null,
        status: estado || null,
        page: page || 1,
        pageSize: pageSize || 10,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const leads = useMemo(() => {
    return ((data?.leads?.results || []).filter(Boolean) as any[]).map(
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
    total: data?.leads?.totalCount || 0,
    paginas: data?.leads?.totalPages || 0,
    paginaActual: data?.leads?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
