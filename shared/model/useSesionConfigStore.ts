import { create } from "zustand";

interface SesionConfigEstado {
  duracionSesion: number;
  umbralNotificacion: number;
  acciones: {
    setDuracionSesion: (minutos: number) => void;
    setUmbralNotificacion: (minutos: number) => void;
  };
}

export const useSesionConfigStore = create<SesionConfigEstado>((set) => ({
  duracionSesion: 45,
  umbralNotificacion: 2,
  acciones: {
    setDuracionSesion: (minutos) => set({ duracionSesion: minutos }),
    setUmbralNotificacion: (minutos) => set({ umbralNotificacion: minutos }),
  },
}));
