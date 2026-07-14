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

export const InventarioPage = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  const [paginaActual, setPaginaActual] = useState(1);
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
  });

  const { crearInventario } = useCrearInventario();
  const { actualizarInventario } = useActualizarInventario();
  const { eliminarInventario } = useEliminarInventario();

  const articulosFiltrados = useMemo(() => {
    if (!busquedaDebounced) return articulos;
    const term = busquedaDebounced.toLowerCase();
    return articulos.filter(
      (a) =>
        a.nombre.toLowerCase().includes(term) ||
        a.tipo.toLowerCase().includes(term) ||
        a.aula.toLowerCase().includes(term),
    );
  }, [articulos, busquedaDebounced]);

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

      <InventoryTable
        inventory={articulosFiltrados}
        searchTerm={terminoBusqueda}
        setSearchTerm={(term) => {
          setTerminoBusqueda(term);
          setPaginaActual(1);
        }}
        onEdit={handleAbrirEditar}
        onDelete={handleSolicitarEliminar}
      />

      <Pagination
        currentPage={paginaActual}
        totalPages={paginas}
        onPageChange={setPaginaActual}
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
