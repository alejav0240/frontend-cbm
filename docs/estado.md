# Gestión de Estado

La migración **Context → Zustand** está completada: no queda ningún `createContext` /
`useContext` en el código ni `DashboardContext` en `config/providers/`. El estado global
vive en stores Zustand dentro de `shared/model/` (o en la entidad cuando es dominio propio).

## Stores globales — `shared/model/`

### `useAuthStore` — `shared/model/useAuthStore.ts`

Autenticación en memoria (no persiste). El JWT se guarda en `localStorage` bajo las claves
`token` y `refreshToken`.

| Campo / acción | Descripción |
|---|---|
| `usuario: UsuarioAutenticado \| null` | Datos del usuario autenticado |
| `estaAutenticado: boolean` | Si hay sesión activa |
| `estaCargando: boolean` | Estado de carga inicial (`true` por defecto) |
| `setUsuario(usuario)` | Guarda el usuario y marca `estaAutenticado: true` |
| `setEstaCargando(v)` | Actualiza el estado de carga |
| `cerrarSesion()` | Borra `token`/`refreshToken` de localStorage y limpia el estado |

`UsuarioAutenticado`: `{ id, databaseId, username, email, firstName?, lastName?,
fullName, ci?, celular?, status?, visibility?, isStaff?, foto?, cv?, modules?,
permissions?, role?: { id, name } }`.

### `useInterfazStore` — `shared/model/useInterfazStore.ts`

Estado UI de navegación (sidebar). No persiste.

- `sidebarAbierta: boolean` (default `true`)
- `menuMovilAbierto: boolean`
- Acciones: `alternarSidebar`, `cerrarSidebar`, `abrirSidebar`,
  `setMenuMovilAbierto(abierto)`, `alternarMenuMovil`

Selector optimizado con `useShallow` (evita re-renders):

```ts
const { abierta, menuMovilAbierto, alternarSidebar } = useSidebar();
```

### `useRolesStore` — `shared/model/useRolesStore.ts`

Estado de la página de Roles (selección y modales).

- `rolesSeleccionadas: Rol[]`
- `mostrarFormulario`, `mostrarPermisos`, `mostrarEliminar: boolean`
- Acciones: `alternarSeleccion`, `seleccionarTodas`, `deselectTodas`, `abrirFormulario`,
  `cerrarFormulario`, `abrirPermisos`, `cerrarPermisos`, `abrirEliminar`,
  `cerrarEliminar`, `limpiarSeleccion`, `limpiar`

### `useSesionConfigStore` — `shared/model/useSesionConfigStore.ts`

Preferencias de la sesión en progreso.

- `duracionSesion: number` (default `45`)
- `umbralNotificacion: number` (default `2`)
- Acciones: `setDuracionSesion(minutos)`, `setUmbralNotificacion(minutos)`

## Stores de dominio — `entities/<entidad>/model/`

### `usePacienteSeleccionadoStore` — `entities/paciente/model/usePacienteSeleccionado.ts`

Paciente seleccionado globalmente (reemplaza al `selectedPatient` del antiguo
`dashboardStore`).

- `paciente: { id, nombre, documento? } | null`
- Acciones: `setPaciente(paciente)`, `limpiarPaciente()`

## Principios

- **Estado de servidor**: Apollo Cache (GraphQL).
- **Estado UI/global**: Zustand en `shared/model/`.
- **Sesión en progreso**: store Zustand dentro de `features/sesion-en-progreso/`.
- **Navegación**: App Router nativo (`router.push`), no hay routing por store.
- La selección de paciente se resuelve por URL (`/dashboard/expedientes/[id]`); la búsqueda
  global del antiguo `dashboardStore` quedó obsoleta.
