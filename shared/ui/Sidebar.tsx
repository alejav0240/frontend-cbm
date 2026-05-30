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
                { id: 'pacientes', label: 'Pacientes', icon: <Users size={18} />, permission: 'pacientes' },
                { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} />, permission: 'agenda' },
                { id: 'sesiones', label: 'Sesiones', icon: <History size={18} />, permission: 'sesiones' },
                { id: 'ciclos', label: 'Ciclos', icon: <ListChecks size={18} />, permission: 'pacientes' },
                { id: 'portal-familiar', label: 'Portal Familiar', icon: <Heart size={18} /> },
            ]
        },
        {
            title: 'Clínica',
            items: [
                { id: 'expedientes', label: 'Expedientes', icon: <Stethoscope size={18} />, permission: 'pacientes' },
                { id: 'evaluaciones', label: 'Evaluaciones', icon: <ClipboardList size={18} />, permission: 'evaluaciones' },
                { id: 'planes', label: 'Planes', icon: <Target size={18} />, permission: 'planes' },
                { id: 'escalas', label: 'Escalas', icon: <ListChecks size={18} />, permission: 'escalas' },
                { id: 'informes', label: 'Informes', icon: <FileText size={18} />, permission: 'informes' },
            ]
        },
        {
            title: 'Operaciones',
            items: [
                { id: 'pagos', label: 'Pagos', icon: <DollarSign size={18} />, permission: 'pagos' },
                { id: 'gastos', label: 'Gastos', icon: <TrendingDown size={18} />, permission: 'gastos' },
                { id: 'inventario', label: 'Inventario', icon: <Package size={18} />, permission: 'inventario' },
                { id: 'analisis', label: 'Análisis', icon: <BarChart3 size={18} />, permission: 'analisis' },
                { id: 'instituciones', label: 'Instituciones', icon: <Building2 size={18} />, permission: 'instituciones' },
            ]
        },
        {
            title: 'Comunidad',
            items: [
                { id: 'blog', label: 'Blog', icon: <Layout size={18} />, permission: 'blog' },
                { id: 'cursos', label: 'Cursos', icon: <BookOpen size={18} />, permission: 'cursos' },
                { id: 'recursos', label: 'Recursos', icon: <BookOpen size={18} />, permission: 'recursos' },
                { id: 'marketing', label: 'Marketing', icon: <Megaphone size={18} />, permission: 'marketing' },
            ]
        },
        {
            title: 'Sistema',
            items: [
                { id: 'users', label: 'Usuarios', icon: <UserCog size={18} />, permission: 'usuarios' },
                { id: 'roles', label: 'Roles', icon: <Shield size={18} />, permission: 'roles' },
                { id: 'formularios', label: 'Formularios', icon: <FileSearch size={18} />, permission: 'formularios' },
                { id: 'ajustes', label: 'Ajustes', icon: <Settings size={18} />, permission: 'ajustes' },
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
            {/* Mobile backdrop */}
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

            {/* Mobile open button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-accent p-2 rounded-lg shadow-lg"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar — mobile: slide in/out, desktop: collapse/expand */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarWidth }}
                className="bg-white/80 dark:bg-accent/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 flex flex-col sticky top-0 h-screen overflow-hidden z-50 hidden md:flex"
            >
                {/* Header */}
                <div className={`p-8 flex items-center ${!sidebarOpen ? 'justify-center' : 'justify-between'}`}>
                    <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => handleNavigation('overview')}>
                        <div className="relative w-12 h-12 shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                            <Image src="/logocortoicono.png" alt="Logo" fill className="object-contain" />
                        </div>
                        {sidebarOpen && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                                <span className="font-bold text-xl dark:text-white tracking-tight serif whitespace-nowrap leading-none">
                                    Musico<span className="text-[#008080]">terapia</span>
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Centro Integral</span>
                            </motion.div>
                        )}
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ChevronRight size={20} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide pb-8">
                    {filteredGroups.map((group, idx) => (
                        <div key={group.title}>
                            {sidebarOpen && (
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
                                {group.items.map((item) => (
                                    <SidebarItem
                                        key={item.id}
                                        icon={item.icon}
                                        label={item.label}
                                        active={currentPage === item.id}
                                        onClick={() => handleNavigation(item.id)}
                                        collapsed={!sidebarOpen}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium text-sm group ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                        title={!sidebarOpen ? 'Cerrar Sesión' : undefined}
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                        {sidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile sidebar — drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'tween', duration: 0.25 }}
                        className="fixed top-0 left-0 h-screen w-[280px] bg-white dark:bg-accent flex flex-col z-50 shadow-2xl md:hidden"
                    >
                        {/* Header */}
                        <div className="p-8 flex items-center justify-between">
                            <Link href="/dashboard" className="flex items-center gap-3" onClick={() => handleNavigation('overview')}>
                                <div className="relative w-12 h-12 shrink-0">
                                    <Image src="/logocortoicono.png" alt="Logo" fill className="object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl dark:text-white tracking-tight serif whitespace-nowrap leading-none">
                                        Musico<span className="text-[#008080]">terapia</span>
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Centro Integral</span>
                                </div>
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 space-y-8 overflow-y-auto pb-8">
                            {filteredGroups.map((group) => (
                                <div key={group.title}>
                                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{group.title}</p>
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <SidebarItem
                                                key={item.id}
                                                icon={item.icon}
                                                label={item.label}
                                                active={currentPage === item.id}
                                                onClick={() => handleNavigation(item.id)}
                                                collapsed={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Logout */}
                        <div className="p-4 border-t border-gray-100 dark:border-white/5">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium text-sm group"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}