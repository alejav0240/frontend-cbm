# Autenticación y Permisos (Shared)

## Flujo de Autenticación

1. El usuario envía credenciales desde la página `/login`.
2. Se ejecuta `INICIO_SESION_MUTACION` (`shared/api/auth.ts`).
3. El backend devuelve `token` y `refreshToken`.
4. El `token` se almacena localmente y se gestiona mediante `TokenManager` (`shared/lib/apollo/utils/tokenManager.ts`).
5. Se consulta `CONSULTA_YO` para obtener los datos completos del perfil.
6. El usuario se guarda en `useAuthStore` (`shared/model/useAuthStore.ts`) con el estado `estaAutenticado: true`.

## Capas Involucradas

- **`shared/api/auth.ts`**: Definición de consultas y mutaciones de identidad.
- **`shared/model/useAuthStore.ts`**: Store de Zustand para el estado global del usuario y sesión.
- **`shared/lib/usePermisos.ts`**: Hook principal para validación de accesos en toda la app.
- **`shared/ui/components/PermissionGuard.tsx`**: Componente visual para ocultar/mostrar elementos según permisos.

## Sistema de Permisos

Los permisos se manejan bajo el formato `"entidad:accion"`.

### Comprobación en Componentes

```tsx
import { PermissionGuard } from '@/shared/ui/components/PermissionGuard';

<PermissionGuard permission="pacientes:add">
  <button>Nuevo Paciente</button>
</PermissionGuard>
```

### Comprobación en Lógica (Hooks)

```ts
import { useTienePermiso } from '@/shared/lib/usePermisos';

const canDelete = useTienePermiso('pagos:delete');
```

## Cerrar Sesión

El método `cerrarSesion()` en `useAuthStore` realiza las siguientes acciones:
1. Elimina los tokens del almacenamiento local.
2. Limpia el estado del usuario en memoria.
3. El `DashboardLayout` detectará la falta de sesión y redirigirá automáticamente a `/login`.
