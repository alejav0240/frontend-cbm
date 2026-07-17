"use client";

import React, { useState, useCallback } from "react";
import {
  useUsuarios,
  useCreateUser,
  useUpdateUser,
  Usuario,
} from "@/entities/usuario";
import { ModalesUsuario } from "@/features/gestion-usuario";
import { UsersHeader } from "./components/UsersHeader";
import { UsersFilters } from "./components/UsersFilters";
import { UsersTable } from "./components/UsersTable";
import { Download } from "lucide-react";
import { Pagination } from "@/shared/ui/Pagination";
import { toast } from "sonner";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";

type TabType = "PERSONAL" | "TUTORES";

export const UsuariosPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("PERSONAL");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const busquedaDebounced = useDebounce(busqueda, 500);

  const nombreRol = activeTab === "TUTORES" ? "TUTOR" : undefined;
  const excluirRol = activeTab === "PERSONAL" ? "TUTOR" : undefined;

  const { usuarios, paginas, refetch } = useUsuarios({
    pagina: paginaActual,
    pageSize: 10,
    busqueda: busquedaDebounced || undefined,
    nombreRol,
    excluirRol,
  });

  const { crearUsuario } = useCreateUser();
  const { actualizarUsuario } = useUpdateUser();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCredenciales, setMostrarCredenciales] = useState(false);
  const [usuarioCredenciales, setUsuarioCredenciales] =
    useState<Usuario | null>(null);
  const [credencialesPassword, setCredencialesPassword] = useState<
    string | undefined
  >(undefined);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);

  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formCarnet, setFormCarnet] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVO");
  const [formVisibility, setFormVisibility] = useState("VISIBLE");
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limpiarFormulario = useCallback(() => {
    setFormFirstName("");
    setFormLastName("");
    setFormCarnet("");
    setFormPhone("");
    setFormUsername("");
    setFormPassword("");
    setFormRoleId("");
    setFormStatus("ACTIVO");
    setFormVisibility("VISIBLE");
    setEditandoUsuario(null);
  }, []);

  const handleCrearClick = useCallback(() => {
    limpiarFormulario();
    setMostrarFormulario(true);
  }, [limpiarFormulario]);

  const handleEditar = useCallback((usuario: Usuario) => {
    const partes = (usuario.fullName || "").split(" ");
    setFormFirstName(partes[0] || "");
    setFormLastName(partes.slice(1).join(" ") || "");
    setFormCarnet(String(usuario.ci || ""));
    setFormPhone(String(usuario.celular || ""));
    setFormUsername(usuario.username || "");
    setFormPassword("");
    setFormRoleId(usuario.rol?.id || "");
    setFormStatus(usuario.isActive ? "ACTIVO" : "INACTIVO");
    setFormVisibility(usuario.status || "VISIBLE");
    setEditandoUsuario(usuario);
    setMostrarFormulario(true);
  }, []);

  const handleShowCredentials = useCallback((usuario: Usuario) => {
    setUsuarioCredenciales(usuario);
    setMostrarPassword(false);
    setMostrarCredenciales(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        if (editandoUsuario) {
          await actualizarUsuario({
            id: editandoUsuario.id,
            firstName: formFirstName,
            lastName: formLastName,
            ci: formCarnet,
            celular: formPhone,
            visibility: formVisibility,
            isActive: formStatus === "ACTIVO",
          });
          toast.success("Usuario actualizado correctamente");
        } else {
          const usernameFinal =
            formUsername || `${formFirstName}.${formLastName}`.toLowerCase().replace(/\s/g, "");
          const passwordFinal = formPassword || "temp123";
          const resultado = await crearUsuario({
            username: usernameFinal,
            email: `${usernameFinal}@sistema.com`,
            password: passwordFinal,
            ci: formCarnet,
            firstName: formFirstName,
            lastName: formLastName,
            celular: formPhone,
            roleId: formRoleId,
          });
          const userCreado = resultado.data?.createUser?.user;
          toast.success("Usuario creado correctamente");
          setMostrarFormulario(false);
          limpiarFormulario();
          setUsuarioCredenciales({
            id: userCreado?.id || "",
            username: userCreado?.username || usernameFinal,
            fullName: `${formFirstName} ${formLastName}`,
          } as Usuario);
          setCredencialesPassword(passwordFinal);
          setMostrarPassword(false);
          setMostrarCredenciales(true);
          return;
        }
        setMostrarFormulario(false);
        limpiarFormulario();
      } catch (error) {
        const mensaje =
          error instanceof Error
            ? error.message
            : "Error al guardar el usuario";
        toast.error(mensaje);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      editandoUsuario,
      formFirstName,
      formLastName,
      formCarnet,
      formPhone,
      formUsername,
      formPassword,
      formVisibility,
      formStatus,
      formRoleId,
      actualizarUsuario,
      crearUsuario,
      limpiarFormulario,
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
      />

      <Pagination
        currentPage={paginaActual}
        totalPages={paginas}
        onPageChange={setPaginaActual}
      />

      <ModalesUsuario
        mostrarFormulario={mostrarFormulario}
        alCerrarFormulario={() => {
          setMostrarFormulario(false);
          limpiarFormulario();
        }}
        formProps={{
          firstName: formFirstName,
          setFirstName: setFormFirstName,
          lastName: formLastName,
          setLastName: setFormLastName,
          carnet: formCarnet,
          setCarnet: setFormCarnet,
          phone: formPhone,
          setPhone: setFormPhone,
          username: formUsername,
          setUsername: setFormUsername,
          password: formPassword,
          setPassword: setFormPassword,
          roleId: formRoleId,
          setRoleId: setFormRoleId,
          status: formStatus,
          setStatus: setFormStatus,
          visibility: formVisibility,
          setVisibility: setFormVisibility,
          isEditing: !!editandoUsuario,
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
          setCredencialesPassword(undefined);
        }}
        usuarioCredenciales={usuarioCredenciales}
        mostrarPassword={mostrarPassword}
        alternarPassword={() => setMostrarPassword(!mostrarPassword)}
        credencialesPassword={credencialesPassword}
        mostrarExportar={mostrarExportar}
        alCerrarExportar={() => setMostrarExportar(false)}
        listaUsuarios={usuarios}
      />
    </div>
  );
};
