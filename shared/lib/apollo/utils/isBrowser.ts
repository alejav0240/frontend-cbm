/**
 * Helper para detectar si el código se ejecuta en el cliente
 * Esencial para evitar errores en SSR con document/window
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};
