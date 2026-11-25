"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { usePostsBlogPublicos } from "@/entities/blog";

export function PublicBlogPage() {
  const { posts, cargando, error } = usePostsBlogPublicos();

  return (
    <main className="min-h-screen bg-[#fdfcfb] dark:bg-background">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#008080]">
            Centro Boliviano de Musicoterapia
          </p>
          <h1 className="serif text-4xl font-bold text-gray-900 dark:text-white md:text-6xl">
            Ideas para acompañar mejor
          </h1>
          <p className="mt-5 text-base text-gray-500 dark:text-gray-400 md:text-lg">
            Artículos sobre musicoterapia, bienestar y desarrollo humano.
          </p>
        </div>

        {cargando ? (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-[32px] bg-white dark:bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <p className="mx-auto mt-16 max-w-md text-center text-sm text-red-500">
            No pudimos cargar los artículos. Intentá nuevamente más tarde.
          </p>
        ) : posts.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md rounded-[32px] bg-white p-10 text-center shadow-sm dark:bg-white/5">
            <BookOpen className="mx-auto mb-4 text-[#008080]" size={36} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Todavía no hay artículos publicados.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-[#111]"
              >
                <div className="flex w-full flex-col">
                  <div className="relative h-56 bg-[#008080]/10">
                    {post.urlImagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.urlImagen}
                        alt={post.titulo}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <BookOpen
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#008080]/40"
                        size={48}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#008080]">
                      {post.categoria}
                    </span>
                    <h2 className="mt-3 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                      {post.titulo}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {post.resumen || post.contenido.slice(0, 150)}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:border-white/10">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.fechaCreacion).toLocaleDateString()}
                      </span>
                      {post.tiempoLectura && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.tiempoLectura}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#008080]"
                    >
                      Leer artículo <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
