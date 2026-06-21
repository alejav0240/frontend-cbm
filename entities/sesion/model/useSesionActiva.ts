import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SesionActiva {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  inicio: Date;
}

interface SesionActivaEstado {
  sesion: SesionActiva | null;
  setSesion: (sesion: SesionActiva | null) => void;
  limpiarSesion: () => void;
}

export const useSesionActivaStore = create<SesionActivaEstado>()(
  persist(
    (set) => ({
      sesion: null,
      setSesion: (sesion) => set({ sesion }),
      limpiarSesion: () => set({ sesion: null }),
    }),
    {
      name: "sesion-activa-storage",
    },
  ),
);
