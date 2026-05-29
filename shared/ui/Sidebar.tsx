// ui/Sidebar.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import {
    LayoutDashboard, Users, Calendar, FileText, LogOut, History, ListChecks, Heart,
    Stethoscope, ClipboardList, Target, BarChart3, DollarSign, TrendingDown, Package,
    Megaphone, BookOpen, Building2, FileSearch, UserCog, Shield, Layout, Settings,
    X, ChevronRight, Menu
} from 'lucide-react';
import {SidebarItem} from "@/shared/ui/components/SidebarItem";
import {canAccess} from "@/shared/data/permissions";
import {useAuthStore} from "@/modules/auth/hooks/useAuthStore";
import {PageType, useDashboardStore} from "@/shared/store/dashboardStore";

export default function Sidebar() {
    const {
        sidebarOpen,
        currentPage,
        setCurrentPage,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen
    } = useDashboardStore();

    const { user, logout } = useAuthStore();

    const menuGroups = [
        {
            title: 'Atención',
            items: [
                { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
                { id: 'patients', label: 'Pacientes', icon: <Users size={18} />, permission: 'pacientes' },
                { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} />, permission: 'agenda' },
                { id: 'sessions', label: 'Sesiones', icon: <History size={18} />, permission: 'sesiones' },
                { id: 'cycles', label: 'Ciclos', icon: <ListChecks size={18} />, permission: 'pacientes' },
                { id: 'family-portal', label: 'Portal Familiar', icon: <Heart size={18} /> },
            ]
        },
        {
            title: 'Clínica',
            items: [
                { id: 'clinical', label: 'Expedientes', icon: <Stethoscope size={18} />, permission: 'pacientes' },
                { id: 'evaluations', label: 'Evaluaciones', icon: <ClipboardList size={18} />, permission: 'evaluaciones' },
                { id: 'intervention-plan', label: 'Planes', icon: <Target size={18} />, permission: 'planes' },
                { id: 'scales', label: 'Escalas', icon: <ListChecks size={18} />, permission: 'escalas' },
                { id: 'therapy-reports', label: 'Informes', icon: <FileText size={18} />, permission: 'informes' },
            ]
        },
        {
            title: 'Operaciones',
            items: [
                { id: 'payments', label: 'Pagos', icon: <DollarSign size={18} />, permission: 'pagos' },
                { id: 'expenses', label: 'Gastos', icon: <TrendingDown size={18} />, permission: 'gastos' },
                { id: 'inventory', label: 'Inventario', icon: <Package size={18} />, permission: 'inventario' },
                { id: 'reports', label: 'Análisis', icon: <BarChart3 size={18} />, permission: 'analisis' },
                { id: 'institutions', label: 'Instituciones', icon: <Building2 size={18} />, permission: 'instituciones' },
            ]
        },
        {
            title: 'Comunidad',
            items: [
                { id: 'blog', label: 'Blog', icon: <Layout size={18} />, permission: 'blog' },
                { id: 'courses', label: 'Cursos', icon: <BookOpen size={18} />, permission: 'cursos' },
                { id: 'resources', label: 'Recursos', icon: <BookOpen size={18} />, permission: 'recursos' },
                { id: 'marketing', label: 'Marketing', icon: <Megaphone size={18} />, permission: 'marketing' },
            ]
        },
        {
            title: 'Sistema',
            items: [
                { id: 'users', label: 'Usuarios', icon: <UserCog size={18} />, permission: 'usuarios' },
                { id: 'roles', label: 'Roles', icon: <Shield size={18} />, permission: 'roles' },
                { id: 'forms', label: 'Formularios', icon: <FileSearch size={18} />, permission: 'formularios' },
                { id: 'settings', label: 'Ajustes', icon: <Settings size={18} />, permission: 'ajustes' },
            ]
        }
    ];

    const filteredGroups = menuGroups.map(group => ({
        ...group,
        items: group.items.filter(item => {
            if (!item.permission) return true;
            return canAccess(user?.modules, item.permission);
        })
    })).filter(group => group.items.length > 0);

    const handleLogout = async () => {
        await logout();
        // Opcional: redirigir al login
        window.location.href = '/login';
    };

    const handleNavigation = (pageId: string) => {
        setCurrentPage(pageId as PageType);
        setIsMobileMenuOpen(false);
    };

    const sidebarWidth = sidebarOpen ? 280 : 80;

    return (
        <>
            {/* Mobile menu backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobile menu button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-accent p-2 rounded-lg shadow-lg"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isMobileMenuOpen ? 280 : sidebarWidth,
                    x: isMobileMenuOpen ? 0 : (window.innerWidth < 768 ? -280 : 0)
                }}
                className={`bg-white/80 dark:bg-accent/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 flex flex-col fixed md:sticky top-0 h-screen overflow-hidden z-50 transition-all duration-500 ${
                    isMobileMenuOpen ? 'shadow-2xl' : ''
                }`}
            >
                {/* Header with logo */}
                <div className={`p-8 flex items-center ${!sidebarOpen && !isMobileMenuOpen ? 'justify-center' : 'justify-between'}`}>
                    <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => handleNavigation('overview')}>
                        <div className="relative w-12 h-12 shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                            <Image src="/logocortoicono.png" alt="Logo" fill className="object-contain" />
                        </div>
                        {(sidebarOpen || isMobileMenuOpen) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                <span className="font-bold text-xl dark:text-white tracking-tight serif whitespace-nowrap leading-none">
                  Musico<span className="text-[#008080]">terapia</span>
                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Centro Integral</span>
                            </motion.div>
                        )}
                    </Link>

                    {/* Close button for mobile */}
                    {isMobileMenuOpen && (
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-gray-400 hover:text-red-500 md:hidden"
                        >
                            <X size={20} />
                        </button>
                    )}

                    {/* Desktop toggle button */}
                    {!isMobileMenuOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="hidden md:block p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <ChevronRight size={20} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide pb-8">
                    {filteredGroups.map((group, idx) => (
                        <div key={group.title}>
                            {(sidebarOpen || isMobileMenuOpen) && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between group cursor-default"
                                >
                                    {group.title}
                                    <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <SidebarItem
                                        key={item.id}
                                        icon={item.icon}
                                        label={item.label}
                                        active={currentPage === item.id}
                                        onClick={() => handleNavigation(item.id)}
                                        collapsed={!sidebarOpen && !isMobileMenuOpen}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium text-sm group ${
                            !sidebarOpen && !isMobileMenuOpen ? 'justify-center px-0' : ''
                        }`}
                        title={!sidebarOpen && !isMobileMenuOpen ? "Cerrar Sesión" : undefined}
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                        {(sidebarOpen || isMobileMenuOpen) && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}