import { useQuery } from "@apollo/client/react";
import { OBTENER_CAMPANAS_MARKETING } from "./consultas";
import { CampanaMarketing } from "../model/tipos";
import { useMemo } from "react";

export const useCampanasMarketing = (estado?: string, plataforma?: string) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_CAMPANAS_MARKETING, {
    variables: { status: estado, platform: plataforma },
  });

  const campanas: CampanaMarketing[] = useMemo(() => {
    return (data?.marketingCampaigns || []).map((c: any) => ({
      id: c.id,
      nombre: c.name,
      plataforma: c.platform,
      estado: c.status,
      presupuesto: c.budget,
      gastado: c.spent,
      presupuestoRestante: c.remainingBudget,
      conteoLeads: (c.leads || []).length,
    }));
  }, [data]);

  return {
    campanas,
    cargando: loading,
    error,
    refetch,
  };
};
