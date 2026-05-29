// store/dashboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageType =
    | 'overview'
    | 'patients'
    | 'agenda'
    | 'sessions'
    | 'cycles'
    | 'family-portal'
    | 'clinical'
    | 'evaluations'
    | 'intervention-plan'
    | 'scales'
    | 'therapy-reports'
    | 'payments'
    | 'expenses'
    | 'inventory'
    | 'reports'
    | 'institutions'
    | 'blog'
    | 'courses'
    | 'resources'
    | 'marketing'
    | 'users'
    | 'roles'
    | 'forms'
    | 'settings'
    | 'profile';

export interface SelectedPatient {
    id: string;
    name: string;
    documentId?: string;
    email?: string;
}

interface DashboardState {
    // Sidebar state
    sidebarOpen: boolean;
    currentPage: PageType;
    isMobileMenuOpen: boolean;

    // Patient selection
    selectedPatient: SelectedPatient | null;

    // Global search
    globalSearchTerm: string;

    // Actions - Sidebar
    toggleSidebar: () => void;
    setCurrentPage: (page: PageType) => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    setIsMobileMenuOpen: (open: boolean) => void;
    toggleMobileMenu: () => void;

    // Actions - Patient
    setSelectedPatient: (patient: SelectedPatient | null) => void;
    clearSelectedPatient: () => void;

    // Actions - Search
    setGlobalSearchTerm: (term: string) => void;
    clearGlobalSearch: () => void;

    // Utility
    resetDashboard: () => void;
}

// Estado inicial
const initialState = {
    sidebarOpen: true,
    currentPage: 'overview' as PageType,
    isMobileMenuOpen: false,
    selectedPatient: null,
    globalSearchTerm: '',
};

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            ...initialState,

            // Sidebar actions
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

            setCurrentPage: (page) => set((state) => ({
                currentPage: page,
                // Opcional: cerrar menú mobile al cambiar de página
                isMobileMenuOpen: false
            })),

            openSidebar: () => set({ sidebarOpen: true }),

            closeSidebar: () => set({ sidebarOpen: false }),

            setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

            toggleMobileMenu: () => set((state) => ({
                isMobileMenuOpen: !state.isMobileMenuOpen
            })),

            // Patient actions
            setSelectedPatient: (patient) => set({
                selectedPatient: patient,
                // Opcional: limpiar búsqueda al seleccionar paciente
                globalSearchTerm: ''
            }),

            clearSelectedPatient: () => set({ selectedPatient: null }),

            // Search actions
            setGlobalSearchTerm: (term) => set({ globalSearchTerm: term }),

            clearGlobalSearch: () => set({ globalSearchTerm: '' }),

            // Reset dashboard
            resetDashboard: () => set(initialState),
        }),
        {
            name: 'dashboard-storage',
            // Solo persistimos lo necesario
            partialize: (state) => ({
                sidebarOpen: state.sidebarOpen,
                currentPage: state.currentPage,
                // No persistimos: isMobileMenuOpen, selectedPatient, globalSearchTerm
            }),
            // Versión del store (útil para migraciones)
            version: 1,
            // Migraciones si cambia la estructura
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Migrar de versión anterior si es necesario
                    return {
                        ...persistedState,
                        selectedPatient: null,
                        globalSearchTerm: '',
                    };
                }
                return persistedState;
            },
        }
    )
);

// Selectors para facilitar el uso
export const useSidebarState = () => useDashboardStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    isMobileMenuOpen: state.isMobileMenuOpen,
    toggleSidebar: state.toggleSidebar,
    toggleMobileMenu: state.toggleMobileMenu,
    closeSidebar: state.closeSidebar,
}));

export const useCurrentPage = () => useDashboardStore((state) => ({
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
}));

export const useSelectedPatient = () => useDashboardStore((state) => ({
    selectedPatient: state.selectedPatient,
    setSelectedPatient: state.setSelectedPatient,
    clearSelectedPatient: state.clearSelectedPatient,
}));

export const useGlobalSearch = () => useDashboardStore((state) => ({
    globalSearchTerm: state.globalSearchTerm,
    setGlobalSearchTerm: state.setGlobalSearchTerm,
    clearGlobalSearch: state.clearGlobalSearch,
}));