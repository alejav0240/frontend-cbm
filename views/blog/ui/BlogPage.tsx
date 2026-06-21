"use client";

import React from "react";
import { usePostsBlog } from "@/entities/blog";
import { Plus, Search, BookOpen, Clock, User as UserIcon } from "lucide-react";
import Image from "next/image";

export const BlogPage = () => {
  const { posts, cargando } = usePostsBlog();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Blog y Noticias
          </h1>
          <p className="text-gray-400 text-sm">
            Gestiona el contenido educativo y las novedades del centro
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus size={18} />
          Nuevo Artículo
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <div
            key={post.id}
            className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden group hover:border-[#008080] transition-all"
          >
            <div className="relative h-48 bg-gray-100 dark:bg-white/5">
              {post.urlImagen ? (
                <Image
                  src={post.urlImagen}
                  alt={post.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300">
                  <BookOpen size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-[#008080]">
                  {post.categoria}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <UserIcon size={12} />
                  <span>{post.autor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{post.tiempoLectura}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold dark:text-white mb-2 group-hover:text-[#008080] transition-colors">
                {post.titulo}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-6">
                {post.resumen}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    post.estado === "published"
                      ? "text-green-500"
                      : "text-amber-500"
                  }`}
                >
                  {post.estado === "published" ? "Publicado" : "Borrador"}
                </span>
                <button className="text-xs font-bold text-[#008080] uppercase tracking-widest hover:underline">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
