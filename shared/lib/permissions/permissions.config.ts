/**
 * Configuración centralizada de permisos de la aplicación
 *
 * - Define todos los permisos disponibles
 * - Mapea permisos a items del menú
 * - Tipado seguro con TypeScript
 */

/**
 * Lista maestra de permisos disponibles en el sistema
 * Cada valor debe coincidir con lo que devuelve tu backend
 */
export const PERMISSIONS = {
  // ===== ATENCIÓN =====
  PACIENTES: "pacientes",
  AGENDA: "agenda",
  SESIONES: "sesiones",
  CICLOS: "ciclos",
  PORTAL_FAMILIAR: "portal_familiar",

  // ===== CLÍNICA =====
  EXPEDIENTES: "expedientes",
  EVALUACIONES: "evaluaciones",
  PLANES: "planes",
  ESCALAS: "escalas",
  INFORMES: "informes",

  // ===== OPERACIONES =====
  PAGOS: "pagos",
  GASTOS: "gastos",
  INVENTARIO: "inventario",
  ANALISIS: "analisis",
  INSTITUCIONES: "instituciones",

  // ===== COMUNIDAD =====
  BLOG: "blog",
  CURSOS: "cursos",
  RECURSOS: "recursos",
  MARKETING: "marketing",

  // ===== SISTEMA =====
  USUARIOS: "usuarios",
  ROLES: "roles",
  FORMULARIOS: "formularios",
  AJUSTES: "ajustes",
} as const;

/**
 * Tipo seguro para las keys de permisos
 */
export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Estructura de un item del menú con soporte de permisos
 */
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  /**
   * Permiso requerido para mostrar este item
   * Puede ser un permiso único o un array para lógica compleja
   */
  permission?: PermissionKey | PermissionKey[];
  /**
   * Si permission es array: ¿requiere TODOS los permisos (AND) o BASTA UNO (OR)?
   * @default false (OR)
   */
  requireAll?: boolean;
  badge?: string | number;
  disabled?: boolean;
}

/**
 * Estructura de un grupo del menú (sección del navbar)
 */
export interface MenuGroup {
  title: string;
  items: MenuItem[];
  /**
   * Permiso para mostrar todo el grupo (opcional)
   * Si se define, filtra el grupo completo antes de evaluar items
   */
  permission?: PermissionKey;
}

/**
 * Configuración del menú de navegación
 * Se consume en SidebarNav.tsx junto con usePermissions
 */
export const MENU_GROUPS: MenuGroup[] = [
  {
    title: "Atención",
    permission: undefined, // Mostrar grupo si tiene al menos un item visible
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/atencion",
        icon: undefined,
      },
      {
        id: "pacientes",
        label: "Pacientes",
        href: "/atencion/pacientes",
        permission: PERMISSIONS.PACIENTES,
      },
      {
        id: "agenda",
        label: "Agenda",
        href: "/atencion/agenda",
        permission: PERMISSIONS.AGENDA,
      },
      {
        id: "sesiones",
        label: "Sesiones",
        href: "/atencion/sesiones",
        permission: PERMISSIONS.SESIONES,
      },
      {
        id: "ciclos",
        label: "Ciclos",
        href: "/atencion/ciclos",
        permission: PERMISSIONS.CICLOS,
      },
      {
        id: "portal",
        label: "Portal Familiar",
        href: "/atencion/portal",
        permission: PERMISSIONS.PORTAL_FAMILIAR,
      },
    ],
  },
  {
    title: "Clínica",
    items: [
      {
        id: "expedientes",
        label: "Expedientes",
        href: "/clinica/expedientes",
        permission: PERMISSIONS.EXPEDIENTES,
      },
      {
        id: "evaluaciones",
        label: "Evaluaciones",
        href: "/clinica/evaluaciones",
        permission: PERMISSIONS.EVALUACIONES,
      },
      {
        id: "planes",
        label: "Planes",
        href: "/clinica/planes",
        permission: PERMISSIONS.PLANES,
      },
      {
        id: "escalas",
        label: "Escalas",
        href: "/clinica/escalas",
        permission: PERMISSIONS.ESCALAS,
      },
      {
        id: "informes",
        label: "Informes",
        href: "/clinica/informes",
        permission: PERMISSIONS.INFORMES,
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        id: "pagos",
        label: "Pagos",
        href: "/operaciones/pagos",
        permission: PERMISSIONS.PAGOS,
      },
      {
        id: "gastos",
        label: "Gastos",
        href: "/operaciones/gastos",
        permission: PERMISSIONS.GASTOS,
      },
      {
        id: "inventario",
        label: "Inventario",
        href: "/operaciones/inventario",
        permission: PERMISSIONS.INVENTARIO,
      },
      {
        id: "analisis",
        label: "Análisis",
        href: "/operaciones/analisis",
        permission: PERMISSIONS.ANALISIS,
      },
      {
        id: "instituciones",
        label: "Instituciones",
        href: "/operaciones/instituciones",
        permission: PERMISSIONS.INSTITUCIONES,
      },
    ],
  },
  {
    title: "Comunidad",
    items: [
      {
        id: "blog",
        label: "Blog",
        href: "/comunidad/blog",
        permission: PERMISSIONS.BLOG,
      },
      {
        id: "cursos",
        label: "Cursos",
        href: "/comunidad/cursos",
        permission: PERMISSIONS.CURSOS,
      },
      {
        id: "recursos",
        label: "Recursos",
        href: "/comunidad/recursos",
        permission: PERMISSIONS.RECURSOS,
      },
      {
        id: "marketing",
        label: "Marketing",
        href: "/comunidad/marketing",
        permission: PERMISSIONS.MARKETING,
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        id: "usuarios",
        label: "Usuarios",
        href: "/sistema/usuarios",
        permission: PERMISSIONS.USUARIOS,
      },
      {
        id: "roles",
        label: "Roles",
        href: "/sistema/roles",
        permission: PERMISSIONS.ROLES,
      },
      {
        id: "formularios",
        label: "Formularios",
        href: "/sistema/formularios",
        permission: PERMISSIONS.FORMULARIOS,
      },
      {
        id: "ajustes",
        label: "Ajustes",
        href: "/sistema/ajustes",
        permission: PERMISSIONS.AJUSTES,
      },
    ],
  },
];

/**
 * Helper para obtener el menú filtrado por permisos
 * @deprecated Usa usePermissions().filterMenuByPermissions() en componentes
 */
export const getFilteredMenu = (
  userPermissions: string[] = [],
  role?: string,
): MenuGroup[] => {
  const isAdmin = role === "admin";

  return MENU_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (isAdmin) return true;
      if (!item.permission) return true;

      if (Array.isArray(item.permission)) {
        return item.requireAll
          ? item.permission.every((p) => userPermissions.includes(p))
          : item.permission.some((p) => userPermissions.includes(p));
      }

      return userPermissions.includes(item.permission);
    }),
  })).filter((group) => group.items.length > 0);
};
