export const PERMISSIONS = {
  PACIENTES: "pacientes",
  AGENDA: "agenda",
  SESIONES: "sesiones",
  CICLOS: "ciclos",
  PORTAL_FAMILIAR: "portal_familiar",
  EXPEDIENTES: "expedientes",
  EVALUACIONES: "evaluaciones",
  PLANES: "planes",
  ESCALAS: "escalas",
  INFORMES: "informes",
  PAGOS: "pagos",
  GASTOS: "gastos",
  INVENTARIO: "inventario",
  ANALISIS: "analisis",
  INSTITUCIONES: "instituciones",
  BLOG: "blog",
  CURSOS: "cursos",
  RECURSOS: "recursos",
  MARKETING: "marketing",
  USUARIOS: "usuarios",
  ROLES: "roles",
  FORMULARIOS: "formularios",
  AJUSTES: "ajustes",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function esTutor(roleName?: string | null): boolean {
  return roleName?.toLowerCase() === "tutor";
}
