// components/Topbar.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu as MenuIcon,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  Music,
  BookOpen,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { NotificationItem } from "@/shared/ui/components/NotificationItem";
import { ProfileMenuItem } from "@/shared/ui/components/ProfileMenuItem";
import { useDashboardStore } from "@/shared/store/dashboardStore";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

// Tipos para los resultados de búsqueda
interface SearchResult {
  id: string | number;
  type: "patient" | "session" | "resource";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  action: () => void;
}

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const {
    toggleSidebar,
    toggleMobileMenu,
    setCurrentPage,
    setSelectedPatient,
  } = useDashboardStore();
  const { user, logout } = useAuthStore();

  // Estados locales
  const [mounted, setMounted] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = React.useState("");
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);

  // Datos mock (deberían venir del store/API)
  // TODO: dejar de usar datos mokup
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: "appointment",
      title: "Nueva cita agendada",
      message: "María García ha agendado una cita para mañana",
      time: "Hace 5 minutos",
      read: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Pago recibido",
      message: "Se ha recibido el pago de Juan Pérez",
      time: "Hace 1 hora",
      read: false,
    },
    {
      id: 3,
      type: "alert",
      title: "Sesión pendiente",
      message: "Tienes 3 sesiones por confirmar",
      time: "Hace 2 horas",
      read: true,
    },
  ]);

  const [patients] = React.useState([
    { id: "1", name: "María García", idNumber: "PAC-001" },
    { id: "2", name: "Juan Pérez", idNumber: "PAC-002" },
    { id: "3", name: "Ana Martínez", idNumber: "PAC-003" },
  ]);

  const [sessions] = React.useState([
    { id: 1, patientName: "María García", sessionNum: 5, date: "2024-01-15" },
    { id: 2, patientName: "Juan Pérez", sessionNum: 3, date: "2024-01-14" },
  ]);

  const [resources] = React.useState([
    { id: 1, title: "Guía de Musicoterapia", type: "PDF" },
    { id: 2, title: "Ejercicios terapéuticos", type: "Video" },
  ]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const markNotificationAsRead = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  // Generar resultados de búsqueda
  const searchResults = React.useMemo((): SearchResult[] => {
    if (!globalSearchTerm.trim()) return [];

    const term = globalSearchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Resultados de pacientes
    patients
      .filter((p) => p.name.toLowerCase().includes(term))
      .forEach((p) => {
        results.push({
          id: p.id,
          type: "patient",
          title: p.name,
          subtitle: p.idNumber,
          icon: <User size={14} />,
          iconColor: "bg-[#008080]/10 text-[#008080]",
          action: () => {
            setSelectedPatient(p);
            setCurrentPage("pacientes");
            setGlobalSearchTerm("");
            setShowMobileSearch(false);
          },
        });
      });

    // Resultados de sesiones
    sessions
      .filter((s) => s.patientName.toLowerCase().includes(term))
      .forEach((s) => {
        results.push({
          id: s.id,
          type: "session",
          title: `Sesión #${s.sessionNum} - ${s.patientName}`,
          subtitle: s.date,
          icon: <Music size={14} />,
          iconColor: "bg-blue-500/10 text-blue-500",
          action: () => {
            setCurrentPage("sesiones");
            setGlobalSearchTerm("");
            setShowMobileSearch(false);
          },
        });
      });

    // Resultados de recursos
    resources
      .filter((r) => r.title.toLowerCase().includes(term))
      .forEach((r) => {
        results.push({
          id: r.id,
          type: "resource",
          title: r.title,
          subtitle: r.type,
          icon: <BookOpen size={14} />,
          iconColor: "bg-purple-500/10 text-purple-500",
          action: () => {
            setCurrentPage("recursos");
            setGlobalSearchTerm("");
            setShowMobileSearch(false);
          },
        });
      });

    return results;
  }, [
    globalSearchTerm,
    patients,
    sessions,
    resources,
    setCurrentPage,
    setSelectedPatient,
  ]);

  // Handle global search (accesible desde cualquier parte)
  React.useEffect(() => {
    // Podrías emitir un evento o actualizar un store global con el término de búsqueda
    if (globalSearchTerm) {
      // Aquí podrías actualizar un store global de búsqueda si es necesario
      console.log("Búsqueda global:", globalSearchTerm);
    }
  }, [globalSearchTerm]);

  return (
    <>
      {/* Mobile Search Modal */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white dark:bg-accent md:hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-white/5 flex items-center gap-3">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-base"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowMobileSearch(false);
                  setGlobalSearchTerm("");
                }}
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={result.action}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${result.iconColor} flex items-center justify-center`}
                      >
                        {result.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium dark:text-white">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                globalSearchTerm && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No se encontraron resultados
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-20 md:h-24 bg-white/60 dark:bg-background/60 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-20 transition-all duration-500">
        {/* Left section */}
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          {/* Menu button */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                toggleMobileMenu();
              } else {
                toggleSidebar();
              }
            }}
            className="p-2 md:p-3 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 rounded-2xl transition-all duration-300 hover:rotate-90"
            aria-label="Toggle menu"
          >
            <MenuIcon size={20} className="md:w-[22px] md:h-[22px]" />
          </button>

          {/* Desktop search */}
          <div className="relative max-w-md w-full hidden md:block group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar pacientes, sesiones, reportes..."
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-white/5 border-2 border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080]/30 rounded-[24px] outline-none transition-all text-sm dark:text-white shadow-inner"
            />

            {/* Desktop search results */}
            <AnimatePresence>
              {globalSearchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-accent border border-gray-200 dark:border-white/10 rounded-[32px] shadow-2xl z-50 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
                >
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Resultados de búsqueda ({searchResults.length})
                        </p>
                      </div>
                      <div className="p-2">
                        {searchResults.map((result, idx) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={result.action}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all text-left group"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg ${result.iconColor} flex items-center justify-center`}
                            >
                              {result.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                                {result.title}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {result.subtitle}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-400 italic">
                        No se encontraron resultados para "{globalSearchTerm}"
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile search button */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden p-2 text-gray-400 hover:text-[#008080]"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all"
            aria-label="Toggle theme"
          >
            {mounted &&
              (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-white dark:bg-accent border border-gray-200 dark:border-white/10 rounded-[32px] shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                      <h3 className="font-bold dark:text-white">
                        Notificaciones
                      </h3>
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <span className="text-[10px] font-bold text-[#008080] bg-[#008080]/10 px-2 py-1 rounded-lg">
                          {notifications.filter((n) => !n.read).length} NUEVAS
                        </span>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <NotificationItem
                              icon={
                                notif.type === "appointment" ? (
                                  <Calendar size={16} />
                                ) : notif.type === "payment" ? (
                                  <DollarSign size={16} />
                                ) : notif.type === "alert" ? (
                                  <AlertCircle size={16} />
                                ) : (
                                  <Bell size={16} />
                                )
                              }
                              title={notif.title}
                              desc={notif.message}
                              time={notif.time}
                              color={
                                notif.type === "appointment"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : notif.type === "payment"
                                    ? "bg-green-500/10 text-green-500"
                                    : notif.type === "alert"
                                      ? "bg-red-500/10 text-red-500"
                                      : "bg-gray-500/10 text-gray-500"
                              }
                              isRead={notif.read}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400 text-sm italic">
                          No hay notificaciones
                        </div>
                      )}
                    </div>
                    <button className="w-full py-4 text-xs font-bold text-gray-400 hover:text-[#008080] transition-colors uppercase tracking-widest border-t border-gray-100 dark:border-white/5">
                      Ver todas las notificaciones
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-2" />

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 pr-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all group"
              aria-label="Profile menu"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-[#008080] transition-all relative bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                {user?.foto ? (
                  <Image
                    src={user.foto}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="text-gray-400" size={20} />
                )}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold dark:text-white leading-tight">
                  {user?.fullName ??
                    (user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : (user?.username ?? "Usuario"))}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {user?.role?.name ??
                    (user?.isStaff ? "Administrador" : "Personal")}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white dark:bg-accent border border-gray-200 dark:border-white/10 rounded-[32px] shadow-2xl z-50 p-2"
                  >
                    <ProfileMenuItem
                      icon={<User size={18} />}
                      label="Mi Perfil"
                      onClick={() => {
                        setCurrentPage("perfil");
                        setShowProfileMenu(false);
                      }}
                    />
                    <ProfileMenuItem
                      icon={<SettingsIcon size={18} />}
                      label="Configuración"
                      onClick={() => {
                        setCurrentPage("ajustes");
                        setShowProfileMenu(false);
                      }}
                    />
                    <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-2" />
                    <ProfileMenuItem
                      icon={<LogOutIcon size={18} />}
                      label="Cerrar Sesión"
                      onClick={handleLogout}
                      color="text-red-500"
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
