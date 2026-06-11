import { create } from "zustand";

export interface UsuarioAutenticado {
  id: string;
  databaseId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  ci?: string;
  celular?: string;
  status?: string;
  visibility?: string;
  isStaff?: boolean;
  foto?: string;
  cv?: string;
  modules?: string[];
  permissions?: string[];
  role?: {
    id: string;
    name: string;
  };
}

interface AuthEstado {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  estaCargando: boolean;
  setUsuario: (usuario: UsuarioAutenticado) => void;
  setEstaCargando: (v: boolean) => void;
  cerrarSesion: () => void;
}

export const useAuthStore = create<AuthEstado>((set) => ({
  usuario: null,
  estaAutenticado: false,
  estaCargando: true,
  setUsuario: (usuario) => set({ usuario, estaAutenticado: true, estaCargando: false }),
  setEstaCargando: (v) => set({ estaCargando: v }),
  cerrarSesion: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ usuario: null, estaAutenticado: false, estaCargando: false });
  },
}));
