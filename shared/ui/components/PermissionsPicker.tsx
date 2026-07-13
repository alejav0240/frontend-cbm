"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Search,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  PERMISSION_ACTIONS,
  PERMISSION_ACTION_LABELS,
  PERMISSION_MODULES,
  PermissionModule,
  expandModuleToPermissions,
} from "@/shared/data/permissions";

const MODULE_CATEGORIES = [
  {
    id: "atencion",
    nombre: "Atención",
    moduloIds: ["pacientes", "sesiones", "agenda", "evaluaciones", "planes", "escalas", "informes"],
  },
  {
    id: "operaciones",
    nombre: "Operaciones",
    moduloIds: ["pagos", "gastos", "inventario", "analisis", "instituciones"],
  },
  {
    id: "comunidad",
    nombre: "Comunidad",
    moduloIds: ["blog", "cursos", "recursos", "marketing"],
  },
  {
    id: "sistema",
    nombre: "Sistema",
    moduloIds: ["usuarios", "roles", "formularios", "ajustes"],
  },
];

function getModulesForCategory(categoryId: string): PermissionModule[] {
  const cat = MODULE_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return [];
  return PERMISSION_MODULES.filter((m) => cat.moduloIds.includes(m.id));
}

const totalPermisosPosibles = PERMISSION_MODULES.length * PERMISSION_ACTIONS.length;

interface PermissionsPickerProps {
  value: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export function PermissionsPicker({
  value,
  onChange,
  disabled = false,
}: PermissionsPickerProps) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriasAbiertas, setCategoriasAbiertas] = useState<Set<string>>(
    () => new Set(MODULE_CATEGORIES.map((c) => c.id)),
  );
  const [modulosExpandidos, setModulosExpandidos] = useState<Set<string>>(
    () => new Set(),
  );

  const modulosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return PERMISSION_MODULES;
    const term = busqueda.toLowerCase();
    return PERMISSION_MODULES.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term),
    );
  }, [busqueda]);

  const permisosActivosCount = value.length;

  const togglePermiso = (permission: string) => {
    onChange(
      value.includes(permission)
        ? value.filter((p) => p !== permission)
        : [...value, permission],
    );
  };

  const toggleModulo = (moduleId: string) => {
    const allPerms = expandModuleToPermissions(moduleId);
    const allActive = allPerms.every((p) => value.includes(p));

    if (allActive) {
      onChange(value.filter((p) => !p.startsWith(`${moduleId}:`)));
    } else {
      onChange([...new Set([...value, ...allPerms])]);
    }
  };

  const toggleCategoria = (categoryId: string) => {
    const modules = getModulesForCategory(categoryId);
    const allPerms = modules.flatMap((m) => expandModuleToPermissions(m.id));
    const allActive = allPerms.every((p) => value.includes(p));

    if (allActive) {
      const ids = new Set(modules.map((m) => m.id));
      onChange(
        value.filter((p) => {
          const moduleId = p.split(":")[0];
          return !ids.has(moduleId);
        }),
      );
    } else {
      onChange([...new Set([...value, ...allPerms])]);
    }
  };

  const seleccionarTodo = () => {
    onChange(
      PERMISSION_MODULES.flatMap((m) => expandModuleToPermissions(m.id)),
    );
  };

  const limpiarTodo = () => {
    onChange([]);
  };

  const toggleCategoriaAbierta = (categoryId: string) => {
    setCategoriasAbiertas((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const toggleModuloExpandido = (moduleId: string) => {
    setModulosExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const getModuloEstado = (moduleId: string) => {
    const allPerms = expandModuleToPermissions(moduleId);
    const activeCount = allPerms.filter((p) => value.includes(p)).length;
    const isChecked = activeCount === PERMISSION_ACTIONS.length;
    const isIndeterminate = activeCount > 0 && !isChecked;
    return { isChecked, isIndeterminate, activeCount };
  };

  const getCategoriaEstado = (categoryId: string) => {
    const modules = getModulesForCategory(categoryId);
    const allPerms = modules.flatMap((m) => expandModuleToPermissions(m.id));
    const activeCount = allPerms.filter((p) => value.includes(p)).length;
    return { activeCount, total: allPerms.length };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Módulos y Permisos
        </p>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008080]/10 rounded-lg shrink-0">
          <ShieldCheck size={14} className="text-[#008080]" />
          <span className="text-xs font-bold text-[#008080]">
            {permisosActivosCount}/{totalPermisosPosibles}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar módulo..."
            disabled={disabled}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-sm dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#008080]/30 transition-all disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={seleccionarTodo}
          disabled={disabled}
          className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#008080] bg-[#008080]/10 rounded-xl hover:bg-[#008080]/20 transition-colors shrink-0 disabled:opacity-50"
        >
          Todo
        </button>
        <button
          type="button"
          onClick={limpiarTodo}
          disabled={disabled}
          className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shrink-0 disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        {MODULE_CATEGORIES.map((categoria) => {
          const modulesInCat = getModulesForCategory(categoria.id);
          const visibleModules = modulesInCat.filter((m) =>
            modulosFiltrados.some((fm) => fm.id === m.id),
          );
          if (visibleModules.length === 0) return null;

          const catEstado = getCategoriaEstado(categoria.id);
          const catAbierta = categoriasAbiertas.has(categoria.id);

          return (
            <div key={categoria.id}>
              <button
                type="button"
                onClick={() => toggleCategoriaAbierta(categoria.id)}
                className="w-full flex items-center justify-between py-2 group"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoria(categoria.id);
                    }}
                    disabled={disabled}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      catEstado.activeCount === catEstado.total
                        ? "bg-[#008080] border-[#008080] text-white"
                        : catEstado.activeCount > 0
                          ? "bg-[#008080]/20 border-[#008080] text-[#008080]"
                          : "bg-white dark:bg-black/20 border-gray-300 dark:border-white/20"
                    }`}
                  >
                    {catEstado.activeCount === catEstado.total && (
                      <Check size={12} />
                    )}
                    {catEstado.activeCount > 0 &&
                      catEstado.activeCount < catEstado.total && (
                        <div className="w-2 h-0.5 bg-[#008080] rounded" />
                      )}
                  </button>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-[#008080] transition-colors">
                    {categoria.nombre}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {catEstado.activeCount}/{catEstado.total}
                  </span>
                </div>
                {catAbierta ? (
                  <ChevronDown size={14} className="text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {catAbierta && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 pb-1">
                      {visibleModules.map((modulo) => {
                        const { isChecked, isIndeterminate, activeCount } =
                          getModuloEstado(modulo.id);
                        const expandido = modulosExpandidos.has(modulo.id);
                        const activo = isChecked || isIndeterminate;

                        return (
                          <div
                            key={modulo.id}
                            className={`rounded-2xl border transition-all overflow-hidden ${
                              isChecked
                                ? "bg-[#008080]/5 border-[#008080]/40 shadow-sm shadow-[#008080]/5"
                                : isIndeterminate
                                  ? "bg-[#008080]/[0.02] border-[#008080]/20"
                                  : "bg-gray-50 dark:bg-white/[0.02] border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
                            }`}
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => !disabled && toggleModulo(modulo.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  if (!disabled) toggleModulo(modulo.id);
                                }
                              }}
                              className="w-full flex items-center gap-3 p-4 text-left cursor-pointer select-none"
                            >
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                                  isChecked
                                    ? "bg-[#008080] border-[#008080] text-white"
                                    : isIndeterminate
                                      ? "bg-[#008080]/20 border-[#008080]"
                                      : "bg-white dark:bg-black/20 border-gray-300 dark:border-white/20"
                                }`}
                              >
                                {isChecked && <Check size={12} />}
                                {isIndeterminate && (
                                  <div className="w-2 h-0.5 bg-[#008080] rounded" />
                                )}
                              </div>

                              <span className="text-xl leading-none">
                                {modulo.icon}
                              </span>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold dark:text-white truncate">
                                  {modulo.name}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                                  {activo
                                    ? `${activeCount} de ${PERMISSION_ACTIONS.length} permisos`
                                    : modulo.description}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleModuloExpandido(modulo.id);
                                }}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                                  expandido
                                    ? "bg-[#008080]/10 text-[#008080]"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10"
                                }`}
                                title="Ajustes individuales"
                              >
                                <SlidersHorizontal size={13} />
                              </button>
                            </div>

                            <AnimatePresence>
                              {expandido && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-1.5 border-t border-gray-100 dark:border-white/5">
                                    {PERMISSION_ACTIONS.map((action) => {
                                      const permission = `${modulo.id}:${action}`;
                                      const hasPermission =
                                        value.includes(permission);

                                      return (
                                        <button
                                          key={permission}
                                          type="button"
                                          disabled={disabled}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePermiso(permission);
                                          }}
                                          className={`px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${
                                            hasPermission
                                              ? "bg-[#008080] text-white shadow-sm"
                                              : "bg-white dark:bg-black/20 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/5"
                                          }`}
                                        >
                                          {PERMISSION_ACTION_LABELS[action]}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
