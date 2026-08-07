"use client";

import React, { useMemo, useState } from "react";
import {
  useInventario,
  useCrearInventario,
  useActualizarInventario,
  useEliminarInventario,
  generarInventarioPDF,
  generarInventarioExcel,
  ArticuloInventarioExportarFila,
  ArticuloInventario,
} from "@/entities/inventario";
import { InventoryHeader } from "./components/InventoryHeader";
import { InventoryStats } from "./components/InventoryStats";
import { InventoryTable } from "./components/InventoryTable";
import {
  InventoryFormModal,
  type FormData,
} from "./components/InventoryFormModal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import { Pagination } from "@/shared/ui/Pagination";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { useUrlFiltros } from "@/shared/lib/hooks/useUrlFiltros";
import { FilterBar } from "@/shared/ui/components/FilterBar";

const ESTADO_OPCIONES = [
  { label: "Todos los estados", value: "all" },
  { label: "Disponible", value: "available", color: "bg-green-500" },
  { label: "En uso", value: "in_use", color: "bg-blue-500" },
  { label: "En mantenimiento", value: "maintenance", color: "bg-red-500" },
];

const TIPO_OPCIONES = [
  { label: "Todos los tipos", value: "all" },
  { label: "Instrumento", value: "instrument", color: "bg-purple-500" },
  { label: "Equipo", value: "equipment", color: "bg-indigo-500" },
  { label: "Material", value: "material", color: "bg-cyan-500" },
];

export const InventarioPage = () => {
  const { filtros, setFiltros } = useUrlFiltros([
    "page",
    "q",
    "tipo",
    "estado",
  ] as const);
  const paginaActual = Number(filtros.page || "1");
  const filtroTipo = filtros.tipo || "all";
  const filtroEstado = filtros.estado || "all";
  const [terminoBusqueda, setTerminoBusqueda] = useState(filtros.q);
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  if (terminoBusqueda !== filtros.q) {
    setTerminoBusqueda(filtros.q);
  }
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState<string | null>(null);
  const [itemAEditar, setItemAEditar] = useState<ArticuloInventario | null>(
    null,
  );

  const { articulos, paginas, refetch } = useInventario({
    pagina: paginaActual,
    pageSize: 10,
    busqueda: busquedaDebounced || undefined,
    tipo: filtroTipo === "all" ? undefined : filtroTipo,
    estado: filtroEstado === "all" ? undefined : filtroEstado,
  });

  const { crearInventario } = useCrearInventario();
  const { actualizarInventario } = useActualizarInventario();
  const { eliminarInventario } = useEliminarInventario();

  const tipos = useMemo(() => {
    const set = new Set(articulos.map((a) => a.tipo).filter(Boolean));
    return Array.from(set);
  }, [articulos]);

  const salas = useMemo(() => {
    const set = new Set(articulos.map((a) => a.aula).filter(Boolean));
    return Array.from(set);
  }, [articulos]);

  const handleAbrirCrear = () => {
    setItemAEditar(null);
    setMostrarFormulario(true);
  };

  const handleAbrirEditar = (item: ArticuloInventario) => {
    setItemAEditar(item);
    setMostrarFormulario(true);
  };

  const handleGuardar = async (data: FormData) => {
    try {
      if (itemAEditar) {
        await actualizarInventario({ id: itemAEditar.id, ...data });
      } else {
        await crearInventario(data);
      }
      setMostrarFormulario(false);
      setItemAEditar(null);
      await refetch();
    } catch {}
  };

  const handleSolicitarEliminar = (id: string) => {
    setItemAEliminar(id);
    setMostrarEliminar(true);
  };

  const handleEliminar = async () => {
    if (!itemAEliminar) return;
    try {
      await eliminarInventario(itemAEliminar);
      setMostrarEliminar(false);
      setItemAEliminar(null);
      await refetch();
    } catch {}
  };

  const datosExportacion = useMemo((): ArticuloInventarioExportarFila[] => {
    return articulos.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      tipo: a.tipo,
      condicion: a.condicion,
      aula: a.aula,
      estado: a.estado,
      estadoMostrado: a.estadoMostrado || a.estado,
    }));
  }, [articulos]);

  const exporters = useMemo<Exporter<ArticuloInventarioExportarFila>[]>(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        async execute(data) {
          const doc = await generarInventarioPDF(data);
          doc.save(`reporte_inventario_${Date.now()}.pdf`);
        },
        async preview(data) {
          const doc = await generarInventarioPDF(data);
          return doc.output("blob") as Blob;
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        async execute(data) {
          await generarInventarioExcel(data);
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <InventoryHeader
        onAdd={handleAbrirCrear}
        onExport={() => setMostrarExportar(true)}
      />

      <InventoryStats inventory={articulos} />

      <FilterBar
        filtros={[
          {
            clave: "tipo",
            etiqueta: "Tipo",
            opciones: TIPO_OPCIONES,
            valor: filtroTipo,
            alCambiar: (v) => setFiltros({ tipo: v, page: "1" }),
          },
          {
            clave: "estado",
            etiqueta: "Estado",
            opciones: ESTADO_OPCIONES,
            valor: filtroEstado,
            alCambiar: (v) => setFiltros({ estado: v, page: "1" }),
          },
        ]}
        onLimpiar={() => setFiltros({ tipo: "", estado: "", page: "1" })}
      />

      <InventoryTable
        inventory={articulos}
        searchTerm={terminoBusqueda}
        setSearchTerm={(term) => {
          setTerminoBusqueda(term);
          setFiltros({ q: term, page: "1" });
        }}
        onEdit={handleAbrirEditar}
        onDelete={handleSolicitarEliminar}
      />

      <Pagination
        currentPage={paginaActual}
        totalPages={paginas}
        onPageChange={(p) => setFiltros({ page: String(p) })}
      />

      <InventoryFormModal
        key={`${mostrarFormulario}-${itemAEditar?.id ?? "new"}`}
        isOpen={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setItemAEditar(null);
        }}
        onSave={handleGuardar}
        initialData={itemAEditar}
      />

      <ConfirmModal
        isOpen={mostrarEliminar}
        onClose={() => {
          setMostrarEliminar(false);
          setItemAEliminar(null);
        }}
        onConfirm={handleEliminar}
        title="Eliminar Artículo"
        message="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Artículo"
      />

      <GenericExportModal<ArticuloInventarioExportarFila>
        title="Exportar Inventario"
        isOpen={mostrarExportar}
        onClose={() => setMostrarExportar(false)}
        data={datosExportacion}
        fileName="reporte_inventario"
        columns={[
          { key: "nombre", label: "Nombre" },
          { key: "tipo", label: "Tipo" },
          { key: "condicion", label: "Condición" },
          { key: "aula", label: "Aula" },
          { key: "estadoMostrado", label: "Estado" },
        ]}
        filters={[
          {
            key: "tipo",
            label: "Tipo",
            type: "select",
            options: tipos.map((t) => ({ value: t, label: t })),
          },
          {
            key: "estado",
            label: "Estado",
            type: "select",
            options: [
              { value: "AVAILABLE", label: "Disponible" },
              { value: "IN_USE", label: "En uso" },
              { value: "MAINTENANCE", label: "Mantenimiento" },
            ],
          },
          {
            key: "aula",
            label: "Aula",
            type: "select",
            options: salas.map((s) => ({ value: s, label: s })),
          },
        ]}
        exporters={exporters}
      />
    </div>
  );
};
