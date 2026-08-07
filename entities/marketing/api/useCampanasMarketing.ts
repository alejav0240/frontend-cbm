import { useQuery } from "@apollo/client/react";
import { OBTENER_CAMPANAS_MARKETING } from "./consultas";
import { CampanaMarketing } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerCampanasMarketingQuery } from "@/shared/api/generated/graphql";

interface UseCampanasMarketingParams {
  estado?: string;
  plataforma?: string;
  page?: number;
  pageSize?: number;
}

export const useCampanasMarketing = (params: UseCampanasMarketingParams = {}) => {
  const { estado, plataforma, page, pageSize } = params;

  const { data, loading, error, refetch } =
    useQuery<ObtenerCampanasMarketingQuery>(OBTENER_CAMPANAS_MARKETING, {
      variables: {
        status: estado || null,
        platform: plataforma || null,
        page: page || 1,
        pageSize: pageSize || 10,
      },
      notifyOnNetworkStatusChange: true,
    });

  const campanas = useMemo(() => {
    const results = (data?.marketingCampaigns?.results ?? []).filter(
      (c): c is NonNullable<typeof c> => c !== null,
    );
    return results.map((c) => ({
      ...c,
      presupuesto: Number(c.presupuesto) || 0,
      gastado: Number(c.gastado) || 0,
      presupuestoRestante: c.presupuestoRestante ?? 0,
      conteoLeads: (c.leads ?? []).length,
    })) as CampanaMarketing[];
  }, [data]);

  return {
    campanas,
    total: data?.marketingCampaigns?.totalCount || 0,
    paginas: data?.marketingCampaigns?.totalPages || 0,
    paginaActual: data?.marketingCampaigns?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
