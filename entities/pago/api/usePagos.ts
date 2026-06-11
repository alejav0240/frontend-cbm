import { useQuery } from "@apollo/client/react";
import { OBTENER_PAGOS } from "./consultas";
import { Pago, PagoFiltros } from "../model/tipos";
import { useMemo } from "react";

export const usePagos = (filtros: PagoFiltros) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_PAGOS, {
    variables: {
      patientId: filtros.pacienteId,
      paymentStatus: filtros.estadoPago === "Todos" ? undefined : filtros.estadoPago,
      search: filtros.busqueda,
      page: filtros.pagina,
      pageSize: filtros.pageSize,
    },
    notifyOnNetworkStatusChange: true,
  });

  const pagos: Pago[] = useMemo(() => {
    return (data?.payments?.objects || []).map((p: any) => ({
      id: p.id,
      cantidadSesiones: p.sessionsCount,
      precioPorSesion: p.pricePerSession,
      montoPagado: p.amountPaid,
      montoTotal: p.totalAmount,
      deuda: p.debt,
      metodoPago: p.paymentMethod,
      fechaPago: p.paymentDate,
      estadoPago: p.paymentStatus,
      paciente: p.patient,
      descuento: p.discount,
    }));
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
