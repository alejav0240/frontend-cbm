"use client";

import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

interface BlogPreviewProps {
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  urlImagen?: string;
}

export function BlogPreview({
  titulo,
  resumen,
  contenido,
  categoria,
  urlImagen,
}: BlogPreviewProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[32px] p-8 md:p-12 border border-gray-100 dark:border-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 text-xs font-bold text-[#008080] uppercase tracking-widest mb-6">
          <span>{categoria}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <h1 className="serif text-4xl lg:text-5xl mb-4 dark:text-white">
          {titulo || "Sin Título"}
        </h1>
        {resumen && (
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 italic">
            {resumen}
          </p>
        )}
        {urlImagen && (
          <div className="aspect-video rounded-[32px] overflow-hidden mb-12 bg-gray-100 dark:bg-white/5 relative">
            <Image
              src={urlImagen}
              alt="Preview"
              fill
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:serif prose-headings:font-bold
          prose-p:text-gray-600 dark:prose-p:text-gray-300
          prose-a:text-[#008080] prose-a:no-underline hover:prose-a:underline
          prose-code:bg-gray-100 dark:prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10
          prose-blockquote:border-l-[#008080] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
          prose-img:rounded-2xl
          prose-table:border-collapse prose-th:bg-gray-50 dark:prose-th:bg-white/5
          max-h-[500px] overflow-y-auto custom-scrollbar"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          >
            {contenido || "*Sin contenido*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
