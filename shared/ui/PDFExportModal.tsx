'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Download, Eye, Filter } from 'lucide-react';
import Modal from "@/shared/ui/components/Modal";

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date-range' | 'text';
  options?: { value: string; label: string }[];
}

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  generatePDF: (filteredData: any[]) => any;
  fileName: string;
  filtersConfig?: FilterConfig[];
}

export function PDFExportModal({
  isOpen,
  onClose,
  title,
  data,
  generatePDF,
  fileName,
  filtersConfig = []
}: PDFExportModalProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        const config = filtersConfig.find(c => c.key === key);
        if (!config) return true;

        if (config.type === 'select') {
          return item[key] === value;
        }
        
        if (config.type === 'text') {
          return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
        }

        if (config.type === 'date-range') {
          const itemDate = new Date(item[key]);
          if (value.start && itemDate < new Date(value.start)) return false;
          if (value.end && itemDate > new Date(value.end)) return false;
          return true;
        }

        return true;
      });
    });
  }, [data, filters, filtersConfig]);

  const updatePreview = useCallback(() => {
    if (filteredData.length === 0) {
      setPdfUrl(null);
      return;
    }
    setIsPreviewLoading(true);
    try {
      const doc = generatePDF(filteredData);
      const url = doc.output('datauristring');
      
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [filteredData, generatePDF]);

  useEffect(() => {
    if (isOpen) {
      updatePreview();
    }
  }, [isOpen, updatePreview]);

  const handleDownload = () => {
    const doc = generatePDF(filteredData);
    doc.save(`${fileName}_${Date.now()}.pdf`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8 h-[70vh]">
        {/* Filters Sidebar */}
        <div className="lg:w-1/3 space-y-6 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 text-[#008080] mb-4">
            <Filter size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">Filtros de Exportación</h3>
          </div>

          <div className="space-y-4">
            {filtersConfig.map(config => (
              <div key={config.key} className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {config.label}
                </label>
                
                {config.type === 'select' && (
                  <select
                    value={filters[config.key] || 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, [config.key]: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                  >
                    <option value="all">Todos</option>
                    {config.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                {config.type === 'text' && (
                  <input
                    type="text"
                    value={filters[config.key] || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, [config.key]: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
                    placeholder={`Buscar por ${config.label.toLowerCase()}...`}
                  />
                )}

                {config.type === 'date-range' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters[config.key]?.start || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        [config.key]: { ...prev[config.key], start: e.target.value } 
                      }))}
                      className="w-full px-2 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-xs dark:text-white"
                    />
                    <input
                      type="date"
                      value={filters[config.key]?.end || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        [config.key]: { ...prev[config.key], end: e.target.value } 
                      }))}
                      className="w-full px-2 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-xs dark:text-white"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Resumen de Datos
              </p>
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Registros a exportar:</span>
                  <span className="text-lg font-bold text-[#008080]">{filteredData.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleDownload}
              className="w-full bg-[#008080] text-white py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20"
            >
              <Download size={20} />
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-black/20 rounded-[32px] overflow-hidden relative border border-gray-200 dark:border-white/5">
          {isPreviewLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-[#008080] uppercase tracking-widest">Generando Vista Previa...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              key={pdfUrl}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Eye size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">No hay vista previa disponible</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PDFExportModal;
