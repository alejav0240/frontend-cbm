"use client";

import React, { useState, useCallback } from "react";
import {
  useUsuarios,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useDeactivateUser,
  Usuario,
} from "@/entities/usuario";
import { ModalesUsuario } from "@/features/gestion-usuario";
import { UsersHeader } from "./components/UsersHeader";
import { UsersFilters } from "./components/UsersFilters";
import { UsersTable } from "./components/UsersTable";
import { Download } from "lucide-react";
import { toast } from "sonner";

type TabType = "PERSONAL" | "TUTORES";

export const UsuariosPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("PERSONAL");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const nombreRol = activeTab === "TUTORES" ? "TUTOR" : undefined;
  const excluirRol = activeTab === "PERSONAL" ? "TUTOR" : undefined;

  const { usuarios, refetch } = useUsuarios({
    pagina: paginaActual,
    pageSize: 10,
    busqueda,
    nombreRol,
    excluirRol,
  });

  const { crearUsuario } = useCreateUser();
  const { actualizarUsuario } = useUpdateUser();
  const { eliminarUsuario } = useDeleteUser();
  const { desactivarUsuario } = useDeactivateUser();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCredenciales, setMostrarCredenciales] = useState(false);
  const [usuarioCredenciales, setUsuarioCredenciales] = useState<Usuario | null>(null);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [usuarioAccion, setUsuarioAccion] = useState<{ id: string; accion: "eliminar" | "desactivar" } | null>(null);
  const [mostrarExportar, setMostrarExportar] = useState(false);

  const [formName, setFormName] = useState("");
  const [formCarnet, setFormCarnet] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formType, setFormType] = useState("TERAPEUTA");
  const [formStatus, setFormStatus] = useState("ACTIVO");
  const [formVisibility, setFormVisibility] = useState("VISIBLE");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limpiarFormulario = useCallback(() => {
    setFormName("");
    setFormCarnet("");
    setFormPhone("");
    setFormUsername("");
    setFormPassword("");
    setFormType("TERAPEUTA");
    setFormStatus("ACTIVO");
    setFormVisibility("VISIBLE");
    setFormErrors({});
    setEditandoUsuario(null);
  }, []);

  const handleCrearClick = useCallback(() => {
    limpiarFormulario();
    setMostrarFormulario(true);
  }, [limpiarFormulario]);

  const handleEditar = useCallback((usuario: Usuario) => {
    setFormName(usuario.fullName || "");
    setFormCarnet(String(usuario.ci || ""));
    setFormPhone(String(usuario.celular || ""));
    setFormUsername(usuario.username || "");
    setFormPassword("");
    setFormType(usuario.rol?.nombre || "TERAPEUTA");
    setFormStatus(usuario.isActive ? "ACTIVO" : "INACTIVO");
    setFormVisibility(usuario.status || "VISIBLE");
    setFormErrors({});
    setEditandoUsuario(usuario);
    setMostrarFormulario(true);
  }, []);

  const handleShowCredentials = useCallback((usuario: Usuario) => {
    setUsuarioCredenciales(usuario);
    setMostrarPassword(false);
    setMostrarCredenciales(true);
  }, []);

  const handleDeactivate = useCallback((id: string) => {
    setUsuarioAccion({ id, accion: "desactivar" });
    setMostrarConfirmar(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setUsuarioAccion({ id, accion: "eliminar" });
    setMostrarConfirmar(true);
  }, []);

  const handleConfirmarAccion = useCallback(async () => {
    if (!usuarioAccion) return;

    try {
      if (usuarioAccion.accion === "eliminar") {
        await eliminarUsuario(usuarioAccion.id);
        toast.success("Usuario eliminado correctamente");
      } else {
        await desactivarUsuario(usuarioAccion.id);
        toast.success("Usuario desactivado correctamente");
      }
      await refetch();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al realizar la operación";
      toast.error(mensaje);
    } finally {
      setMostrarConfirmar(false);
      setUsuarioAccion(null);
    }
  }, [usuarioAccion, eliminarUsuario, desactivarUsuario, refetch]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      if (!formName.trim()) {
        setFormErrors({ name: "El nombre es requerido" });
        return;
      }

      setIsSubmitting(true);
      try {
        if (editandoUsuario) {
          await actualizarUsuario({
            id: editandoUsuario.id,
            firstName: formName.split(" ")[0] || formName,
            lastName: formName.split(" ").slice(1).join(" ") || "",
            ci: formCarnet,
            celular: formPhone,
            visibility: formVisibility,
            isActive: formStatus === "ACTIVO",
          });
          toast.success("Usuario actualizado correctamente");
        } else {
          await crearUsuario({
            username: formUsername || formName.toLowerCase().replace(/\s/g, "."),
            email: `${formUsername || formName.toLowerCase().replace(/\s/g, ".")}@sistema.com`,
            password: formPassword || "temp123",
            ci: formCarnet,
            celular: formPhone,
          });
          toast.success("Usuario creado correctamente");
        }
        setMostrarFormulario(false);
        limpiarFormulario();
        await refetch();
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : "Error al guardar el usuario";
        toast.error(mensaje);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      editandoUsuario,
      formName,
      formCarnet,
      formPhone,
      formUsername,
      formPassword,
      formVisibility,
      formStatus,
      actualizarUsuario,
      crearUsuario,
      limpiarFormulario,
      refetch,
    ],
  );

  return (
    <div className="space-y-8">
      <UsersHeader
        onCreateClick={handleCrearClick}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPaginaActual(1);
        }}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <UsersFilters
          searchTerm={busqueda}
          onSearchChange={(val) => {
            setBusqueda(val);
            setPaginaActual(1);
          }}
        />
        <button
          onClick={() => setMostrarExportar(true)}
          className="p-4 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 shrink-0"
        >
          <Download size={20} />
          <span className="hidden sm:inline text-sm font-bold">Exportar</span>
        </button>
      </div>

      <UsersTable
        users={usuarios}
        onShowCredentials={handleShowCredentials}
        onEdit={handleEditar}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />

      <ModalesUsuario
        mostrarFormulario={mostrarFormulario}
        alCerrarFormulario={() => {
          setMostrarFormulario(false);
          limpiarFormulario();
        }}
        formProps={{
          name: formName,
          setName: setFormName,
          carnet: formCarnet,
          setCarnet: setFormCarnet,
          phone: formPhone,
          setPhone: setFormPhone,
          username: formUsername,
          setUsername: setFormUsername,
          password: formPassword,
          setPassword: setFormPassword,
          type: formType,
          setType: setFormType,
          status: formStatus,
          setStatus: setFormStatus,
          visibility: formVisibility,
          setVisibility: setFormVisibility,
          isEditing: !!editandoUsuario,
          errors: formErrors,
          onSubmit: handleFormSubmit,
          onCancel: () => {
            setMostrarFormulario(false);
            limpiarFormulario();
          },
        }}
        mostrarCredenciales={mostrarCredenciales}
        alCerrarCredenciales={() => {
          setMostrarCredenciales(false);
          setUsuarioCredenciales(null);
        }}
        usuarioCredenciales={usuarioCredenciales}
        mostrarPassword={mostrarPassword}
        alternarPassword={() => setMostrarPassword(!mostrarPassword)}
        credencialesPassword={undefined}
        mostrarConfirmarEliminar={mostrarConfirmar}
        alCerrarConfirmarEliminar={() => {
          setMostrarConfirmar(false);
          setUsuarioAccion(null);
        }}
        alConfirmarEliminar={handleConfirmarAccion}
        tituloConfirmar={
          usuarioAccion?.accion === "eliminar"
            ? "Eliminar Usuario"
            : "Desactivar Usuario"
        }
        mensajeConfirmar={
          usuarioAccion?.accion === "eliminar"
            ? "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
            : "¿Estás seguro de desactivar este usuario? Podrás reactivarlo después."
        }
        mostrarExportar={mostrarExportar}
        alCerrarExportar={() => setMostrarExportar(false)}
        listaUsuarios={usuarios}
      />
    </div>
  );
};
