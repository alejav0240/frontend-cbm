"use client";

import React from "react";
import ConfirmModal from "@/shared/ui/ConfirmModal";

interface ModalEliminarSesionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  numeroSesion: number;
  cargando?: boolean;
}

export function ModalEliminarSesion({
  isOpen,
  onClose,
  onConfirm,
  numeroSesion,
  cargando,
}: ModalEliminarSesionProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Eliminar Sesión"
      message={`¿Estás seguro de eliminar la Sesión #${numeroSesion}? Esta acción no se puede deshacer.`}
      confirmLabel={cargando ? "Eliminando..." : "Eliminar"}
      cancelLabel="Cancelar"
      variant="danger"
    />
  );
}
