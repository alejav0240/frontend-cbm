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

export const GastosPage = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [gastoAEliminar, setGastoAEliminar] = useState<string | null>(null);
  const [gastoFormData, setGastoFormData] = useState<GastoFormData>(INITIAL_FORM_DATA);

  const { gastos, refetch } = useGastos();

  const { crearGasto, creando } = useCrearGasto();
  const { actualizarEstado } = useActualizarEstadoGasto();
  const { eliminarGasto, eliminando } = useEliminarGasto();

  const gastosFiltrados = useMemo(() => {
    if (!busquedaDebounced) return gastos;
    const term = busquedaDebounced.toLowerCase();
    return gastos.filter(
      (g) =>
        g.descripcion.toLowerCase().includes(term) ||
        g.categoria.toLowerCase().includes(term),
    );
  }, [gastos, busquedaDebounced]);

  const categorias = useMemo(() => {
    const cats = new Set(gastos.map((g) => g.categoria).filter(Boolean));
    return Array.from(cats);
  }, [gastos]);

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
        const creado = result.data?.expenses?.[0];
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

      <ExpensesTable
        expenses={gastosFiltrados}
        searchTerm={terminoBusqueda}
        setSearchTerm={setTerminoBusqueda}
        onToggleStatus={handleToggleStatus}
        onDeleteRequest={(id) => {
          setGastoAEliminar(id);
          setMostrarEliminar(true);
        }}
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
