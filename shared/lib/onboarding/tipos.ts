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
  data?: {
    rol?: RolOnboarding;
    interaccion?: "click" | "input" | "change";
  };
}

export type RolOnboarding =
  | "header"
  | "stats"
  | "accion"
  | "busqueda"
  | "filtros"
  | "lista"
  | "tabs"
  | "modal"
  | "extra";

export interface ConfiguracionOnboarding {
  titulo: string;
  descripcion: string;
}
