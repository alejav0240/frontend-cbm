"use client";

import React from "react";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { PostBlog } from "@/entities/blog";

interface BlogDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  post: PostBlog | null;
  cargando?: boolean;
}

export function BlogDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  post,
  cargando = false,
}: BlogDeleteModalProps) {
  if (!post) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Eliminar Artículo"
      message={`¿Estás seguro de que deseas eliminar el artículo "${post.titulo}"? Esta acción no se puede deshacer.`}
      confirmLabel={cargando ? "Eliminando..." : "Eliminar"}
      cancelLabel="Cancelar"
      variant="danger"
    />
  );
}
