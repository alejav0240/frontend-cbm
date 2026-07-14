"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { BlogForm } from "@/views/blog/ui/components/BlogForm";
import { PostBlog, FormularioPostBlog } from "@/entities/blog";

interface ModalBlogProps {
  isOpen: boolean;
  onClose: () => void;
  postEditar?: PostBlog | null;
  onSubmit: (datos: FormularioPostBlog) => void | Promise<void>;
  cargando?: boolean;
}

export function ModalBlog({
  isOpen,
  onClose,
  postEditar,
  onSubmit,
  cargando = false,
}: ModalBlogProps) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  const handleClose = useCallback(() => {
    if (formDirty) {
      setConfirmDiscard(true);
    } else {
      onClose();
    }
  }, [formDirty, onClose]);

  const handleConfirmDiscard = useCallback(() => {
    setConfirmDiscard(false);
    onClose();
  }, [onClose]);

  const handleCancelDiscard = useCallback(() => {
    setConfirmDiscard(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormDirty(false);
      setConfirmDiscard(false);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={postEditar ? "Editar Artículo" : "Nuevo Artículo"}
        maxWidth="max-w-4xl"
      >
        <BlogForm
          postEditar={postEditar}
          onSubmit={async (datos) => {
            await onSubmit(datos);
            setFormDirty(false);
            onClose();
          }}
          onCancel={handleClose}
          cargando={cargando}
          onDirtyChange={setFormDirty}
        />
      </Modal>

      {confirmDiscard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-accent rounded-[40px] p-8 max-w-sm mx-4 border border-white/20 dark:border-white/5 shadow-2xl">
            <h3 className="text-lg font-bold dark:text-white mb-2">
              Descartar cambios
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDiscard}
                className="px-5 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-5 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all text-sm shadow-lg"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
