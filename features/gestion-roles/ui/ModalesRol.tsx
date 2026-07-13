"use client";

import React, { useCallback } from "react";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { useCrearRol, useActualizarRol, useEliminarRol } from "@/entities/rol";
import { DatosFormularioRol } from "@/entities/rol/model/esquema";
import { toast } from "sonner";
import { RoleFormModal } from "@/views/roles/ui/components/RoleFormModal";
import { PermissionsModal } from "@/views/roles/ui/components/PermissionsModal";
import { useRolesStore } from "@/shared/model/useRolesStore";

export function ModalesRol() {
  const {
    rolesSeleccionadas,
    mostrarFormulario,
    mostrarPermisos,
    mostrarEliminar,
    acciones,
  } = useRolesStore();

  const { crear } = useCrearRol();
  const { actualizar } = useActualizarRol();
  const { eliminar } = useEliminarRol();

  const handleCrearRol = useCallback(
    async (datos: DatosFormularioRol) => {
      try {
        await crear({ name: datos.nombre, permissions: datos.permisos });
        toast.success(`Rol "${datos.nombre}" creado correctamente`);
        acciones.cerrarFormulario();
      } catch {
        toast.error("Error al crear el rol");
      }
    },
    [crear, acciones],
  );

  const handleEditarRol = useCallback(
    async (datos: DatosFormularioRol) => {
      if (rolesSeleccionadas.length !== 1) return;
      try {
        await actualizar({
          id: rolesSeleccionadas[0].id,
          name: datos.nombre,
          permissions: datos.permisos,
        });
        toast.success(`Rol "${datos.nombre}" actualizado correctamente`);
        acciones.cerrarFormulario();
      } catch {
        toast.error("Error al actualizar el rol");
      }
    },
    [rolesSeleccionadas, actualizar, acciones],
  );

  const handleGuardarPermisosLote = useCallback(
    async (permisos: string[]) => {
      const resultados = await Promise.allSettled(
        rolesSeleccionadas.map((rol) =>
          actualizar({ id: rol.id, permissions: permisos }),
        ),
      );

      const exitos = resultados.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const fallos = resultados.filter(
        (r) => r.status === "rejected",
      ).length;

      if (fallos === 0) {
        toast.success(
          `Permisos actualizados para ${exitos} ${exitos === 1 ? "rol" : "roles"}`,
        );
      } else {
        toast.warning(
          `${exitos} ${exitos === 1 ? "rol actualizado" : "roles actualizados"}, ${fallos} fallaron`,
        );
      }
      acciones.cerrarPermisos();
    },
    [rolesSeleccionadas, actualizar, acciones],
  );

  const handleEliminar = useCallback(async () => {
    const resultados = await Promise.allSettled(
      rolesSeleccionadas.map((rol) => eliminar(rol.id)),
    );

    const exitos = resultados.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const fallos = resultados.filter(
      (r) => r.status === "rejected",
    ).length;

    if (fallos === 0) {
      toast.success(
        `${exitos} ${exitos === 1 ? "rol eliminado" : "roles eliminados"}`,
      );
    } else {
      toast.warning(
        `${exitos} ${exitos === 1 ? "rol eliminado" : "roles eliminados"}, ${fallos} fallaron`,
      );
    }
    acciones.deselectTodas();
    acciones.cerrarEliminar();
  }, [rolesSeleccionadas, eliminar, acciones]);

  const rolEditando =
    mostrarFormulario && rolesSeleccionadas.length === 1
      ? rolesSeleccionadas[0]
      : null;

  return (
    <>
      <RoleFormModal
        isOpen={mostrarFormulario}
        onClose={acciones.cerrarFormulario}
        onSubmit={rolEditando ? handleEditarRol : handleCrearRol}
        initialValues={
          rolEditando
            ? { nombre: rolEditando.nombre, permisos: rolEditando.permisos }
            : undefined
        }
      />

      <PermissionsModal
        isOpen={mostrarPermisos}
        onClose={acciones.cerrarPermisos}
        rolesSeleccionadas={rolesSeleccionadas}
        onGuardar={handleGuardarPermisosLote}
        estaActualizando={false}
      />

      <ConfirmModal
        isOpen={mostrarEliminar}
        onClose={acciones.cerrarEliminar}
        onConfirm={handleEliminar}
        title="Eliminar Roles"
        message={
          rolesSeleccionadas.length === 1
            ? `¿Estás seguro de que deseas eliminar el rol "${rolesSeleccionadas[0]?.nombre}"? Esta acción no se puede deshacer.`
            : `¿Estás seguro de que deseas eliminar ${rolesSeleccionadas.length} roles? Esta acción no se puede deshacer y afectará a todos los usuarios asignados.`
        }
        confirmLabel={
          rolesSeleccionadas.length === 1
            ? "Eliminar Rol"
            : `Eliminar ${rolesSeleccionadas.length} Roles`
        }
      />
    </>
  );
}
