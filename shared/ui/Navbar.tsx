"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// ===== CONSTANTES =====

const NAV_LINKS = [
  { name: "Inicio", href: "#inicio", section: "inicio" },
  { name: "Historia", href: "#historia", section: "historia" },
  { name: "Servicios", href: "#servicios", section: "servicios" },
  { name: "Galería", href: "#galeria", section: "galeria" },
  { name: "Blog", href: "/blog", section: "blog" },
  { name: "Equipo", href: "/equipo", section: "equipo" },
] as const;

const SECTIONS = ["inicio", "historia", "servicios", "galeria"] as const;

// ===== COMPONENTES REUTILIZABLES =====

const NavLink = ({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) => {
  const isAnchor = href.startsWith("#");
  const Component = isAnchor ? "a" : Link;

  return (
    <Component
      href={href}
      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
        active
          ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
          : "text-gray-500 dark:text-gray-400 hover:text-[#008080] dark:hover:text-white"
      }`}
    >
      {children}
    </Component>
  );
};

const MobileNavLink = ({
  href,
  children,
  onClick,
  active,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) => {
  const isAnchor = href.startsWith("#");
  const Component = isAnchor ? "a" : Link;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`w-full px-6 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
        active
          ? "bg-[#008080]/10 text-[#008080]"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
      }`}
    >
      {children}
      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#008080]" />}
    </Component>
  );
};

const ThemeToggle = ({
  mounted,
  isDarkMode,
  onToggle,
}: {
  mounted: boolean;
  isDarkMode: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-[#008080] transition-all"
    aria-label="Cambiar tema"
  >
    {mounted && (isDarkMode ? <Sun size={18} /> : <Moon size={18} />)}
  </button>
);

const CTALink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="bg-[#008080] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#006666] transition-all shadow-xl shadow-[#008080]/20 hover:-translate-y-0.5 active:translate-y-0"
  >
    {children}
  </Link>
);

// ===== COMPONENTE PRINCIPAL =====

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  // Memoizar links con href correcto según la página
  const navLinks = useMemo(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        href:
          link.href.startsWith("#") && !isHome ? `/${link.href}` : link.href,
      })),
    [isHome],
  );

  // Detectar si un link está activo
  const isLinkActive = useCallback(
    (link: (typeof navLinks)[0]) => {
      if (link.section === "blog") return !!pathname?.startsWith("/blog");
      if (link.section === "equipo") return !!pathname?.startsWith("/equipo");
      return isHome && activeSection === link.section;
    },
    [isHome, activeSection, pathname],
  );

  // Detectar sección activa en scroll
  const updateActiveSection = useCallback(() => {
    if (!isHome) return;

    const current = SECTIONS.find((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });

    if (current) setActiveSection(current);
  }, [isHome]);

  // Manejar scroll
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
    updateActiveSection();
  }, [updateActiveSection]);

  // Efectos
  useEffect(() => {
    setMounted(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Classes del navbar según scroll
  const navbarClasses = `fixed top-0 w-full z-50 transition-all duration-500 ${
    scrolled || !isHome
      ? "py-3 bg-white/90 dark:bg-background/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm"
      : "py-6 bg-transparent"
  }`;

  const handleThemeToggle = useCallback(() => {
    setTheme(isDarkMode ? "light" : "dark");
  }, [isDarkMode, setTheme]);

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-12 w-48 transition-transform group-hover:scale-105">
              <Image
                src="/logohorizontal.png"
                alt="Centro Boliviano de Musicoterapia"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav navLinks={navLinks} isLinkActive={isLinkActive} />

          {/* Desktop Actions */}
          <DesktopActions
            mounted={mounted}
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            ctaHref={isHome ? "#contacto" : "/#contacto"}
          />

          {/* Mobile Controls */}
          <MobileControls
            mounted={mounted}
            isDarkMode={isDarkMode}
            isMenuOpen={isMenuOpen}
            onThemeToggle={handleThemeToggle}
            onMenuToggle={() => setIsMenuOpen((prev) => !prev)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        navLinks={navLinks}
        isLinkActive={isLinkActive}
        onClose={() => setIsMenuOpen(false)}
        ctaHref={isHome ? "#contacto" : "/#contacto"}
      />
    </nav>
  );
}

// ===== SUBCOMPONENTES =====

const DesktopNav = ({
  navLinks,
  isLinkActive,
}: {
  navLinks: Array<{ name: string; href: string; section: string }>;
  isLinkActive: (link: any) => boolean;
}) => (
  <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
    {navLinks.map((link) => (
      <NavLink key={link.name} href={link.href} active={isLinkActive(link)}>
        {link.name}
      </NavLink>
    ))}
  </div>
);

const DesktopActions = ({
  mounted,
  isDarkMode,
  onThemeToggle,
  ctaHref,
}: {
  mounted: boolean;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  ctaHref: string;
}) => (
  <div className="hidden lg:flex items-center gap-4">
    <Link
      href="/login"
      className="text-sm font-bold text-gray-500 hover:text-[#008080] dark:text-gray-400 dark:hover:text-white transition-colors px-4"
    >
      Login
    </Link>
    <ThemeToggle
      mounted={mounted}
      isDarkMode={isDarkMode}
      onToggle={onThemeToggle}
    />
    <CTALink href={ctaHref}>Agendar Sesión</CTALink>
  </div>
);

const MobileControls = ({
  mounted,
  isDarkMode,
  isMenuOpen,
  onThemeToggle,
  onMenuToggle,
}: {
  mounted: boolean;
  isDarkMode: boolean;
  isMenuOpen: boolean;
  onThemeToggle: () => void;
  onMenuToggle: () => void;
}) => (
  <div className="lg:hidden flex items-center gap-3">
    <ThemeToggle
      mounted={mounted}
      isDarkMode={isDarkMode}
      onToggle={onThemeToggle}
    />
    <button
      onClick={onMenuToggle}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
        isMenuOpen
          ? "bg-[#008080] text-white"
          : "bg-gray-100 dark:bg-white/5 dark:text-white"
      }`}
      aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
    >
      {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  </div>
);

const MobileMenu = ({
  isOpen,
  navLinks,
  isLinkActive,
  onClose,
  ctaHref,
}: {
  isOpen: boolean;
  navLinks: Array<{ name: string; href: string; section: string }>;
  isLinkActive: (link: any) => boolean;
  onClose: () => void;
  ctaHref: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] lg:hidden"
          onClick={onClose}
        />

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-white dark:bg-background border-b border-black/5 dark:border-white/10 shadow-2xl lg:hidden overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 py-8 grid gap-4">
            {navLinks.map((link) => (
              <MobileNavLink
                key={link.name}
                href={link.href}
                onClick={onClose}
                active={isLinkActive(link)}
              >
                {link.name}
              </MobileNavLink>
            ))}

            <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />

            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center py-4 text-sm font-bold text-gray-500 dark:text-gray-400"
            >
              Iniciar Sesión
            </Link>

            <CTALink href={ctaHref}>Agendar Sesión</CTALink>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
