"use client";

import React from "react";
import { Search, Sun, Moon, Menu as MenuIcon, User } from "lucide-react";
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
  const { setPaciente } = usePacienteSeleccionadoStore();

  const [mounted, setMounted] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await cerrarSesion();
    window.location.href = "/login";
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
          className="p-2 md:p-3 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 rounded-2xl transition-all duration-300"
        >
          <MenuIcon size={20} />
        </button>

        <div className="relative max-w-md w-full hidden md:block group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-white/5 border-2 border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080]/30 rounded-[24px] outline-none transition-all text-sm shadow-inner"
          />
        </div>
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

        <div className="relative">
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
                {usuario.fullName.split(" ")[0]}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
