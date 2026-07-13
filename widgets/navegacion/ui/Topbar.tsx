"use client";

import React from "react";
import {
  Sun,
  Moon,
  Menu as MenuIcon,
  User,
  LogOut,
  ChevronDown,
  UserCircle,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { useSidebar } from "@/shared/model/useInterfazStore";
import { usePacienteSeleccionadoStore } from "@/entities/paciente";

export const Topbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { alternarSidebar, alternarMenuMovil } = useSidebar();
  const { usuario, cerrarSesion } = useAuthStore();
  usePacienteSeleccionadoStore();

  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await cerrarSesion();
    window.location.href = "/login";
  };

  const navigateTo = (path: string) => {
    setShowProfileMenu(false);
    router.push(path);
  };

  return (
    <header className="h-20 md:h-24 bg-white/60 dark:bg-background/60 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-20 transition-all duration-500">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              alternarMenuMovil();
            } else {
              alternarSidebar();
            }
          }}
          className="hidden md:flex p-2 md:p-3 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 rounded-2xl transition-all duration-300"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-3 text-gray-400 hover:text-[#008080] rounded-2xl transition-all"
        >
          {mounted &&
            (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
        </button>

        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-2" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center relative">
              {usuario?.foto ? (
                <Image
                  src={usuario.foto}
                  alt="Perfil"
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={20} className="text-gray-400" />
              )}
            </div>
            {usuario && (
              <span className="text-sm font-bold dark:text-white hidden sm:block">
                {usuario.fullName}
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 hidden sm:block transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-accent border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center relative shrink-0">
                    {usuario?.foto ? (
                      <Image
                        src={usuario.foto}
                        alt="Perfil"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm dark:text-white truncate">
                      {usuario?.fullName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {usuario?.email}
                    </p>
                    {usuario?.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#008080]/10 text-[#008080] rounded-full">
                        {usuario.role.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => navigateTo("/dashboard/mi-perfil")}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <UserCircle size={16} />
                  Mi Perfil
                </button>
                <button
                  onClick={() => navigateTo("/dashboard/ajustes")}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Settings size={16} />
                  Configuración
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-white/5 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
