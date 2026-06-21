import { useQuery } from "@apollo/client/react";
import { OBTENER_CAMPANAS_MARKETING } from "./consultas";
import { CampanaMarketing } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerCampanasMarketingQuery } from "@/shared/api/generated/graphql";

export const useCampanasMarketing = (estado?: string, plataforma?: string) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerCampanasMarketingQuery>(OBTENER_CAMPANAS_MARKETING, {
      variables: { status: estado, platform: plataforma },
    });

  const campanas = useMemo(() => {
    return ((data?.marketingCampaigns || []).filter(Boolean) as any[]).map(
      (c) => ({
        ...c,
        conteoLeads: (c.leads || []).length,
      }),
    ) as CampanaMarketing[];
  }, [data]);

  return {
    campanas,
    cargando: loading,
    error,
    refetch,
  };
};
