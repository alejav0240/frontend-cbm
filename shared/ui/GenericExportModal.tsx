"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Eye, Filter } from "lucide-react";

import Modal from "@/shared/ui/components/Modal";

// ==========================
// TYPES
// ==========================

type FilterType = "select" | "text" | "date-range";
type FilterValue =
  | string
  | {
      start?: string;
      end?: string;
    }
  | undefined;

export interface ExportColumn<T> {
  key: keyof T;
  label: string;
  formatter?: (value: unknown, row: T) => string;
}

export interface ExportFilter<T> {
  key: keyof T;
  label: string;
  type: FilterType;
  options?: {
    value: string;
    label: string;
  }[];
}

export interface Exporter<T> {
  id: string;
  label: string;
  color?: string;

  execute(
    data: T[],
    columns: ExportColumn<T>[],
    fileName: string,
  ): Promise<void>;

  preview?(data: T[]): Promise<Blob>;
}

// ==========================
// PROPS
// ==========================

interface GenericExportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  columns: ExportColumn<T>[];
  fileName: string;
  filters?: ExportFilter<T>[];
  exporters: Exporter<T | void>[];
}

// ==========================
// COMPONENT
// ==========================

export default function GenericExportModal<T>({
  isOpen,
  onClose,
  title,
  data,
  columns,
  fileName,
  filters = [],
  exporters,
}: GenericExportModalProps<T>) {
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>(
    {},
  );

  const [loading, setLoading] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  /*
      |--------------------------------------------------------------------------
      | FILTER ENGINE
      |--------------------------------------------------------------------------
      */

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filterValues).every(([key, value]) => {
        if (!value || value === "all") return true;

        const filter = filters.find((f) => String(f.key) === key);

        if (!filter) return true;

        const rowValue = row[filter.key];

        switch (filter.type) {
          case "text":
            return String(rowValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());

          case "select":
            return rowValue === value;

          case "date-range":
            const date = new Date(String(rowValue));

            if (value && typeof value === "object") {
              if (value.start) {
                if (date < new Date(value.start)) return false;
              }

              if (value.end) {
                if (date > new Date(value.end)) return false;
              }
            }

            return true;

          default:
            return true;
        }
      });
    });
  }, [data, filters, filterValues]);

  /*
      |--------------------------------------------------------------------------
      | EXPORT
      |--------------------------------------------------------------------------
      */
  // Use refs to break the dependency-chain loop:
  // The preview effect only depends on stable/user-initiated values (isOpen, filterValues),
  // while derived data (filteredData, exporters) is read from refs.
  const filteredDataRef = useRef(filteredData);
  filteredDataRef.current = filteredData;

  const exportersRef = useRef(exporters);
  exportersRef.current = exporters;

  const [previewKey, setPreviewKey] = useState(0);

  // Signal the preview-effect when the modal opens or a filter changes.
  // isOpen and filterValues are stable — filterValues only changes on user interaction.
  useEffect(() => {
    if (!isOpen) {
      setPdfUrl(null);
      return;
    }
    setPreviewKey((k) => k + 1);
  }, [isOpen, filterValues]);

  // Actually generate the preview, reading latest data/exporters from refs.
  // Deps only include stable booleans/numbers so this effect never causes a loop.
  useEffect(() => {
    if (!isOpen || previewKey === 0) return;
    let cancelled = false;
    const generate = async () => {
      const data = filteredDataRef.current;
      if (data.length === 0) {
        setPdfUrl(null);
        return;
      }
      const pdfExporter = exportersRef.current.find((e) => e.id === "pdf");
      if (!pdfExporter?.preview) return;
      setIsPreviewLoading(true);
      try {
        const blob = await pdfExporter.preview(data);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        if (!cancelled) console.error("Error generating PDF preview:", error);
      } finally {
        if (!cancelled) setIsPreviewLoading(false);
      }
    };
    generate();
    return () => {
      cancelled = true;
    };
  }, [isOpen, previewKey]);

  const handleExport = async (exporter: Exporter<T>) => {
    try {
      setLoading(exporter.id);
      await exporter.execute(filteredData, columns, fileName);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
        {/* FILTERS */}
        <div className="lg:w-1/3 space-y-6 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 text-[#008080] mb-4">
            <Filter size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">
              Filtros de Exportación
            </h3>
          </div>

          {filters.map((filter) => (
            <div key={String(filter.key)} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {filter.label}
              </label>

              {filter.type === "select" && (
                <select
                  value={(filterValues[String(filter.key)] as string) ?? "all"}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,

                      [String(filter.key)]: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
                >
                  <option value="all">Todos</option>

                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === "text" && (
                <input
                  value={(filterValues[String(filter.key)] as string) ?? ""}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,

                      [String(filter.key)]: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
                  placeholder={`Buscar ${filter.label}`}
                />
              )}

              {filter.type === "date-range" && (
                <div className="grid grid-cols-2 gap-2 ">
                  <input
                    type="date"
                    onChange={(e) =>
                      setFilterValues((prev) => ({
                        ...prev,

                        [String(filter.key)]: {
                          ...(prev[String(filter.key)] as {
                            start?: string;
                            end?: string;
                          }),

                          start: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-2 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-xs dark:text-white"
                  />

                  <input
                    type="date"
                    onChange={(e) =>
                      setFilterValues((prev) => ({
                        ...prev,

                        [String(filter.key)]: {
                          ...(prev[String(filter.key)] as {
                            start?: string;
                            end?: string;
                          }),

                          end: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-2 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-xs dark:text-white"
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
                <span className="text-sm text-gray-500">
                  Registros a exportar:
                </span>
                <span className="text-lg font-bold text-[#008080]">
                  {filteredData.length}
                </span>
              </div>
            </div>
          </div>

          {/* EXPORT BUTTONS */}

          <div className="space-y-3 ">
            {exporters.map((exporter) => (
              <button
                key={exporter.id}
                disabled={loading !== null}
                onClick={() => handleExport(exporter)}
                className="w-full bg-[#008080] text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Download size={18} />

                {loading === exporter.id ? "Generando..." : exporter.label}
              </button>
            ))}
          </div>
        </div>

        {/* PREVIEW PLACEHOLDER */}

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-black/20 rounded-[32px] overflow-hidden relative border border-gray-200 dark:border-white/5">
          {isPreviewLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-[#008080] uppercase tracking-widest">
                  Generando Vista Previa...
                </p>
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
