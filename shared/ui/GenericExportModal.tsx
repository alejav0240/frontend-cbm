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
  /**
   * Cuando `key` apunta a un array (p. ej. `sesiones`), el filtro se aplica a
   * cada elemento usando la propiedad indicada en `itemKey` (p. ej. `ciclo`).
   */
  itemKey?: string;
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
// HELPERS
// ==========================

/**
 * Clave estable para guardar el valor de cada filtro en `filterValues`.
 * Con `itemKey` varios filtros pueden apuntar a la misma columna (p. ej.
 * ciclo/fecha/estado sobre `sesiones`), así que se incluyen itemKey y tipo.
 */
function filterId(filter: {
  key: string | number | symbol;
  itemKey?: string;
  type: FilterType;
}): string {
  return filter.itemKey
    ? `${String(filter.key)}::${filter.itemKey}::${filter.type}`
    : String(filter.key);
}

function parseFecha(value: string): Date | null {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const date = new Date(
      Number(match[3]),
      Number(match[2]) - 1,
      Number(match[1]),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function matchValue(
  raw: unknown,
  filter: { type: FilterType },
  filterValue: FilterValue,
): boolean {
  switch (filter.type) {
    case "text":
      if (raw !== null && typeof raw === "object") {
        return true;
      }
      return String(raw ?? "")
        .toLowerCase()
        .includes(String(filterValue ?? "").toLowerCase());

    case "select": {
      if (!filterValue || filterValue === "all") return true;
      return (
        String(raw ?? "")
          .trim()
          .toLowerCase() === String(filterValue).trim().toLowerCase()
      );
    }

    case "date-range": {
      if (!filterValue || typeof filterValue !== "object") return true;
      const date = parseFecha(String(raw ?? ""));
      if (!date) return true;
      if (filterValue.start) {
        const start = parseFecha(filterValue.start);
        if (start && date < start) return false;
      }
      if (filterValue.end) {
        const end = parseFecha(filterValue.end);
        if (end && date > end) return false;
      }
      return true;
    }

    default:
      return true;
  }
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
  /** Cantidad a mostrar en el resumen. Por defecto cuenta las filas. */
  summaryCount?: (rows: T[]) => number;
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
  summaryCount = (rows) => rows.length,
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
    return data
      .map((row) => {
        let keep = true;
        let next = row;

        for (const [key, value] of Object.entries(filterValues)) {
          if (!value || value === "all") continue;

          const filter = filters.find((f) => filterId(f) === key);
          if (!filter) continue;

          const rowValue = (next as Record<string, unknown>)[
            String(filter.key)
          ];

          if (filter.itemKey) {
            const items = Array.isArray(rowValue)
              ? (rowValue as unknown[])
              : [];
            const keptItems = items.filter((item) =>
              matchValue(
                (item as Record<string, unknown>)?.[filter.itemKey!],
                filter,
                value,
              ),
            );

            if (keptItems.length === 0) {
              keep = false;
              break;
            }

            next = {
              ...(next as object),
              [filter.key]: keptItems,
            } as T;
          } else if (!matchValue(rowValue, filter, value)) {
            keep = false;
            break;
          }
        }

        return keep ? next : null;
      })
      .filter((row): row is T => row !== null);
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

  const exportersRef = useRef(exporters);

  const [previewKey, setPreviewKey] = useState(0);

  // Resetear preview al cerrar y regenerar al abrir o cambiar filtros,
  // ajustando el estado durante el render (sin llamar a setState en un efecto).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setPdfUrl(null);
    } else {
      setFilterValues({});
      setPreviewKey((k) => k + 1);
    }
  }

  const [prevFilterValues, setPrevFilterValues] = useState(filterValues);
  if (filterValues !== prevFilterValues) {
    setPrevFilterValues(filterValues);
    if (isOpen) {
      setPreviewKey((k) => k + 1);
    }
  }

  // Mantener los refs sincronizados con los valores más recientes,
  // fuera del render (dentro de un efecto).
  useEffect(() => {
    filteredDataRef.current = filteredData;
    exportersRef.current = exporters;
  });

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
            <div key={filterId(filter)} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {filter.label}
              </label>

              {filter.type === "select" && (
                <select
                  value={(filterValues[filterId(filter)] as string) ?? "all"}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,

                      [filterId(filter)]: e.target.value,
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
                  value={(filterValues[filterId(filter)] as string) ?? ""}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,

                      [filterId(filter)]: e.target.value,
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

                        [filterId(filter)]: {
                          ...(prev[filterId(filter)] as {
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

                        [filterId(filter)]: {
                          ...(prev[filterId(filter)] as {
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
                  {summaryCount(filteredData)}
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
