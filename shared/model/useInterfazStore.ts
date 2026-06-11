import { create } from "zustand";

interface InterfazEstado {
  sidebarAbierta: boolean;
  menuMovilAbierto: boolean;
  acciones: {
    alternarSidebar: () => void;
    cerrarSidebar: () => void;
    abrirSidebar: () => void;
    setMenuMovilAbierto: (abierto: boolean) => void;
    alternarMenuMovil: () => void;
  };
}

export const useInterfazStore = create<InterfazEstado>((set) => ({
  sidebarAbierta: true,
  menuMovilAbierto: false,
  acciones: {
    alternarSidebar: () =>
      set((estado) => ({ sidebarAbierta: !estado.sidebarAbierta })),
    cerrarSidebar: () => set({ sidebarAbierta: false }),
    abrirSidebar: () => set({ sidebarAbierta: true }),
    setMenuMovilAbierto: (abierto) => set({ menuMovilAbierto: abierto }),
    alternarMenuMovil: () =>
      set((estado) => ({ menuMovilAbierto: !estado.menuMovilAbierto })),
  },
}));

// Selectores
export const useSidebar = () => useInterfazStore((estado) => ({
  abierta: estado.sidebarAbierta,
  menuMovilAbierto: estado.menuMovilAbierto,
  ...estado.acciones
}));
