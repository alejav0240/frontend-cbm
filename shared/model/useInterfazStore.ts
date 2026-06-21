import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

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

// Selector optimizado con useShallow para evitar re-renders infinitos
export const useSidebar = () =>
  useInterfazStore(
    useShallow((estado) => ({
      abierta: estado.sidebarAbierta,
      menuMovilAbierto: estado.menuMovilAbierto,
      ...estado.acciones,
    })),
  );
