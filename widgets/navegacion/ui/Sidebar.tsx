"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  History,
  ListChecks,
  Heart,
  Stethoscope,
  ClipboardList,
  Target,
  BarChart3,
  DollarSign,
  TrendingDown,
  Package,
  Megaphone,
  BookOpen,
  Building2,
  FileSearch,
  UserCog,
  Shield,
  Layout,
  Settings,
  X,
  ChevronRight,
  Menu,
  Play,
} from "lucide-react";
import { SidebarItem } from "@/shared/ui/components/SidebarItem";
import { canAccess } from "@/shared/data/permissions";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { useSidebar } from "@/shared/model/useInterfazStore";
import { useSesionActivaStore } from "@/entities/sesion";

export const Sidebar = () => {
  const { abierta, alternarSidebar, menuMovilAbierto, setMenuMovilAbierto } =
    useSidebar();
  const { sesion } = useSesionActivaStore();

  const [tiempoSesion, setTiempoSesion] = useState(0);

  useEffect(() => {
    if (!sesion?.inicio) return;
    const inicio = new Date(sesion.inicio).getTime();
    const tick = () => setTiempoSesion(Math.max(0, Math.floor((Date.now() - inicio) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sesion]);

  const formatearTiempo = (totalSegundos: number) => {
    const mins = Math.floor(totalSegundos / 60);
    const secs = totalSegundos % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const pathname = usePathname();
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuthStore();

  const menuGroups = [
    {
      title: "Sesión Activa",
      items: sesion
        ? [
            {
              id: "sesion-activa",
              href: "/dashboard/sesion-en-progreso",
              label: "En Progreso",
              icon: <Play size={18} className="text-red-500 animate-pulse" />,
            },
          ]
        : [],
    },
    {
      title: "Atención",
      items: [
        {
          id: "overview",
          href: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
        },
        {
          id: "pacientes",
          href: "/dashboard/pacientes",
          label: "Pacientes",
          icon: <Users size={18} />,
          permission: "pacientes",
        },
        {
          id: "agenda",
          href: "/dashboard/agenda",
          label: "Agenda",
          icon: <Calendar size={18} />,
          permission: "agenda",
        },
        {
          id: "sesiones",
          href: "/dashboard/sesiones",
          label: "Sesiones",
          icon: <History size={18} />,
          permission: "sesiones",
        },
        {
          id: "ciclos",
          href: "/dashboard/ciclos",
          label: "Ciclos",
          icon: <ListChecks size={18} />,
          permission: "pacientes",
        },
        {
          id: "portal-familiar",
          href: "/dashboard/portal-familiar",
          label: "Portal Familiar",
          icon: <Heart size={18} />,
        },
      ],
    },
    {
      title: "Clínica",
      items: [
        {
          id: "expedientes",
          href: "/dashboard/expedientes",
          label: "Expedientes",
          icon: <Stethoscope size={18} />,
          permission: "pacientes",
        },
        {
          id: "evaluaciones",
          href: "/dashboard/evaluaciones",
          label: "Evaluaciones",
          icon: <ClipboardList size={18} />,
          permission: "evaluaciones",
        },
        {
          id: "planes",
          href: "/dashboard/planes",
          label: "Planes",
          icon: <Target size={18} />,
          permission: "planes",
        },
        {
          id: "escalas",
          href: "/dashboard/escalas",
          label: "Escalas",
          icon: <ListChecks size={18} />,
          permission: "escalas",
        },
        {
          id: "informes",
          href: "/dashboard/informes",
          label: "Informes",
          icon: <FileText size={18} />,
          permission: "informes",
        },
      ],
    },
    {
      title: "Operaciones",
      items: [
        {
          id: "pagos",
          href: "/dashboard/pagos",
          label: "Pagos",
          icon: <DollarSign size={18} />,
          permission: "pagos",
        },
        {
          id: "gastos",
          href: "/dashboard/gastos",
          label: "Gastos",
          icon: <TrendingDown size={18} />,
          permission: "gastos",
        },
        {
          id: "inventario",
          href: "/dashboard/inventario",
          label: "Inventario",
          icon: <Package size={18} />,
          permission: "inventario",
        },
        {
          id: "analisis",
          href: "/dashboard/analisis",
          label: "Análisis",
          icon: <BarChart3 size={18} />,
          permission: "analisis",
        },
        {
          id: "instituciones",
          href: "/dashboard/instituciones",
          label: "Instituciones",
          icon: <Building2 size={18} />,
          permission: "instituciones",
        },
      ],
    },
    {
      title: "Comunidad",
      items: [
        {
          id: "blog",
          href: "/dashboard/blog",
          label: "Blog",
          icon: <Layout size={18} />,
          permission: "blog",
        },
        {
          id: "cursos",
          href: "/dashboard/cursos",
          label: "Cursos",
          icon: <BookOpen size={18} />,
          permission: "cursos",
        },
        {
          id: "recursos",
          href: "/dashboard/recursos",
          label: "Recursos",
          icon: <BookOpen size={18} />,
          permission: "recursos",
        },
        {
          id: "marketing",
          href: "/dashboard/marketing",
          label: "Marketing",
          icon: <Megaphone size={18} />,
          permission: "marketing",
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          id: "users",
          href: "/dashboard/usuarios",
          label: "Usuarios",
          icon: <UserCog size={18} />,
          permission: "usuarios",
        },
        {
          id: "roles",
          href: "/dashboard/roles",
          label: "Roles",
          icon: <Shield size={18} />,
          permission: "roles",
        },
        {
          id: "formularios",
          href: "/dashboard/formularios",
          label: "Formularios",
          icon: <FileSearch size={18} />,
          permission: "formularios",
        },
        {
          id: "ajustes",
          href: "/dashboard/ajustes",
          label: "Ajustes",
          icon: <Settings size={18} />,
          permission: "ajustes",
        },
      ],
    },
  ];

  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.permission) return true;
        return canAccess(usuario?.modules, item.permission);
      }),
    }))
    .filter((group) => group.items.length > 0);

  const handleLogout = async () => {
    await cerrarSesion();
    window.location.href = "/login";
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMenuMovilAbierto(false);
  };

  const sidebarWidth = abierta ? 280 : 80;

  return (
    <>
      {/* Backdrop móvil */}
      <AnimatePresence>
        {menuMovilAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuMovilAbierto(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Botón de apertura móvil */}
      <button
        onClick={() => setMenuMovilAbierto(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-accent p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar - Escritorio */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        className="bg-white/80 dark:bg-accent/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 flex flex-col sticky top-0 h-screen overflow-hidden z-50 hidden md:flex"
      >
        {/* Cabecera */}
        <div
          className={`p-8 flex items-center ${!abierta ? "justify-center" : "justify-between"}`}
        >
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
              <Image
                src="/logocortoicono.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            {abierta && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="font-bold text-xl dark:text-white tracking-tight serif whitespace-nowrap leading-none">
                  Musico<span className="text-[#008080]">terapia</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
                  Centro Integral
                </span>
              </motion.div>
            )}
          </Link>
          <button
            onClick={alternarSidebar}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ChevronRight
              size={20}
              className={`transition-transform duration-300 ${abierta ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide pb-8">
          {filteredGroups.map((group, idx) => (
            <div key={group.title}>
              {abierta && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4"
                >
                  {group.title}
                </motion.p>
              )}
              <div className="space-y-1">
                {group.items.map((item) =>
                  item.id === "sesion-activa" ? (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.href)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all font-medium text-sm group ${
                        pathname === item.href
                          ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                      } ${!abierta ? "justify-center px-0" : ""}`}
                      title={!abierta ? item.label : undefined}
                    >
                      <span
                        className={`transition-transform duration-300 ${
                          pathname === item.href
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {abierta && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {sesion && (
                            <span className="text-[10px] font-mono font-bold text-red-400 tabular-nums ml-2 shrink-0">
                              {formatearTiempo(tiempoSesion)}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  ) : (
                    <SidebarItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={pathname === item.href}
                      onClick={() => handleNavigation(item.href)}
                      collapsed={!abierta}
                    />
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Cerrar Sesión */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium text-sm group ${!abierta ? "justify-center px-0" : ""}`}
            title={!abierta ? "Cerrar Sesión" : undefined}
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform shrink-0"
            />
            {abierta && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>

      {/* Sidebar móvil - Drawer */}
      <AnimatePresence>
        {menuMovilAbierto && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed top-0 left-0 h-screen w-[280px] bg-white dark:bg-accent flex flex-col z-50 shadow-2xl md:hidden"
          >
            {/* Cabecera */}
            <div className="p-8 flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-3"
                onClick={() => setMenuMovilAbierto(false)}
              >
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src="/logocortoicono.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl dark:text-white tracking-tight serif whitespace-nowrap leading-none">
                    Musico<span className="text-[#008080]">terapia</span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
                    Centro Integral
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMenuMovilAbierto(false)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 space-y-8 overflow-y-auto pb-8">
              {filteredGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) =>
                      item.id === "sesion-activa" ? (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.href)}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all font-medium text-sm group ${
                            pathname === item.href
                              ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                          }`}
                        >
                          <span
                            className={`transition-transform duration-300 ${
                              pathname === item.href
                                ? "scale-110"
                                : "group-hover:scale-110"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <span className="truncate">{item.label}</span>
                            {sesion && (
                              <span className="text-[10px] font-mono font-bold text-red-400 tabular-nums ml-2 shrink-0">
                                {formatearTiempo(tiempoSesion)}
                              </span>
                            )}
                          </div>
                        </button>
                      ) : (
                        <SidebarItem
                          key={item.id}
                          icon={item.icon}
                          label={item.label}
                          active={pathname === item.href}
                          onClick={() => handleNavigation(item.href)}
                          collapsed={false}
                        />
                      ),
                    )}
                  </div>
                </div>
              ))}
            </nav>

            {/* Cerrar Sesión */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium text-sm group"
              >
                <LogOut
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform shrink-0"
                />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
