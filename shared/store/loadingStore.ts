import { create } from "zustand";

type LoadingKey = string; // e.g. 'pacientes.list', 'pacientes.create', 'pacientes.delete'

interface LoadingState {
  loadingKeys: Set<LoadingKey>;
  start: (key: LoadingKey) => void;
  stop: (key: LoadingKey) => void;
  isLoading: (key: LoadingKey) => boolean;
  isAnyLoading: (...keys: LoadingKey[]) => boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loadingKeys: new Set(),

  start: (key) =>
    set((state) => ({
      loadingKeys: new Set(state.loadingKeys).add(key),
    })),

  stop: (key) =>
    set((state) => {
      const next = new Set(state.loadingKeys);
      next.delete(key);
      return { loadingKeys: next };
    }),

  isLoading: (key) => get().loadingKeys.has(key),

  isAnyLoading: (...keys) => keys.some((k) => get().loadingKeys.has(k)),
}));

// ─── Claves de carga por módulo ───────────────────────────────────────────────

export const LOADING_KEYS = {
  pacientes: {
    list: "pacientes.list",
    create: "pacientes.create",
    delete: "pacientes.delete",
    update: "pacientes.update",
    clinical: "pacientes.clinical",
    growth: "pacientes.growth",
  },
} as const;
