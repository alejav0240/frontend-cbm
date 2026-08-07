"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

const ESTADO_OPCIONES = [
  { label: "Todos los estados", value: "all" },
  { label: "Agendada", value: "AGENDADA", color: "bg-blue-500" },
  { label: "Confirmada", value: "CONFIRMA", color: "bg-emerald-500" },
  { label: "Completada", value: "COMPLETA", color: "bg-green-500" },
  { label: "Reprogramada", value: "REPROGRAMA", color: "bg-orange-500" },
  { label: "Cancelada", value: "CANCELADA", color: "bg-red-500" },
];

const ESTADO_PAGO_OPCIONES = [
  { label: "Todos los pagos", value: "all" },
  { label: "Pagado", value: "PAID", color: "bg-green-500" },
  { label: "Parcial", value: "PARTIAL", color: "bg-yellow-500" },
  { label: "Pendiente", value: "PENDING", color: "bg-orange-500" },
  { label: "Exento", value: "EXEMPT", color: "bg-purple-500" },
];

const TIPO_OPCIONES = [
  { label: "Todos los tipos", value: "all" },
  { label: "Individual", value: "individual" },
  { label: "Grupal", value: "group" },
];

const PERIODO_OPCIONES = [
  { label: "Todo el historial", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
];

function calcularRango(presete: string): { fechaDesde: string; fechaHasta: string } {
  const hoy = new Date();
  const formato = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;

  if (presete === "today") {
    const s = formato(hoy);
    return { fechaDesde: s, fechaHasta: s };
  }
  if (presete === "week") {
    const lunes = new Date(hoy);
    const dia = hoy.getDay() || 7;
    lunes.setDate(hoy.getDate() - dia + 1);
    return { fechaDesde: formato(lunes), fechaHasta: formato(hoy) };
  }
  if (presete === "month") {
    const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return { fechaDesde: formato(primero), fechaHasta: formato(hoy) };
  }
  return { fechaDesde: "", fechaHasta: "" };
}

interface FiltrosSesionesProps {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  filtroEstado: string;
  onEstadoChange: (value: string) => void;
  filtroTipo: string;
  onTipoChange: (value: string) => void;
  filtroTerapeuta: string;
  onTerapeutaChange: (value: string) => void;
  terapeutaOpciones?: { label: string; value: string }[];
  filtroEstadoPago: string;
  onEstadoPagoChange: (value: string) => void;
  filtroPeriodo: string;
  onPeriodoChange: (value: string) => void;
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
}

export function FiltrosSesiones({
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onEstadoChange,
  filtroTipo,
  onTipoChange,
  filtroTerapeuta,
  onTerapeutaChange,
  terapeutaOpciones = [],
  filtroEstadoPago,
  onEstadoPagoChange,
  filtroPeriodo,
  onPeriodoChange,
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
}: FiltrosSesionesProps) {
  const aplicarPresete = (presete: string) => {
    onPeriodoChange(presete);
    if (presete === "all") {
      onFechaDesdeChange("");
      onFechaHastaChange("");
      return;
    }
    const { fechaDesde: fd, fechaHasta: fh } = calcularRango(presete);
    onFechaDesdeChange(fd);
    onFechaHastaChange(fh);
  };

  const terapeutaOpcionesFinal = [
    { label: "Todos los terapeutas", value: "" },
    ...terapeutaOpciones,
  ];

  const chips: { label: string; onRemove: () => void }[] = [];

  if (filtroEstado !== "all") {
    const opt = ESTADO_OPCIONES.find((o) => o.value === filtroEstado);
    chips.push({
      label: opt?.label ?? filtroEstado,
      onRemove: () => onEstadoChange("all"),
    });
  }
  if (filtroEstadoPago !== "all") {
    const opt = ESTADO_PAGO_OPCIONES.find((o) => o.value === filtroEstadoPago);
    chips.push({
      label: opt?.label ?? filtroEstadoPago,
      onRemove: () => onEstadoPagoChange("all"),
    });
  }
  if (filtroTipo !== "all") {
    const opt = TIPO_OPCIONES.find((o) => o.value === filtroTipo);
    chips.push({
      label: opt?.label ?? filtroTipo,
      onRemove: () => onTipoChange("all"),
    });
  }
  if (filtroTerapeuta) {
    const opt = terapeutaOpcionesFinal.find((o) => o.value === filtroTerapeuta);
    chips.push({
      label: opt?.label ?? filtroTerapeuta,
      onRemove: () => onTerapeutaChange(""),
    });
  }
  if (fechaDesde || fechaHasta) {
    chips.push({
      label: `${fechaDesde || "…"} → ${fechaHasta || "…"}`,
      onRemove: () => {
        onPeriodoChange("all");
        onFechaDesdeChange("");
        onFechaHastaChange("");
      },
    });
  }
  if (busqueda) {
    chips.push({
      label: `Búsqueda: "${busqueda}"`,
      onRemove: () => onBusquedaChange(""),
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="search-sesiones" className="sr-only">Buscar sesiones</label>
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="search-sesiones"
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por paciente o terapeuta..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white placeholder:text-gray-400"
          />
          {busqueda && (
            <button
              onClick={() => onBusquedaChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <SearchableSelect
          options={ESTADO_OPCIONES}
          value={filtroEstado}
          onChange={onEstadoChange}
          placeholder="Estado"
          clearable={false}
          className="min-w-[170px]"
        />

        <SearchableSelect
          options={ESTADO_PAGO_OPCIONES}
          value={filtroEstadoPago}
          onChange={onEstadoPagoChange}
          placeholder="Estado de pago"
          clearable={false}
          className="min-w-[170px]"
        />

        <SearchableSelect
          options={TIPO_OPCIONES}
          value={filtroTipo}
          onChange={onTipoChange}
          placeholder="Tipo"
          clearable={false}
          className="min-w-[150px]"
        />

        {terapeutaOpcionesFinal.length > 1 && (
          <SearchableSelect
            options={terapeutaOpcionesFinal}
            value={filtroTerapeuta}
            onChange={onTerapeutaChange}
            placeholder="Terapeuta"
            clearable={false}
            className="min-w-[170px]"
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchableSelect
          options={PERIODO_OPCIONES}
          value={filtroPeriodo}
          onChange={aplicarPresete}
          placeholder="Periodo"
          clearable={false}
          className="min-w-[160px]"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="fecha-desde" className="sr-only">Fecha desde</label>
          <input
            id="fecha-desde"
            type="date"
            value={fechaDesde}
            onChange={(e) => {
              onFechaDesdeChange(e.target.value);
              onPeriodoChange("all");
            }}
            className="px-3 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white text-gray-500 dark:text-gray-300"
          />
          <span className="text-gray-400 text-xs">→</span>
          <label htmlFor="fecha-hasta" className="sr-only">Fecha hasta</label>
          <input
            id="fecha-hasta"
            type="date"
            value={fechaHasta}
            min={fechaDesde || undefined}
            onChange={(e) => {
              onFechaHastaChange(e.target.value);
              onPeriodoChange("all");
            }}
            className="px-3 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white text-gray-500 dark:text-gray-300"
          />
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Filtros activos
          </span>
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008080]/10 text-[#008080] rounded-full text-xs font-bold transition-all hover:bg-[#008080]/20 group"
            >
              {chip.label}
              <X
                size={12}
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </button>
          ))}
          <button
            onClick={() => {
              onBusquedaChange("");
              onEstadoChange("all");
              onEstadoPagoChange("all");
              onTipoChange("all");
              onTerapeutaChange("");
              onPeriodoChange("all");
              onFechaDesdeChange("");
              onFechaHastaChange("");
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-[#008080] uppercase tracking-widest transition-colors ml-1"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
