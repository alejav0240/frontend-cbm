"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePostBlogPublico } from "@/entities/blog";
import { BlogPreview } from "./components/BlogPreview";

export function PublicBlogArticlePage({ slug }: { slug: string }) {
  const { post, cargando, error } = usePostBlogPublico(slug);

  if (cargando) {
    return (
      <div className="min-h-screen animate-pulse bg-[#fdfcfb] dark:bg-background" />
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#fdfcfb] px-6 text-center dark:bg-background">
        <h1 className="text-2xl font-bold dark:text-white">Artículo no encontrado</h1>
        <Link href="/blog" className="text-sm font-bold text-[#008080]">
          Volver al blog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfcfb] px-6 pb-20 pt-28 dark:bg-background md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#008080]"
        >
          <ArrowLeft size={14} /> Volver al blog
        </Link>
        <BlogPreview
          titulo={post.titulo}
          resumen={post.resumen}
          contenido={post.contenido}
          categoria={post.categoria}
          urlImagen={post.urlImagen}
          tipo={post.tipo}
          autor={post.autor}
          tiempoLectura={post.tiempoLectura}
          fechaCreacion={post.fechaCreacion}
          scrollable={false}
        />
      </div>
    </main>
  );
}
