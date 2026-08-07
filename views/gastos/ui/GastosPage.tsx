"use client";

import React, { useMemo, useState } from "react";
import {
  useGastos,
  useCrearGasto,
  useActualizarEstadoGasto,
  useEliminarGasto,
  generarGastosPDF,
  generarGastosExcel,
  GastoExportarFila,
} from "@/entities/gasto";
import { ExpensesHeader } from "./components/ExpensesHeader";
import { ExpensesStats } from "./components/ExpensesStats";
import { ExpensesTable } from "./components/ExpensesTable";
import { ExpenseForm } from "./components/ExpenseForm";
import { Modal } from "@/shared/ui/components/Modal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { useUrlFiltros } from "@/shared/lib/hooks/useUrlFiltros";
import { Pagination } from "@/shared/ui/Pagination";
import { FilterBar } from "@/shared/ui/components/FilterBar";

interface GastoFormData {
  descripcion: string;
  categoria: string;
  monto: number;
  fechaGasto: string;
  estado: "PAID" | "PENDING";
}

const INITIAL_FORM_DATA: GastoFormData = {
  descripcion: "",
  categoria: "",
  monto: 0,
  fechaGasto: new Date().toISOString().split("T")[0],
  estado: "PENDING",
};

const PAGE_SIZE = 10;

const ESTADO_OPCIONES = [
  { label: "Todos los estados", value: "all" },
  { label: "Pagado", value: "PAID", color: "bg-green-500" },
  { label: "Pendiente", value: "PENDING", color: "bg-amber-500" },
];

export const GastosPage = () => {
  const { filtros, setFiltros } = useUrlFiltros([
    "page",
    "q",
    "estado",
    "categoria",
  ] as const);
  const paginaActual = Number(filtros.page || "1");
  const filtroEstado = filtros.estado || "all";
  const filtroCategoria = filtros.categoria || "all";
  const [terminoBusqueda, setTerminoBusqueda] = useState(filtros.q);
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  if (terminoBusqueda !== filtros.q) {
    setTerminoBusqueda(filtros.q);
  }

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [gastoAEliminar, setGastoAEliminar] = useState<string | null>(null);
  const [gastoFormData, setGastoFormData] =
    useState<GastoFormData>(INITIAL_FORM_DATA);

  const { gastos, paginas, refetch } = useGastos({
    pagina: paginaActual,
    pageSize: PAGE_SIZE,
    busqueda: busquedaDebounced || undefined,
    estado: filtroEstado === "all" ? undefined : filtroEstado,
    categoria: filtroCategoria === "all" ? undefined : filtroCategoria,
  });

  const { crearGasto } = useCrearGasto();
  const { actualizarEstado } = useActualizarEstadoGasto();
  const { eliminarGasto } = useEliminarGasto();

  const categorias = useMemo(() => {
    const cats = new Set(gastos.map((g) => g.categoria).filter(Boolean));
    if (filtroCategoria !== "all") cats.add(filtroCategoria);
    return Array.from(cats);
  }, [gastos, filtroCategoria]);

  const totalGastos = useMemo(
    () => gastos.reduce((sum, g) => sum + Number(g.monto), 0),
    [gastos],
  );

  const gastosPagados = useMemo(
    () =>
      gastos
        .filter((g) => g.estado === "PAID")
        .reduce((sum, g) => sum + Number(g.monto), 0),
    [gastos],
  );

  const gastosPendientes = useMemo(
    () =>
      gastos
        .filter((g) => g.estado === "PENDING")
        .reduce((sum, g) => sum + Number(g.monto), 0),
    [gastos],
  );

  const handleCrearGasto = async () => {
    try {
      await crearGasto({
        description: gastoFormData.descripcion,
        category: gastoFormData.categoria,
        amount: gastoFormData.monto,
        expenseDate: gastoFormData.fechaGasto,
      });

      if (gastoFormData.estado === "PAID") {
        const result = await refetch();
        const creado = result.data?.expenses?.results?.[0];
        if (creado?.id) {
          await actualizarEstado(creado.id, "PAID");
        }
      }

      setMostrarFormulario(false);
      setGastoFormData(INITIAL_FORM_DATA);
      await refetch();
    } catch {
      // toast ya manejado en el hook
    }
  };

  const handleToggleStatus = async (id: string) => {
    const gasto = gastos.find((g) => g.id === id);
    if (!gasto) return;
    const nuevoEstado = gasto.estado === "PAID" ? "PENDING" : "PAID";
    try {
      await actualizarEstado(id, nuevoEstado);
      await refetch();
    } catch {
      // toast ya manejado en el hook
    }
  };

  const handleEliminarGasto = async () => {
    if (!gastoAEliminar) return;
    try {
      await eliminarGasto(gastoAEliminar);
      setMostrarEliminar(false);
      setGastoAEliminar(null);
      await refetch();
    } catch {
      // toast ya manejado en el hook
    }
  };

  const datosExportacion = useMemo((): GastoExportarFila[] => {
    return gastos.map((g) => ({
      id: g.id,
      descripcion: g.descripcion,
      categoria: g.categoria,
      monto: Number(g.monto),
      fecha: new Date(g.fechaGasto).toLocaleDateString("es-ES"),
      estado: g.estado,
    }));
  }, [gastos]);

  const exporters = useMemo<Exporter<GastoExportarFila>[]>(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        async execute(data) {
          const doc = await generarGastosPDF(data);
          doc.save(`reporte_gastos_${Date.now()}.pdf`);
        },
        async preview(data) {
          const doc = await generarGastosPDF(data);
          return doc.output("blob") as Blob;
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        async execute(data) {
          await generarGastosExcel(data);
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <ExpensesHeader
        onAddClick={() => setMostrarFormulario(true)}
        onExportClick={() => setMostrarExportar(true)}
      />

      <ExpensesStats
        totalExpenses={totalGastos}
        paidExpenses={gastosPagados}
        pendingExpenses={gastosPendientes}
      />

      <FilterBar
        filtros={[
          {
            clave: "estado",
            etiqueta: "Estado",
            opciones: ESTADO_OPCIONES,
            valor: filtroEstado,
            alCambiar: (v) => setFiltros({ estado: v, page: "1" }),
          },
          {
            clave: "categoria",
            etiqueta: "Categoría",
            opciones: [
              { label: "Todas las categorías", value: "all" },
              ...categorias.map((c) => ({ label: c, value: c })),
            ],
            valor: filtroCategoria,
            alCambiar: (v) => setFiltros({ categoria: v, page: "1" }),
          },
        ]}
        onLimpiar={() => setFiltros({ estado: "", categoria: "", page: "1" })}
      />

      <ExpensesTable
        expenses={gastos}
        searchTerm={terminoBusqueda}
        setSearchTerm={(value) => {
          setTerminoBusqueda(value);
          setFiltros({ q: value, page: "1" });
        }}
        onToggleStatus={handleToggleStatus}
        onDeleteRequest={(id) => {
          setGastoAEliminar(id);
          setMostrarEliminar(true);
        }}
      />

      <Pagination
        currentPage={paginaActual}
        totalPages={paginas}
        onPageChange={(p) => setFiltros({ page: String(p) })}
      />

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setGastoFormData(INITIAL_FORM_DATA);
        }}
        title="Registrar Gasto"
      >
        <ExpenseForm
          newExpense={gastoFormData}
          setNewExpense={setGastoFormData}
          categories={categorias.length > 0 ? categorias : ["General"]}
          onSubmit={handleCrearGasto}
          onCancel={() => {
            setMostrarFormulario(false);
            setGastoFormData(INITIAL_FORM_DATA);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={mostrarEliminar}
        onClose={() => {
          setMostrarEliminar(false);
          setGastoAEliminar(null);
        }}
        onConfirm={handleEliminarGasto}
        title="Eliminar Gasto"
        message="¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Gasto"
      />

      <GenericExportModal<GastoExportarFila>
        title="Exportar Gastos"
        isOpen={mostrarExportar}
        onClose={() => setMostrarExportar(false)}
        data={datosExportacion}
        fileName="reporte_gastos"
        columns={[
          { key: "descripcion", label: "Descripción" },
          { key: "categoria", label: "Categoría" },
          {
            key: "monto",
            label: "Monto",
            formatter: (v) => `Bs. ${Number(v).toFixed(2)}`,
          },
          { key: "fecha", label: "Fecha" },
          {
            key: "estado",
            label: "Estado",
            formatter: (v) => (v === "PAID" ? "Pagado" : "Pendiente"),
          },
        ]}
        filters={[
          {
            key: "estado",
            label: "Estado",
            type: "select",
            options: [
              { value: "PAID", label: "Pagado" },
              { value: "PENDING", label: "Pendiente" },
            ],
          },
          {
            key: "categoria",
            label: "Categoría",
            type: "select",
            options: categorias.map((c) => ({ value: c, label: c })),
          },
        ]}
        exporters={exporters}
      />
    </div>
  );
};
