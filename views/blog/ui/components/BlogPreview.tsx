"use client";

import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { LatexRenderer } from "./LatexRenderer";
import { FileText, Sigma } from "lucide-react";

interface BlogPreviewProps {
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  urlImagen?: string;
  tipo?: "MARKDOWN" | "LATEX" | string;
}

export function BlogPreview({
  titulo,
  resumen,
  contenido,
  categoria,
  urlImagen,
  tipo = "MARKDOWN",
}: BlogPreviewProps) {
  const esLatex = tipo?.toUpperCase() === "LATEX";

  return (
    <div className="bg-white dark:bg-[#111] rounded-[32px] p-8 md:p-12 border border-gray-100 dark:border-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 text-xs font-bold text-[#008080] uppercase tracking-widest mb-6 flex-wrap">
          <span>{categoria}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
              esLatex
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                : "bg-[#008080]/10 text-[#008080] dark:bg-[#008080]/20 border border-[#008080]/20"
            }`}
          >
            {esLatex ? <Sigma size={12} /> : <FileText size={12} />}
            {esLatex ? "LaTeX" : "Markdown"}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-gray-400 font-normal">{new Date().toLocaleDateString()}</span>
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
          {esLatex ? (
            <LatexRenderer content={contenido} />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {contenido || "*Sin contenido*"}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
