import { create } from "zustand";
import { Rol } from "@/entities/rol";

interface RolesEstado {
  rolesSeleccionadas: Rol[];
  mostrarFormulario: boolean;
  mostrarPermisos: boolean;
  mostrarEliminar: boolean;
  acciones: {
    alternarSeleccion: (rol: Rol) => void;
    seleccionarTodas: (roles: Rol[]) => void;
    deselectTodas: () => void;
    abrirFormulario: (rol?: Rol) => void;
    cerrarFormulario: () => void;
    abrirPermisos: () => void;
    cerrarPermisos: () => void;
    abrirEliminar: () => void;
    cerrarEliminar: () => void;
    limpiarSeleccion: () => void;
    limpiar: () => void;
  };
}

export const useRolesStore = create<RolesEstado>((set) => ({
  rolesSeleccionadas: [],
  mostrarFormulario: false,
  mostrarPermisos: false,
  mostrarEliminar: false,
  acciones: {
    alternarSeleccion: (rol) =>
      set((estado) => {
        const existe = estado.rolesSeleccionadas.some((r) => r.id === rol.id);
        if (existe) {
          return {
            rolesSeleccionadas: estado.rolesSeleccionadas.filter(
              (r) => r.id !== rol.id,
            ),
          };
        }
        return { rolesSeleccionadas: [...estado.rolesSeleccionadas, rol] };
      }),
    seleccionarTodas: (roles) =>
      set({ rolesSeleccionadas: roles }),
    deselectTodas: () =>
      set({ rolesSeleccionadas: [] }),
    abrirFormulario: (rol) =>
      set({ mostrarFormulario: true, rolesSeleccionadas: rol ? [rol] : [] }),
    cerrarFormulario: () =>
      set({ mostrarFormulario: false }),
    abrirPermisos: () =>
      set({ mostrarPermisos: true }),
    cerrarPermisos: () =>
      set({ mostrarPermisos: false }),
    abrirEliminar: () =>
      set({ mostrarEliminar: true }),
    cerrarEliminar: () =>
      set({ mostrarEliminar: false }),
    limpiarSeleccion: () =>
      set({ rolesSeleccionadas: [] }),
    limpiar: () =>
      set({
        rolesSeleccionadas: [],
        mostrarFormulario: false,
        mostrarPermisos: false,
        mostrarEliminar: false,
      }),
  },
}));
