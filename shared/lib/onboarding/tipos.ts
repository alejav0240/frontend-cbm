export interface PasoOnboarding {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  };
  waitForElement?: number;
  skipMissingElement?: boolean;
  interaccion?: "click" | "input" | "change";
  data?: Record<string, unknown>;
}

export interface ConfiguracionOnboarding {
  titulo: string;
  descripcion: string;
}
