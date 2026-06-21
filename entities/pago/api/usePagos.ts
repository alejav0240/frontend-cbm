import { useQuery } from "@apollo/client/react";
import { OBTENER_PAGOS } from "./consultas";
import { Pago, PagoFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerPagosQuery } from "@/shared/api/generated/graphql";

export const usePagos = (filtros: PagoFiltros) => {
  const { data, loading, error, refetch } = useQuery<ObtenerPagosQuery>(
    OBTENER_PAGOS,
    {
      variables: {
        patientId: filtros.pacienteId,
        paymentStatus:
          filtros.estadoPago === "Todos" ? undefined : filtros.estadoPago,
        search: filtros.busqueda,
        page: filtros.pagina,
        pageSize: filtros.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const pagos = useMemo(() => {
    return (data?.payments?.objects || []).filter(Boolean) as unknown as Pago[];
  }, [data]);

  return {
    pagos,
    total: data?.payments?.totalCount || 0,
    paginas: data?.payments?.totalPages || 0,
    paginaActual: data?.payments?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
