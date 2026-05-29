export const PERMISSION_ACTIONS = ['view', 'add', 'change', 'delete'] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type PermissionKey = `${string}:${PermissionAction}`;

export interface PermissionModule {
  id: string;
  name: string;
  icon: string;
}

export const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
  view: 'Ver',
  add: 'Crear',
  change: 'Editar',
  delete: 'Eliminar',
};

export const PERMISSION_MODULES: PermissionModule[] = [
  { id: 'pacientes', name: 'Pacientes', icon: '👤' },
  { id: 'sesiones', name: 'Sesiones', icon: '🎵' },
  { id: 'agenda', name: 'Agenda', icon: '📅' },
  { id: 'pagos', name: 'Pagos', icon: '💰' },
  { id: 'recursos', name: 'Recursos', icon: '📚' },
  { id: 'formularios', name: 'Formularios', icon: '📝' },
  { id: 'roles', name: 'Roles y Permisos', icon: '🛡️' },
  { id: 'usuarios', name: 'Usuarios', icon: '👥' },
  { id: 'evaluaciones', name: 'Evaluaciones', icon: '📋' },
  { id: 'planes', name: 'Planes', icon: '🎯' },
  { id: 'escalas', name: 'Escalas', icon: '📏' },
  { id: 'informes', name: 'Informes', icon: '📄' },
  { id: 'gastos', name: 'Gastos', icon: '📉' },
  { id: 'inventario', name: 'Inventario', icon: '📦' },
  { id: 'analisis', name: 'Análisis', icon: '📊' },
  { id: 'marketing', name: 'Marketing', icon: '📣' },
  { id: 'blog', name: 'Blog', icon: '📰' },
  { id: 'cursos', name: 'Cursos', icon: '🎓' },
  { id: 'instituciones', name: 'Instituciones', icon: '🏢' },
  { id: 'ajustes', name: 'Ajustes', icon: '⚙️' },
];

export function toPermissionKey(permission: string, defaultAction: PermissionAction = 'view'): PermissionKey {
  return permission.includes(':')
    ? permission as PermissionKey
    : `${permission}:${defaultAction}`;
}

export function canAccess(
  modules: string[] | null | undefined,
  permission: string,
  defaultAction: PermissionAction = 'view'
) {
  return !!modules?.includes(toPermissionKey(permission, defaultAction));
}

export function expandModuleToPermissions(moduleId: string): PermissionKey[] {
  return PERMISSION_ACTIONS.map((action) => `${moduleId}:${action}` as PermissionKey);
}

export function normalizePermissions(permissions: string[] | null | undefined): PermissionKey[] {
  if (!permissions?.length) return [];

  return Array.from(new Set(permissions.flatMap((permission) => (
    permission.includes(':')
      ? [permission as PermissionKey]
      : expandModuleToPermissions(permission)
  ))));
}

export function countPermissionModules(permissions: string[] | null | undefined) {
  return new Set(normalizePermissions(permissions).map((permission) => permission.split(':')[0])).size;
}
