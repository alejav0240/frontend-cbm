"use client";

import React from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { BlogPreview } from "./BlogPreview";
import { PostBlog } from "@/entities/blog";

interface BlogViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostBlog | null;
}

export function BlogViewModal({ isOpen, onClose, post }: BlogViewModalProps) {
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={post.titulo} maxWidth="max-w-4xl">
      <BlogPreview
        titulo={post.titulo}
        resumen={post.resumen}
        contenido={post.contenido}
        categoria={post.categoria}
        urlImagen={post.urlImagen}
      />
    </Modal>
  );
}
