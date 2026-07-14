"use client";

import React, { useEffect, useRef } from "react";
import {
  Edit2,
  Eye,
  Save,
  X,
  Bold,
  Italic,
  Code,
  Link,
  Heading1,
  List,
  Quote,
  Sigma,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/shared/ui/form/InputField";
import { TextAreaField } from "@/shared/ui/form/TextAreaField";
import {
  esquemaPostBlog,
  FormularioPostBlog,
} from "@/entities/blog/model/esquema";
import { PostBlog } from "@/entities/blog";
import { BlogPreview } from "./BlogPreview";
import { useAuthStore } from "@/shared/model/useAuthStore";

const CATEGORIAS = [
  "Investigación",
  "Historias",
  "Técnicas",
  "Noticias",
  "Musicoterapia",
  "Eventos",
];

const DRAFT_KEY = "blog-draft";

interface BlogFormProps {
  postEditar?: PostBlog | null;
  onSubmit: (datos: FormularioPostBlog) => void | Promise<void>;
  onCancel: () => void;
  cargando?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

const TOOLBAR_ITEMS = [
  { icon: Heading1, label: "Título", syntax: "## ", wrap: false },
  { icon: Bold, label: "Negrita", syntax: "**", wrap: true },
  { icon: Italic, label: "Cursiva", syntax: "_", wrap: true },
  { icon: Link, label: "Enlace", syntax: "[texto](url)", wrap: false },
  { icon: List, label: "Lista", syntax: "- ", wrap: false },
  { icon: Quote, label: "Cita", syntax: "> ", wrap: false },
  { icon: Code, label: "Código", syntax: "```\n\n```", wrap: false },
  { icon: Sigma, label: "LaTeX", syntax: "$$ ", wrap: false },
];

function insertSyntax(textarea: HTMLTextAreaElement | null, syntax: string, wrap: boolean) {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);

  let newText: string;
  let cursorPos: number;

  if (wrap && selected) {
    newText = text.substring(0, start) + syntax + selected + syntax + text.substring(end);
    cursorPos = end + syntax.length * 2;
  } else {
    newText = text.substring(0, start) + syntax + text.substring(end);
    cursorPos = start + syntax.length;
  }

  textarea.value = newText;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.focus();
  textarea.setSelectionRange(cursorPos, cursorPos);
}

export function BlogForm({
  postEditar,
  onSubmit,
  onCancel,
  cargando = false,
  onDirtyChange,
}: BlogFormProps) {
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [showDraftRestore, setShowDraftRestore] = React.useState(false);
  const usuario = useAuthStore((s) => s.usuario);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<FormularioPostBlog>({
    resolver: zodResolver(esquemaPostBlog),
    defaultValues: {
      titulo: postEditar?.titulo ?? "",
      resumen: postEditar?.resumen ?? "",
      contenido: postEditar?.contenido ?? "",
      categoria: postEditar?.categoria ?? "",
      autor: postEditar?.autor ?? usuario?.fullName ?? "",
      urlImagen: postEditar?.urlImagen ?? "",
      tiempoLectura: postEditar?.tiempoLectura ?? "",
      estado: (postEditar?.estado as "DRAFT" | "PUBLISHED") ?? "DRAFT",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = form;

  const formValues = watch();
  const tieneLatex = /\$[^$]/.test(formValues.contenido);

  const { ref: contenidoRef, ...contenidoRest } = register("contenido");

  // Draft autosave
  useEffect(() => {
    if (postEditar) return;

    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.titulo || parsed.contenido) {
          setShowDraftRestore(true);
        }
      } catch {
        /* empty */
      }
    }
  }, [postEditar]);

  useEffect(() => {
    if (postEditar) return;
    if (!isDirty) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
    }, 1000);

    return () => clearTimeout(timer);
  }, [formValues, isDirty, postEditar]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const restoreDraft = () => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        reset(JSON.parse(saved));
      }
      setShowDraftRestore(false);
    } catch {
      /* empty */
    }
  };

  const discardDraft = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setShowDraftRestore(false);
  };

  const handleFormSubmit = async (datos: FormularioPostBlog) => {
    sessionStorage.removeItem(DRAFT_KEY);
    await onSubmit(datos);
  };

  const getImagePreviewUrl = () => {
    const url = formValues.urlImagen;
    if (!url) return null;
    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  };

  const imagePreviewUrl = getImagePreviewUrl();

  const handleInsertSyntax = (syntax: string, wrap: boolean) => {
    insertSyntax(textareaRef.current, syntax, wrap);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {showDraftRestore && (
        <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
            Se encontró un borrador sin guardar. ¿Deseas restaurarlo?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all"
            >
              Restaurar
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-all"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {tieneLatex && !isPreviewMode && (
        <p className="text-xs text-blue-500 flex items-center gap-1.5">
          <Sigma size={12} />
          Este contenido contiene LaTeX. Usa{" "}
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className="underline font-bold hover:text-blue-600"
          >
            Vista Previa
          </button>{" "}
          para verificar el renderizado.
        </p>
      )}

      <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-2xl gap-1">
        <button
          type="button"
          disabled={cargando}
          onClick={() => setIsPreviewMode(false)}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            !isPreviewMode
              ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          } disabled:opacity-50`}
        >
          <Edit2 size={14} />
          Editor
        </button>
        <button
          type="button"
          disabled={cargando}
          onClick={() => setIsPreviewMode(true)}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            isPreviewMode
              ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          } disabled:opacity-50`}
        >
          <Eye size={14} />
          Vista Previa
        </button>
      </div>

      {!isPreviewMode ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputField
              label="Título del Artículo"
              placeholder="Ej. Beneficios de la Musicoterapia"
              error={errors.titulo?.message}
              disabled={cargando}
              {...register("titulo")}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Categoría
                </label>
                <select
                  {...register("categoria")}
                  disabled={cargando}
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white bg-gray-50 dark:bg-white/5 border-transparent focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccionar...</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.categoria.message}
                  </p>
                )}
              </div>

              <InputField
                label="Tiempo de Lectura"
                placeholder="Ej. 5 min"
                error={errors.tiempoLectura?.message}
                disabled={cargando}
                {...register("tiempoLectura")}
              />
            </div>

            <div className="space-y-2">
              <InputField
                label="URL de Imagen"
                placeholder="https://..."
                error={
                  errors.urlImagen?.message === "URL inválida"
                    ? "URL inválida"
                    : undefined
                }
                disabled={cargando}
                {...register("urlImagen")}
              />
              {imagePreviewUrl && (
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <InputField
              label="Autor"
              placeholder="Nombre del autor"
              error={errors.autor?.message}
              disabled={cargando}
              {...register("autor")}
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Estado
              </label>
              <select
                {...register("estado")}
                disabled={cargando}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white bg-gray-50 dark:bg-white/5 border-transparent focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
              </select>
            </div>

            <TextAreaField
              label="Resumen"
              rows={3}
              placeholder="Breve resumen para la tarjeta del blog..."
              error={errors.resumen?.message}
              disabled={cargando}
              {...register("resumen")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Contenido (Markdown / LaTeX)
            </label>

            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-white/5 rounded-t-2xl border-b border-gray-200 dark:border-white/10">
              {TOOLBAR_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  disabled={cargando}
                  onClick={() => handleInsertSyntax(item.syntax, item.wrap)}
                  title={item.label}
                  className="p-2 rounded-lg text-gray-500 hover:text-[#008080] hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <item.icon size={15} />
                </button>
              ))}
            </div>

            <textarea
              {...contenidoRest}
              ref={(e) => {
                contenidoRef(e);
                textareaRef.current = e;
              }}
              disabled={cargando}
              className="w-full h-[380px] px-4 py-4 bg-gray-50 dark:bg-white/5 rounded-b-[24px] border-2 border-transparent focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white font-mono resize-none custom-scrollbar disabled:opacity-50"
              placeholder="# Título&#10;&#10;Escribe tu contenido usando Markdown...&#10;&#10;Soporta LaTeX: $E = mc^2$ o bloques:&#10;$$&#10;\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}&#10;$$"
            />
            {errors.contenido && (
              <p className="text-red-500 text-xs">
                {errors.contenido.message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <BlogPreview
          titulo={formValues.titulo}
          resumen={formValues.resumen}
          contenido={formValues.contenido}
          categoria={formValues.categoria}
          urlImagen={formValues.urlImagen}
        />
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
        <button
          type="button"
          onClick={onCancel}
          disabled={cargando}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
        >
          <X size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando}
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <Save size={16} />
              {postEditar ? "Guardar Cambios" : "Publicar Artículo"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
