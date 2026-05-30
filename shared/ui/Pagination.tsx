'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const maxVisible = 10;
    const pages = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 4);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl border border-gray-200 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
      >
        <ChevronLeft size={18} className="dark:text-white" />
      </button>
      
      <div className="flex items-center gap-1">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
              currentPage === page
                ? 'bg-[#008080] text-white shadow-lg shadow-[#008080]/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {page}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl border border-gray-200 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
      >
        <ChevronRight size={18} className="dark:text-white" />
      </button>
    </div>
  );
}
