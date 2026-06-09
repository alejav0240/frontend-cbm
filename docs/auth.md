# Autenticación y Permisos

## Flujo de autenticación

1. Usuario envía credenciales en `/login`
2. Se ejecuta `LOGIN_MUTATION` → backend devuelve `token` + `refreshToken` + `user`
3. El token se almacena via `tokenManager`
4. El `user` se guarda en `useAuthStore` con `setUser()`
5. Apollo inyecta el token automáticamente en cada request via `authLink`

## Queries

```graphql
# Login
mutation TokenAuth($username: String!, $password: String!) {
  tokenAuth(...) { token, refreshToken, user { ... } }
}

# Obtener usuario actual (para refrescar sesión)
query Me {
  me { id, databaseId, username, email, fullName, modules, role { id, name }, ... }
}
```

## AuthUser

```ts
interface AuthUser {
  id: string;
  databaseId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  ci?: string;
  celular?: string;
  status?: string;
  visibility?: string;
  isStaff?: boolean;
  foto?: string;
  cv?: string;
  modules?: string[];        // ["pacientes:view", "pacientes:add", ...]
  role?: { id: string; name: string };
}
```

## Sistema de permisos

Los permisos se almacenan en `user.modules` como strings con formato `"modulo:accion"`.

### Acciones disponibles
- `view` — Ver listado
- `add` — Crear registros
- `change` — Editar registros
- `delete` — Eliminar registros

### Verificar permisos

```ts
// En componentes
import { PermissionGuard, useCan } from '@/shared/ui/components/PermissionGuard';

<PermissionGuard permission="pacientes:add">
  <button>Nuevo</button>
</PermissionGuard>

const canDelete = useCan('pacientes:delete');

// En lógica (fuera de componentes)
import { canAccess } from '@/shared/data/permissions';
canAccess(user?.modules, 'pacientes:add')  // boolean
```

### Filtrado del menú

El `Sidebar` filtra automáticamente los items del menú según los permisos del usuario usando `canAccess`. Un item sin `permission` siempre se muestra.

## usePermissions hook — `modules/auth/hooks/usePermissions.ts`

Hook completo para lógica de permisos avanzada. Consultar el archivo para la API completa.
