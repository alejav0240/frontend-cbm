"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  reverse = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  reverse?: boolean;
}) {
  if (totalPages <= 1) return null;

  /**
   * Capa visual inversa.
   * Convierte la página interna a la página que se muestra.
   *
   * Ej:
   * internal 1 -> visual 16
   * internal 2 -> visual 15
   * internal 16 -> visual 1
   */
  const reverseLayer = (page: number) => {
    if (!reverse) return page;

    return totalPages - page + 1;
  };

  const getPageNumbers = () => {
    const maxVisible = 10;
    const pages = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 4);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Página anterior"
        className="p-2 rounded-xl border border-gray-200 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
      >
        <ChevronLeft size={18} className="dark:text-white" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              aria-label={`Página ${reverseLayer(1)}`}
              className="w-10 h-10 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              {reverseLayer(1)}
            </button>

            {pageNumbers[0] > 2 && (
              <span className="px-1 text-gray-400">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            aria-label={`Página ${reverseLayer(page)}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
              currentPage === page
                ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            {reverseLayer(page)}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}

            <button
              onClick={() => onPageChange(totalPages)}
              aria-label={`Página ${reverseLayer(totalPages)}`}
              className="w-10 h-10 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              {reverseLayer(totalPages)}
            </button>
          </>
        )}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Página siguiente"
        className="p-2 rounded-xl border border-gray-200 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
      >
        <ChevronRight size={18} className="dark:text-white" />
      </button>
    </div>
  );
}
