"use client";

import React, { useMemo } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import {
  Usuario,
  UsuarioExportarFila,
  generarUsuariosPDF,
  generarUsuariosExcel,
} from "@/entities/usuario";
import { UserForm } from "./UserForm";
import { UserCredentialsModal } from "./UserCredentialsModal";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";

interface ModalesUsuarioProps {
  mostrarFormulario: boolean;
  alCerrarFormulario: () => void;
  formProps: {
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    carnet: string;
    setCarnet: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    username: string;
    setUsername: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    roleId: string;
    setRoleId: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    visibility: string;
    setVisibility: (val: string) => void;
    isEditing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
  };
  mostrarCredenciales: boolean;
  alCerrarCredenciales: () => void;
  usuarioCredenciales: Usuario | null;
  credencialesPassword?: string;
  mostrarPassword: boolean;
  alternarPassword: () => void;
  mostrarExportar: boolean;
  alCerrarExportar: () => void;
  listaUsuarios: Usuario[];
}

export const ModalesUsuario = ({
  mostrarFormulario,
  alCerrarFormulario,
  formProps,
  mostrarCredenciales,
  alCerrarCredenciales,
  usuarioCredenciales,
  credencialesPassword,
  mostrarPassword,
  alternarPassword,
  mostrarExportar,
  alCerrarExportar,
  listaUsuarios,
}: ModalesUsuarioProps) => {
  const datosExportacion = useMemo((): UsuarioExportarFila[] => {
    return listaUsuarios.map((u) => ({
      id: u.id,
      nombre: u.fullName || "",
      carnet: String(u.ci || ""),
      email: u.email || "",
      celular: String(u.celular || ""),
      rol: u.rol?.nombre || "",
      estado: u.isActive ? "ACTIVO" : "INACTIVO",
      visibilidad: u.status || "",
      username: u.username,
      fechaRegistro: "",
    }));
  }, [listaUsuarios]);

  const exporters = useMemo<Exporter<UsuarioExportarFila>[]>(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        async execute(data, columns, fileName) {
          const doc = await generarUsuariosPDF(data);
          doc.save(`${fileName}_${Date.now()}.pdf`);
        },
        async preview(data) {
          const doc = await generarUsuariosPDF(data);
          return doc.output("blob");
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        async execute(data) {
          await generarUsuariosExcel(data);
        },
      },
    ],
    [],
  );

  return (
    <>
      <Modal
        isOpen={mostrarFormulario}
        onClose={alCerrarFormulario}
        title={formProps.isEditing ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <UserForm
          firstName={formProps.firstName}
          setFirstName={formProps.setFirstName}
          lastName={formProps.lastName}
          setLastName={formProps.setLastName}
          carnet={formProps.carnet}
          setCarnet={formProps.setCarnet}
          phone={formProps.phone}
          setPhone={formProps.setPhone}
          username={formProps.username}
          setUsername={formProps.setUsername}
          password={formProps.password}
          setPassword={formProps.setPassword}
          roleId={formProps.roleId}
          setRoleId={formProps.setRoleId}
          status={formProps.status}
          setStatus={formProps.setStatus}
          visibility={formProps.visibility}
          setVisibility={formProps.setVisibility}
          onSubmit={formProps.onSubmit}
          onCancel={formProps.onCancel}
          isEditing={formProps.isEditing}
        />
      </Modal>

      <UserCredentialsModal
        isOpen={mostrarCredenciales}
        onClose={alCerrarCredenciales}
        user={usuarioCredenciales}
        showPassword={mostrarPassword}
        onTogglePassword={alternarPassword}
        password={credencialesPassword}
      />

      <GenericExportModal<UsuarioExportarFila>
        title="Exportar Usuarios"
        isOpen={mostrarExportar}
        onClose={alCerrarExportar}
        data={datosExportacion}
        fileName="usuarios"
        columns={[
          { key: "nombre", label: "Nombre" },
          { key: "carnet", label: "Carnet" },
          { key: "email", label: "Email" },
          { key: "celular", label: "Celular" },
          { key: "rol", label: "Rol" },
          { key: "estado", label: "Estado" },
          { key: "visibilidad", label: "Visibilidad" },
          { key: "username", label: "Usuario" },
        ]}
        filters={[
          {
            key: "rol",
            label: "Tipo de Usuario",
            type: "select",
            options: [
              { value: "TERAPEUTA", label: "Terapeuta" },
              { value: "ADMINISTRADOR", label: "Administrador" },
              { value: "SECRETARIA", label: "Secretaria" },
              { value: "RECEPCION", label: "Recepción" },
              { value: "TUTOR", label: "Tutor" },
            ],
          },
          {
            key: "estado",
            label: "Estado",
            type: "select",
            options: [
              { value: "ACTIVO", label: "Activo" },
              { value: "INACTIVO", label: "Inactivo" },
            ],
          },
          {
            key: "nombre",
            label: "Buscar por nombre",
            type: "text",
          },
        ]}
        exporters={exporters}
      />
    </>
  );
};
