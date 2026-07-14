"use client";

import React, { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  usePostsBlog,
  useCrearPostBlog,
  useActualizarPostBlog,
  useEliminarPostBlog,
  PostBlog,
  FormularioPostBlog,
} from "@/entities/blog";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { BlogHeader } from "./components/BlogHeader";
import { BlogPostCard } from "./components/BlogPostCard";
import { BlogSkeleton } from "./components/BlogSkeleton";
import { BlogFilters, BlogFiltros } from "./components/BlogFilters";
import { BlogStats } from "./components/BlogStats";
import { BlogDeleteModal } from "./components/BlogDeleteModal";
import { BlogViewModal } from "./components/BlogViewModal";
import { ModalBlog } from "@/features/gestion-blog";
import { Pagination } from "@/shared/ui/Pagination";
import { FileText } from "lucide-react";

const PAGE_SIZE = 9;

type Orden = "recientes" | "antiguos" | "a-z" | "z-a";

export function BlogPage() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtros, setFiltros] = useState<BlogFiltros>({
    busqueda: "",
    categoria: "",
    estado: "",
  });
  const [orden, setOrden] = useState<Orden>("recientes");

  const busquedaDebounced = useDebounce(filtros.busqueda, 300);

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [postSeleccionado, setPostSeleccionado] = useState<PostBlog | null>(
    null,
  );
  const [postAEliminar, setPostAEliminar] = useState<PostBlog | null>(null);

  const { posts, paginas, total, cargando, refetch } = usePostsBlog({
    page: paginaActual,
    pageSize: PAGE_SIZE,
    estado: filtros.estado || undefined,
  });

  const { crearPost, creando } = useCrearPostBlog();
  const { actualizarPost, actualizando } = useActualizarPostBlog();
  const { eliminarPost, eliminando } = useEliminarPostBlog();

  const postsFiltrados = useMemo(() => {
    let resultado = posts;

    if (busquedaDebounced) {
      const busqueda = busquedaDebounced.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.titulo.toLowerCase().includes(busqueda) ||
          p.resumen.toLowerCase().includes(busqueda),
      );
    }

    if (filtros.categoria) {
      resultado = resultado.filter((p) => p.categoria === filtros.categoria);
    }

    const sorted = [...resultado];
    switch (orden) {
      case "antiguos":
        sorted.sort(
          (a, b) =>
            new Date(a.fechaCreacion).getTime() -
            new Date(b.fechaCreacion).getTime(),
        );
        break;
      case "a-z":
        sorted.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "z-a":
        sorted.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.fechaCreacion).getTime() -
            new Date(a.fechaCreacion).getTime(),
        );
    }

    return sorted;
  }, [posts, busquedaDebounced, filtros.categoria, orden]);

  const handleCrear = useCallback(
    async (datos: FormularioPostBlog) => {
      try {
        await crearPost({
          title: datos.titulo,
          content: datos.contenido,
          category: datos.categoria,
          author: datos.autor,
          excerpt: datos.resumen,
          imageUrl: datos.urlImagen || undefined,
          readTime: datos.tiempoLectura || undefined,
          status: datos.estado,
        });
        toast.success("Artículo creado exitosamente");
        setModalCrearAbierto(false);
        refetch();
      } catch {
        toast.error("Error al crear el artículo");
      }
    },
    [crearPost, refetch],
  );

  const handleEditar = useCallback(
    async (datos: FormularioPostBlog) => {
      if (!postSeleccionado) return;
      try {
        await actualizarPost({
          id: postSeleccionado.id,
          title: datos.titulo,
          content: datos.contenido,
          category: datos.categoria,
          author: datos.autor,
          excerpt: datos.resumen,
          imageUrl: datos.urlImagen || undefined,
          readTime: datos.tiempoLectura || undefined,
          status: datos.estado,
        });
        toast.success("Artículo actualizado exitosamente");
        setModalEditarAbierto(false);
        setPostSeleccionado(null);
        refetch();
      } catch {
        toast.error("Error al actualizar el artículo");
      }
    },
    [postSeleccionado, actualizarPost, refetch],
  );

  const handleEliminar = useCallback(async () => {
    if (!postAEliminar) return;
    try {
      await eliminarPost(postAEliminar.id);
      toast.success("Artículo eliminado", {
        action: {
          label: "Deshacer",
          onClick: async () => {
            if (postAEliminar) {
              await crearPost({
                title: postAEliminar.titulo,
                content: postAEliminar.contenido,
                category: postAEliminar.categoria,
                author: postAEliminar.autor,
                excerpt: postAEliminar.resumen,
                imageUrl: postAEliminar.urlImagen || undefined,
                readTime: postAEliminar.tiempoLectura || undefined,
                status: postAEliminar.estado,
              });
              refetch();
              toast.success("Artículo restaurado");
            }
          },
        },
      });
      setPostAEliminar(null);
      refetch();
    } catch {
      toast.error("Error al eliminar el artículo");
    }
  }, [postAEliminar, eliminarPost, crearPost, refetch]);

  const abrirEditar = useCallback((post: PostBlog) => {
    setPostSeleccionado(post);
    setModalEditarAbierto(true);
  }, []);

  const abrirVer = useCallback((post: PostBlog) => {
    setPostSeleccionado(post);
    setModalVerAbierto(true);
  }, []);

  const abrirEliminar = useCallback((post: PostBlog) => {
    setPostAEliminar(post);
  }, []);

  return (
    <div className="space-y-8">
      <BlogHeader
        onCreateClick={() => setModalCrearAbierto(true)}
        total={total}
      />

      <BlogStats total={total} posts={posts} />

      <BlogFilters
        filtros={filtros}
        orden={orden}
        onFiltrosChange={(nuevosFiltros) => {
          setFiltros(nuevosFiltros);
          setPaginaActual(1);
        }}
        onOrdenChange={setOrden}
        totalResultado={postsFiltrados.length}
      />

      {cargando ? (
        <BlogSkeleton />
      ) : postsFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
            <FileText size={36} className="text-gray-300 dark:text-white/20" />
          </div>
          <h3 className="text-lg font-bold dark:text-white mb-2">
            No hay artículos
          </h3>
          <p className="text-gray-400 text-sm max-w-sm">
            {busquedaDebounced || filtros.categoria || filtros.estado
              ? "No se encontraron artículos con los filtros seleccionados. Intenta con otros criterios."
              : "Comienza creando tu primer artículo para el blog."}
          </p>
          {!busquedaDebounced && !filtros.categoria && !filtros.estado && (
            <button
              onClick={() => setModalCrearAbierto(true)}
              className="mt-6 bg-[#008080] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#006666] transition-all shadow-lg animate-pulse hover:animate-none"
            >
              Crear Artículo
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsFiltrados.map((post, idx) => (
            <BlogPostCard
              key={post.id}
              post={post}
              onEdit={abrirEditar}
              onDelete={abrirEliminar}
              onView={abrirVer}
              idx={idx}
            />
          ))}
        </div>
      )}

      {paginas > 1 && (
        <Pagination
          currentPage={paginaActual}
          totalPages={paginas}
          onPageChange={setPaginaActual}
        />
      )}

      <ModalBlog
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onSubmit={handleCrear}
        cargando={creando}
      />

      <ModalBlog
        isOpen={modalEditarAbierto}
        onClose={() => {
          setModalEditarAbierto(false);
          setPostSeleccionado(null);
        }}
        postEditar={postSeleccionado}
        onSubmit={handleEditar}
        cargando={actualizando}
      />

      <BlogViewModal
        isOpen={modalVerAbierto}
        onClose={() => {
          setModalVerAbierto(false);
          setPostSeleccionado(null);
        }}
        post={postSeleccionado}
      />

      <BlogDeleteModal
        isOpen={!!postAEliminar}
        onClose={() => setPostAEliminar(null)}
        onConfirm={handleEliminar}
        post={postAEliminar}
        cargando={eliminando}
      />
    </div>
  );
}
