"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Calendar, User, Edit2, Trash2, BookOpen, Clock, Eye } from "lucide-react";
import { PostBlog } from "@/entities/blog";

interface BlogPostCardProps {
  post: PostBlog;
  onEdit: (post: PostBlog) => void;
  onDelete: (post: PostBlog) => void;
  onView: (post: PostBlog) => void;
  idx: number;
}

const estadoBorder: Record<string, string> = {
  PUBLISHED: "border-l-green-500",
  DRAFT: "border-l-amber-500",
};

export function BlogPostCard({ post, onEdit, onDelete, onView, idx }: BlogPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 border-l-[3px] overflow-hidden group hover:border-[#008080]/30 hover:border-l-[#008080] transition-all duration-300 hover:shadow-xl hover:shadow-[#008080]/5 flex flex-col ${estadoBorder[post.estado] || ""}`}
    >
      <div
        className="relative h-48 bg-gray-100 dark:bg-white/5 cursor-pointer"
        onClick={() => onView(post)}
      >
        {post.urlImagen ? (
          <Image
            src={post.urlImagen}
            alt={post.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 dark:text-white/10">
            <BookOpen size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-[#008080]">
            {post.categoria}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest ${
              post.estado === "PUBLISHED"
                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
            }`}
          >
            {post.estado === "PUBLISHED" ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{post.autor}</span>
          </div>
          {post.tiempoLectura && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{post.tiempoLectura}</span>
            </div>
          )}
        </div>

        <h3
          className="text-lg font-bold dark:text-white mb-2 cursor-pointer hover:text-[#008080] transition-colors line-clamp-2"
          onClick={() => onView(post)}
        >
          {post.titulo}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
          {post.resumen}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Calendar size={12} />
            {post.fechaCreacion instanceof Date
              ? post.fechaCreacion.toLocaleDateString()
              : new Date(post.fechaCreacion).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(post)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-[#008080] uppercase tracking-widest transition-colors"
              aria-label="Ver artículo"
            >
              <Eye size={12} />
            </button>
            <button
              onClick={() => onEdit(post)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#008080] hover:underline uppercase tracking-widest transition-colors"
            >
              <Edit2 size={12} />
              Editar
            </button>
            <button
              onClick={() => onDelete(post)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest transition-colors"
            >
              <Trash2 size={12} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
