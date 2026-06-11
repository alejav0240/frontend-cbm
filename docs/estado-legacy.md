# Gestión de Estado

## Stores globales (Zustand)

### `dashboardStore` — `shared/store/dashboardStore.ts`

Store principal del dashboard. Persiste en `localStorage` bajo la key `dashboard-storage`.

```ts
// Estado
currentPage: PageType          // Vista activa en el DashboardRouter
sidebarOpen: boolean           // Sidebar expandido/colapsado (desktop)
isMobileMenuOpen: boolean      // Sidebar abierto en mobile
selectedPatient: { id, name }  // Paciente seleccionado globalmente
globalSearchTerm: string       // Búsqueda global (usada por módulos)

// Acciones principales
setCurrentPage(page)           // Navegar a un módulo
setSelectedPatient(patient)    // Seleccionar paciente para expediente
toggleSidebar()
```

**`PageType`** — unión de todos los identificadores de módulo:
```ts
'overview' | 'pacientes' | 'agenda' | 'sesiones' | 'ciclos' | 'portal-familiar' |
'expedientes' | 'evaluaciones' | 'planes' | 'escalas' | 'informes' |
'pagos' | 'gastos' | 'inventario' | 'analisis' | 'instituciones' |
'blog' | 'cursos' | 'recursos' | 'marketing' |
'users' | 'roles' | 'formularios' | 'ajustes'
```

### `uiStore` — `shared/store/uiStore.ts`

Store ligero para estado UI no persistente.

```ts
isSidebarOpen: boolean
toggleSidebar() / openSidebar() / closeSidebar()
```

### `useAuthStore` — `modules/auth/hooks/useAuthStore.ts`

Store de autenticación. **No persiste** (en memoria).

```ts
user: AuthUser | null
isAuthenticated: boolean
setUser(user)
logout()
```

**`AuthUser`**:
```ts
{
  id, databaseId, username, email,
  firstName, lastName, fullName,
  ci, celular, status, visibility,
  isStaff, foto, cv,
  modules: string[],   // permisos en formato "modulo:accion"
  role: { id, name }
}
```

## Migración de Context → Zustand

El proyecto está en proceso de migración. `DashboardContext.tsx` en `config/providers/` es la implementación anterior que está siendo reemplazada. **No usar** en módulos nuevos.

Mapa de equivalencias:

| Context (viejo) | Zustand (nuevo) |
|---|---|
| `useDashboard().globalSearchTerm` | `useDashboardStore().globalSearchTerm` |
| `useDashboard().setActiveView(v)` | `useDashboardStore().setCurrentPage(v)` |
| `useDashboard().setSelectedPatientId(id)` | `useDashboardStore().setSelectedPatient({id, name})` |
| `useAuthStore` de `@/store/useAuthStore` | `useAuthStore` de `@/modules/auth/hooks/useAuthStore` |

## Selectores

El `dashboardStore` expone selectores prebuilt para evitar re-renders innecesarios:

```ts
useSidebarState()      // sidebarOpen, isMobileMenuOpen, toggle/close actions
useCurrentPage()       // currentPage, setCurrentPage
useSelectedPatient()   // selectedPatient, setSelectedPatient, clearSelectedPatient
useGlobalSearch()      // globalSearchTerm, setGlobalSearchTerm, clearGlobalSearch
```
