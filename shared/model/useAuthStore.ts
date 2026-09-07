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
    // 1. Limpiar localStorage y sessionStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.clear();
      } catch (e) {
        console.error("Error al limpiar storage:", e);
      }

      // 2. Limpiar cookies accesibles del cliente
      document.cookie = "cbm_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 3. Notificar a la API de Next.js para eliminar cookies HttpOnly y limpiar backend
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        console.warn("No se pudo ejecutar el logout en API route:", e);
      }

      // 4. Limpiar caché de Apollo Client
      try {
        const { resetApolloClient } = await import("@/shared/lib/apollo/createClient");
        resetApolloClient();
      } catch (e) {
        console.warn("Error al reiniciar cliente Apollo:", e);
      }
    }

    // 5. Limpiar estado en Zustand
    set({ usuario: null, estaAutenticado: false, estaCargando: false });
  },
}));
