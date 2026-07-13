export const PERMISSION_ACTIONS = ["view", "add", "change", "delete"] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type PermissionKey = `${string}:${PermissionAction}`;

export interface PermissionModule {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
  view: "Ver",
  add: "Crear",
  change: "Editar",
  delete: "Eliminar",
};

export const PERMISSION_MODULES: PermissionModule[] = [
  { id: "pacientes", name: "Pacientes", icon: "👤", description: "Gestión de pacientes y expedientes" },
  { id: "sesiones", name: "Sesiones", icon: "🎵", description: "Sesiones terapéuticas y seguimiento" },
  { id: "agenda", name: "Agenda", icon: "📅", description: "Calendario y programación de citas" },
  { id: "pagos", name: "Pagos", icon: "💰", description: "Facturación y cobros" },
  { id: "recursos", name: "Recursos", icon: "📚", description: "Repositorio de materiales y recursos" },
  { id: "formularios", name: "Formularios", icon: "📝", description: "Formularios dinámicos y asignaciones" },
  { id: "roles", name: "Roles y Permisos", icon: "🛡️", description: "Control de acceso y permisos del sistema" },
  { id: "usuarios", name: "Usuarios", icon: "👥", description: "Gestión de cuentas y perfiles" },
  { id: "evaluaciones", name: "Evaluaciones", icon: "📋", description: "Evaluaciones clínicas y escalas" },
  { id: "planes", name: "Planes", icon: "🎯", description: "Planes de intervención y seguimiento" },
  { id: "escalas", name: "Escalas", icon: "📏", description: "Escalas de evaluación y valoración" },
  { id: "informes", name: "Informes", icon: "📄", description: "Informes clínicos y reportes" },
  { id: "gastos", name: "Gastos", icon: "📉", description: "Control de gastos operativos" },
  { id: "inventario", name: "Inventario", icon: "📦", description: "Gestión de materiales e inventario" },
  { id: "analisis", name: "Análisis", icon: "📊", description: "Estadísticas y análisis de datos" },
  { id: "marketing", name: "Marketing", icon: "📣", description: "Campañas y contenido promocional" },
  { id: "blog", name: "Blog", icon: "📰", description: "Publicaciones y artículos del blog" },
  { id: "cursos", name: "Cursos", icon: "🎓", description: "Cursos y formación en línea" },
  { id: "instituciones", name: "Instituciones", icon: "🏢", description: "Gestión de instituciones asociadas" },
  { id: "ajustes", name: "Ajustes", icon: "⚙️", description: "Configuración general del sistema" },
];

export function toPermissionKey(
  permission: string,
  defaultAction: PermissionAction = "view",
): PermissionKey {
  return permission.includes(":")
    ? (permission as PermissionKey)
    : `${permission}:${defaultAction}`;
}

export function canAccess(
  modules: string[] | null | undefined,
  permission: string,
  defaultAction: PermissionAction = "view",
) {
  return !!modules?.includes(toPermissionKey(permission, defaultAction));
}

export function expandModuleToPermissions(moduleId: string): PermissionKey[] {
  return PERMISSION_ACTIONS.map(
    (action) => `${moduleId}:${action}` as PermissionKey,
  );
}

export function normalizePermissions(
  permissions: string[] | null | undefined,
): PermissionKey[] {
  if (!permissions?.length) return [];

  return Array.from(
    new Set(
      permissions.flatMap((permission) =>
        permission.includes(":")
          ? [permission as PermissionKey]
          : expandModuleToPermissions(permission),
      ),
    ),
  );
}

export function countPermissionModules(
  permissions: string[] | null | undefined,
) {
  return new Set(
    normalizePermissions(permissions).map(
      (permission) => permission.split(":")[0],
    ),
  ).size;
}
