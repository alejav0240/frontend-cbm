"use client";

import React, { useState } from "react";
import {
  useRecursosDigitales,
  useCrearRecurso,
  useActualizarRecurso,
  useEliminarRecurso,
  RecursoDigital,
} from "@/entities/recurso";
import { TablaRecursos } from "@/widgets/tabla-recursos";
import { FiltrarRecursos } from "@/features/filtrar-recursos";
import { ModalesRecurso } from "@/features/gestion-recurso";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

export const RecursosPage = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  const { recursos, paginas, refetch } = useRecursosDigitales({
    busqueda: busquedaDebounced || undefined,
    tipo: filtroTipo || undefined,
    pagina: paginaActual,
    pageSize: 12,
  });

  const { crearRecurso, creando } = useCrearRecurso();
  const { actualizarRecurso, actualizando } = useActualizarRecurso();
  const { eliminarRecurso } = useEliminarRecurso();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [recursoAEliminar, setRecursoAEliminar] = useState<string | null>(null);
  const [recursoAEditar, setRecursoAEditar] = useState<RecursoDigital | null>(
    null,
  );

  const handleCrearRecurso = async (data: {
    title: string;
    type: string;
    url: string;
    category: string;
  }) => {
    try {
      if (recursoAEditar) {
        await actualizarRecurso({
          id: recursoAEditar.id,
          title: data.title,
          type: data.type,
          url: data.url,
          category: data.category,
        });
        toast.success("Recurso actualizado correctamente");
      } else {
        await crearRecurso(data);
        toast.success("Recurso creado correctamente");
      }
      setMostrarFormulario(false);
      setRecursoAEditar(null);
      await refetch();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al guardar el recurso";
      toast.error(msg);
    }
  };

  const handleEliminarRecurso = async () => {
    if (!recursoAEliminar) return;
    try {
      await eliminarRecurso(recursoAEliminar);
      toast.success("Recurso eliminado correctamente");
      setMostrarEliminar(false);
      setRecursoAEliminar(null);
      await refetch();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al eliminar el recurso";
      toast.error(msg);
    }
  };

  const estaCreando = creando || actualizando;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Recursos Terapéuticos
          </h1>
          <p className="text-gray-400 text-sm">
            Biblioteca de materiales, partituras y guías para terapeutas
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarExportar(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            onClick={() => {
              setRecursoAEditar(null);
              setMostrarFormulario(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20"
          >
            <Plus size={18} />
            Subir Recurso
          </button>
        </div>
      </div>

      <FiltrarRecursos
        terminoBusqueda={terminoBusqueda}
        alCambiarBusqueda={setTerminoBusqueda}
        filtroTipo={filtroTipo}
        alCambiarTipo={setFiltroTipo}
      />

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaRecursos
          recursos={recursos}
          alEditar={(recurso) => {
            setRecursoAEditar(recurso);
            setMostrarFormulario(true);
          }}
          alEliminar={(id) => {
            setRecursoAEliminar(id);
            setMostrarEliminar(true);
          }}
          alAbrirEnlace={(url) => window.open(url, "_blank")}
          totalPaginas={paginas}
          paginaActual={paginaActual}
          alCambiarPagina={setPaginaActual}
        />
      </div>

      <ModalesRecurso
        mostrarFormulario={mostrarFormulario}
        alCerrarFormulario={() => {
          setMostrarFormulario(false);
          setRecursoAEditar(null);
        }}
        alEnviarFormulario={handleCrearRecurso}
        estaCreando={estaCreando}
        mostrarConfirmarEliminar={mostrarEliminar}
        alCerrarConfirmarEliminar={() => {
          setMostrarEliminar(false);
          setRecursoAEliminar(null);
        }}
        alConfirmarEliminar={handleEliminarRecurso}
        recursoAEliminar={recursoAEliminar}
        mostrarExportar={mostrarExportar}
        alCerrarExportar={() => setMostrarExportar(false)}
        listaRecursos={recursos}
        recursoAEditar={recursoAEditar}
      />
    </div>
  );
};
