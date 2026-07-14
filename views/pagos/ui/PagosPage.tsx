"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  usePagos,
  useDescuentos,
  Pago,
  PagoExportarFila,
  serializarPagosExportar,
  generarPagosPDF,
  generarPagosExcel,
} from "@/entities/pago";
import { useBuscarPacientes } from "@/entities/paciente";
import { useCrearPago } from "@/entities/pago/api/useCrearPago";
import { useEliminarPago } from "@/entities/pago/api/useEliminarPago";
import { useCrearDescuento } from "@/entities/pago/api/useCrearDescuento";
import { useEliminarDescuento } from "@/entities/pago/api/useEliminarDescuento";
import { PaymentsHeader } from "./components/PaymentsHeader";
import { PaymentsTabs } from "./components/PaymentsTabs";
import { PaymentsStats } from "./components/PaymentsStats";
import { PaymentsTable } from "./components/PaymentsTable";
import { DiscountsGrid } from "./components/DiscountsGrid";
import {
  PaymentFormModal,
  type PaymentFormData,
} from "./components/PaymentFormModal";
import {
  DiscountFormModal,
  type DiscountFormData,
} from "./components/DiscountFormModal";
import GenericExportModal, {
  type ExportColumn,
  type Exporter,
} from "@/shared/ui/GenericExportModal";
import { Pagination } from "@/shared/ui/Pagination";
import { toast } from "sonner";

export const PagosPage = () => {
  const [activeTab, setActiveTab] = useState<"payments" | "discounts">(
    "payments",
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [mostrarModalDescuento, setMostrarModalDescuento] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);

  const { pagos, paginas } = usePagos({
    pagina: paginaActual,
    pageSize: 10,
    estadoPago: filtroEstado,
  });

  const { descuentos } = useDescuentos();
  const {
    options: patientOptions,
    onSearch,
    buscando: isLoadingPatients,
  } = useBuscarPacientes();

  const { addPayment } = useCrearPago();
  const { deletePayment } = useEliminarPago();
  const { addDiscount } = useCrearDescuento();
  const { deleteDiscount } = useEliminarDescuento();

  const datosExportacion = useMemo<PagoExportarFila[]>(
    () => serializarPagosExportar(pagos),
    [pagos],
  );

  const columnasExportacion: ExportColumn<PagoExportarFila>[] = useMemo(
    () => [
      { key: "pacienteNombre", label: "Paciente" },
      { key: "fecha", label: "Fecha" },
      {
        key: "montoTotal",
        label: "Monto Total",
        formatter: (v) => `Bs. ${v}`,
      },
      { key: "pagado", label: "Pagado", formatter: (v) => `Bs. ${v}` },
      { key: "deuda", label: "Deuda", formatter: (v) => `Bs. ${v}` },
      { key: "estado", label: "Estado" },
      { key: "metodo", label: "Método" },
    ],
    [],
  );

  const exporters: Exporter<PagoExportarFila>[] = useMemo(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        execute: async (data) => {
          const doc = await generarPagosPDF(data);
          doc.save(`reporte_pagos_${Date.now()}.pdf`);
        },
        preview: async (data) => {
          const doc = await generarPagosPDF(data);
          return doc.output("blob");
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        execute: async (data) => {
          await generarPagosExcel(data);
        },
      },
    ],
    [],
  );

  const handleAction = useCallback(() => {
    if (activeTab === "payments") {
      setMostrarModalPago(true);
    } else {
      setMostrarModalDescuento(true);
    }
  }, [activeTab]);

  const handleAddPayment = useCallback(
    async (data: PaymentFormData) => {
      try {
        await addPayment({
          patientId: data.patientId,
          sessionsCount: data.sessionsCount,
          pricePerSession: data.pricePerSession,
          amountPaid: data.amountPaid,
          paymentMethod: data.paymentMethod,
          discountId: data.discountId || null,
        });
        setMostrarModalPago(false);
        toast.success("Pago registrado correctamente");
      } catch (e: unknown) {
        toast.error(
          e instanceof Error ? e.message : "Error al registrar el pago",
        );
      }
    },
    [addPayment],
  );

  const handleDeletePayment = useCallback(
    async (id: string) => {
      try {
        await deletePayment(id);
        toast.success("Pago eliminado correctamente");
      } catch (e: unknown) {
        toast.error(
          e instanceof Error ? e.message : "Error al eliminar el pago",
        );
      }
    },
    [deletePayment],
  );

  const handleAddDiscount = useCallback(
    async (data: DiscountFormData) => {
      try {
        await addDiscount({
          name: data.name,
          type: data.type,
          value: data.value,
          description: data.description || null,
        });
        setMostrarModalDescuento(false);
        toast.success("Descuento creado correctamente");
      } catch (e: unknown) {
        toast.error(
          e instanceof Error ? e.message : "Error al crear el descuento",
        );
      }
    },
    [addDiscount],
  );

  const handleDeleteDiscount = useCallback(
    async (id: string) => {
      try {
        await deleteDiscount(id);
        toast.success("Descuento eliminado correctamente");
      } catch (e: unknown) {
        toast.error(
          e instanceof Error ? e.message : "Error al eliminar el descuento",
        );
      }
    },
    [deleteDiscount],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleExportReceipt = useCallback((_pago: Pago) => {
    toast.info("Descarga de recibo próximamente disponible");
  }, []);

  return (
    <div className="space-y-8">
      <PaymentsHeader
        activeTab={activeTab}
        onExport={() => setMostrarExportar(true)}
        onAction={handleAction}
      />

      <PaymentsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "payments" ? (
        <>
          <PaymentsStats payments={pagos} />

          <div className="flex gap-4">
            {["Todos", "PAID", "PARTIAL", "PENDING"].map((estado) => (
              <button
                key={estado}
                onClick={() => {
                  setFiltroEstado(estado);
                  setPaginaActual(1);
                }}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  filtroEstado === estado
                    ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
                    : "bg-white dark:bg-accent text-gray-400 hover:text-[#008080]"
                }`}
              >
                {estado === "Todos"
                  ? "Todos"
                  : estado === "PAID"
                    ? "Pagados"
                    : estado === "PARTIAL"
                      ? "Parciales"
                      : "Pendientes"}
              </button>
            ))}
          </div>

          <PaymentsTable
            payments={pagos}
            onDelete={handleDeletePayment}
            onExportReceipt={handleExportReceipt}
          />

          <Pagination
            currentPage={paginaActual}
            totalPages={paginas}
            onPageChange={setPaginaActual}
          />
        </>
      ) : (
        <DiscountsGrid discounts={descuentos} onDelete={handleDeleteDiscount} />
      )}

      <PaymentFormModal
        isOpen={mostrarModalPago}
        onClose={() => setMostrarModalPago(false)}
        patientOptions={patientOptions}
        onSearchPatient={onSearch}
        isLoadingPatients={isLoadingPatients}
        discounts={descuentos}
        onAdd={handleAddPayment}
      />

      <DiscountFormModal
        isOpen={mostrarModalDescuento}
        onClose={() => setMostrarModalDescuento(false)}
        onAdd={handleAddDiscount}
      />

      <GenericExportModal<PagoExportarFila>
        isOpen={mostrarExportar}
        onClose={() => setMostrarExportar(false)}
        title="Exportar Pagos"
        data={datosExportacion}
        columns={columnasExportacion}
        fileName="reporte_pagos"
        exporters={exporters}
      />
    </div>
  );
};
