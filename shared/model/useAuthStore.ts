import { create } from "zustand";

export interface UsuarioAutenticado {
  id: string;
  databaseId: number | null;
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
  cerrarSesion: () => Promise<void>;
}

export const useAuthStore = create<AuthEstado>((set) => ({
  usuario: null,
  estaAutenticado: false,
  estaCargando: true,
  setUsuario: (usuario) =>
    set({ usuario, estaAutenticado: true, estaCargando: false }),
  setEstaCargando: (v) => set({ estaCargando: v }),
  cerrarSesion: async () => {
    // 1. Limpiar estado de cliente no sensible
    if (typeof window !== "undefined") {
      try {
        sessionStorage.clear();
      } catch (e) {
        console.error("Error al limpiar storage:", e);
      }

      // Notificar a la API de Next.js para eliminar cookies HttpOnly y limpiar backend
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        console.warn("No se pudo ejecutar el logout en API route:", e);
      }

      // Limpiar caché de Apollo Client
      try {
        const { resetApolloClient } = await import(
          "@/shared/lib/apollo/createClient"
        );
        resetApolloClient();
      } catch (e) {
        console.warn("Error al reiniciar cliente Apollo:", e);
      }
    }

    // 5. Limpiar estado en Zustand
    set({ usuario: null, estaAutenticado: false, estaCargando: false });
  },
}));
