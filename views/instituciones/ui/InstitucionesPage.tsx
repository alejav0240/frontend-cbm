"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  useInstituciones,
  useCrearInstitucion,
  useEliminarInstitucion,
  useCrearGrupo,
  useEliminarGrupo,
  useDetalleInstitucion,
  useDetalleGrupo,
  generarInstitucionesPDF,
  generarInstitucionesExcel,
  InstitucionExportarFila,
} from "@/entities/institucion";
import { InstitutionsHeader } from "./components/InstitutionsHeader";
import { InstitutionsStats } from "./components/InstitutionsStats";
import { InstitutionsList } from "./components/InstitutionsList";
import { InstitutionDetail } from "./components/InstitutionDetail";
import { GroupDetail } from "./components/GroupDetail";
import { InstitutionFormModal } from "./components/InstitutionFormModal";
import { GroupFormModal } from "./components/GroupFormModal";
import { SessionFormModal } from "./components/SessionFormModal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import { Pagination } from "@/shared/ui/Pagination";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { CREAR_SESION } from "@/entities/sesion/api/mutaciones";
import {
  CrearSesionMutation,
  CrearSesionMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

const INITIAL_FORM_INSTITUCION = {
  nombre: "",
  direccion: "",
  nombreContacto: "",
  telefonoContacto: "",
  emailContacto: "",
};

const INITIAL_FORM_GRUPO = {
  nombre: "",
  descripcion: "",
};

export const InstitucionesPage = () => {
  const [vista, setVista] = useState<"lista" | "detalle" | "detalle-grupo">(
    "lista",
  );
  const [institucionSeleccionadaId, setInstitucionSeleccionadaId] = useState<
    string | null
  >(null);
  const [grupoSeleccionadoId, setGrupoSeleccionadoId] = useState<string | null>(
    null,
  );

  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  const [mostrarFormularioInstitucion, setMostrarFormularioInstitucion] =
    useState(false);
  const [mostrarFormularioGrupo, setMostrarFormularioGrupo] = useState(false);
  const [mostrarFormularioSesion, setMostrarFormularioSesion] = useState(false);
  const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] =
    useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [eliminarTarget, setEliminarTarget] = useState<{
    tipo: "institucion" | "grupo" | "sesion";
    id: string;
  } | null>(null);

  const [formInstitucion, setFormInstitucion] = useState(
    INITIAL_FORM_INSTITUCION,
  );
  const [formGrupo, setFormGrupo] = useState(INITIAL_FORM_GRUPO);

  const { instituciones, paginas, refetch } = useInstituciones({
    page: paginaActual,
    pageSize: 10,
  });
  const { institucion: detalleInstitucion, cargando: cargandoDetalle } =
    useDetalleInstitucion(institucionSeleccionadaId ?? "");
  const { grupo: detalleGrupo, cargando: cargandoGrupo } = useDetalleGrupo(
    grupoSeleccionadoId ?? "",
  );

  const { crearInstitucion, creando } = useCrearInstitucion();
  const { eliminarInstitucion } = useEliminarInstitucion();
  const { crearGrupo } = useCrearGrupo();
  const { eliminarGrupo } = useEliminarGrupo();

  const [crearSesionMut] = useMutation<
    CrearSesionMutation,
    CrearSesionMutationVariables
  >(CREAR_SESION);

  const institucionesFiltradas = useMemo(() => {
    if (!busquedaDebounced) return instituciones;
    const term = busquedaDebounced.toLowerCase();
    return instituciones.filter(
      (i) =>
        i.nombre.toLowerCase().includes(term) ||
        i.nombreContacto.toLowerCase().includes(term) ||
        i.direccion.toLowerCase().includes(term),
    );
  }, [instituciones, busquedaDebounced]);

  const totalInstituciones = instituciones.length;
  const totalGrupos = instituciones.reduce(
    (sum, i) => sum + i.grupos.length,
    0,
  );

  const datosExportacion = useMemo((): InstitucionExportarFila[] => {
    return instituciones.map((inst) => ({
      id: inst.id,
      nombre: inst.nombre,
      direccion: inst.direccion,
      nombreContacto: inst.nombreContacto,
      emailContacto: inst.emailContacto,
      telefonoContacto: inst.telefonoContacto,
      cantidadGrupos: inst.grupos.length,
    }));
  }, [instituciones]);

  const exporters = useMemo<Exporter<InstitucionExportarFila>[]>(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        async execute(data) {
          const doc = await generarInstitucionesPDF(data);
          doc.save(`reporte_instituciones_${Date.now()}.pdf`);
        },
        async preview(data) {
          const doc = await generarInstitucionesPDF(data);
          return doc.output("blob") as Blob;
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        async execute(data) {
          await generarInstitucionesExcel(data);
        },
      },
    ],
    [],
  );

  const handleSeleccionarInstitucion = useCallback((id: string) => {
    setInstitucionSeleccionadaId(id);
    setVista("detalle");
  }, []);

  const handleVolver = useCallback(() => {
    if (vista === "detalle-grupo") {
      setGrupoSeleccionadoId(null);
      setVista("detalle");
    } else {
      setInstitucionSeleccionadaId(null);
      setVista("lista");
    }
  }, [vista]);

  const handleSeleccionarGrupo = useCallback((id: string) => {
    setGrupoSeleccionadoId(id);
    setVista("detalle-grupo");
  }, []);

  const handleCrearInstitucion = useCallback(async () => {
    try {
      await crearInstitucion({
        name: formInstitucion.nombre,
        contactEmail: formInstitucion.emailContacto,
        phone: formInstitucion.telefonoContacto,
      });
      setMostrarFormularioInstitucion(false);
      setFormInstitucion(INITIAL_FORM_INSTITUCION);
      await refetch();
    } catch {
      // toast ya manejado en el hook
    }
  }, [crearInstitucion, formInstitucion, refetch]);

  const handleCrearGrupo = useCallback(async () => {
    if (!institucionSeleccionadaId) return;
    try {
      await crearGrupo({
        institutionId: institucionSeleccionadaId,
        name: formGrupo.nombre,
      });
      setMostrarFormularioGrupo(false);
      setFormGrupo(INITIAL_FORM_GRUPO);
      await refetch();
    } catch {
      // toast ya manejado en el hook
    }
  }, [crearGrupo, formGrupo, institucionSeleccionadaId, refetch]);

  const handleCrearSesion = useCallback(
    async (data: {
      therapistId: string;
      date: string;
      time: string;
      notes?: string;
    }) => {
      if (!grupoSeleccionadoId) return;
      try {
        const sessionDate = `${data.date}T${data.time}:00`;
        await crearSesionMut({
          variables: {
            therapistId: data.therapistId,
            sessionDate,
            sessionType: "GROUP",
            groupId: grupoSeleccionadoId,
            notes: data.notes,
          },
        });
        toast.success("Sesión creada correctamente");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al crear la sesión";
        toast.error(message);
        throw err;
      }
    },
    [crearSesionMut, grupoSeleccionadoId],
  );

  const handleEliminarConfirm = useCallback(async () => {
    if (!eliminarTarget) return;
    try {
      if (eliminarTarget.tipo === "institucion") {
        await eliminarInstitucion(eliminarTarget.id);
      } else if (eliminarTarget.tipo === "grupo") {
        await eliminarGrupo(eliminarTarget.id);
      }
      setMostrarConfirmarEliminar(false);
      setEliminarTarget(null);
      if (eliminarTarget.tipo === "institucion") {
        setInstitucionSeleccionadaId(null);
        setVista("lista");
      } else if (eliminarTarget.tipo === "grupo") {
        setGrupoSeleccionadoId(null);
        setVista("detalle");
      }
      await refetch();
    } catch {
      // toast ya manejado en el hook
    }
  }, [eliminarTarget, eliminarInstitucion, eliminarGrupo, refetch]);

  const handleDeleteRequest = useCallback(
    (tipo: "institucion" | "grupo" | "sesion", id: string) => {
      setEliminarTarget({ tipo, id });
      setMostrarConfirmarEliminar(true);
    },
    [],
  );

  const tituloEliminar =
    eliminarTarget?.tipo === "institucion"
      ? "Eliminar Institución"
      : eliminarTarget?.tipo === "grupo"
        ? "Eliminar Grupo"
        : "Eliminar Sesión";

  const mensajeEliminar =
    eliminarTarget?.tipo === "institucion"
      ? "¿Estás seguro de que deseas eliminar esta institución? También se eliminarán todos sus grupos y sesiones. Esta acción no se puede deshacer."
      : eliminarTarget?.tipo === "grupo"
        ? "¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer."
        : "¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.";

  if (vista === "detalle" && detalleInstitucion) {
    return (
      <div className="space-y-8">
        <InstitutionDetail
          institution={detalleInstitucion}
          onBack={handleVolver}
          onNewGroup={() => setMostrarFormularioGrupo(true)}
          onSelectGroup={handleSeleccionarGrupo}
          onDeleteInstitution={(id) => handleDeleteRequest("institucion", id)}
        />

        <GroupFormModal
          isOpen={mostrarFormularioGrupo}
          onClose={() => {
            setMostrarFormularioGrupo(false);
            setFormGrupo(INITIAL_FORM_GRUPO);
          }}
          onSave={handleCrearGrupo}
          data={formGrupo}
          onChange={setFormGrupo}
        />

        <ConfirmModal
          isOpen={mostrarConfirmarEliminar}
          onClose={() => {
            setMostrarConfirmarEliminar(false);
            setEliminarTarget(null);
          }}
          onConfirm={handleEliminarConfirm}
          title={tituloEliminar}
          message={mensajeEliminar}
          confirmLabel="Eliminar"
        />
      </div>
    );
  }

  if (vista === "detalle-grupo" && detalleGrupo) {
    return (
      <div className="space-y-8">
        <GroupDetail
          group={detalleGrupo}
          onBack={handleVolver}
          onNewSession={() => setMostrarFormularioSesion(true)}
          onDeleteGroup={(id) => handleDeleteRequest("grupo", id)}
          onDeleteSession={(id) => handleDeleteRequest("sesion", id)}
        />

        <SessionFormModal
          isOpen={mostrarFormularioSesion}
          onClose={() => setMostrarFormularioSesion(false)}
          onSave={handleCrearSesion}
          therapistOptions={[]}
        />

        <ConfirmModal
          isOpen={mostrarConfirmarEliminar}
          onClose={() => {
            setMostrarConfirmarEliminar(false);
            setEliminarTarget(null);
          }}
          onConfirm={handleEliminarConfirm}
          title={tituloEliminar}
          message={mensajeEliminar}
          confirmLabel="Eliminar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InstitutionsHeader
        onNewInstitution={() => setMostrarFormularioInstitucion(true)}
        onExportClick={() => setMostrarExportar(true)}
      />

      <InstitutionsStats
        totalInstitutions={totalInstituciones}
        totalGroups={totalGrupos}
        totalSessions={0}
      />

      <InstitutionsList
        institutions={institucionesFiltradas}
        searchTerm={terminoBusqueda}
        onSearchChange={(value) => {
          setTerminoBusqueda(value);
          setPaginaActual(1);
        }}
        onSelectInstitution={handleSeleccionarInstitucion}
      />

      <Pagination
        currentPage={paginaActual}
        totalPages={paginas}
        onPageChange={setPaginaActual}
      />

      <InstitutionFormModal
        isOpen={mostrarFormularioInstitucion}
        onClose={() => {
          setMostrarFormularioInstitucion(false);
          setFormInstitucion(INITIAL_FORM_INSTITUCION);
        }}
        onSave={handleCrearInstitucion}
        data={formInstitucion}
        onChange={setFormInstitucion}
      />

      <GenericExportModal<InstitucionExportarFila>
        title="Exportar Instituciones"
        isOpen={mostrarExportar}
        onClose={() => setMostrarExportar(false)}
        data={datosExportacion}
        fileName="reporte_instituciones"
        columns={[
          { key: "nombre", label: "Nombre" },
          { key: "direccion", label: "Dirección" },
          { key: "nombreContacto", label: "Contacto" },
          { key: "emailContacto", label: "Email" },
          { key: "telefonoContacto", label: "Teléfono" },
          { key: "cantidadGrupos", label: "Grupos" },
        ]}
        filters={[]}
        exporters={exporters}
      />
    </div>
  );
};
