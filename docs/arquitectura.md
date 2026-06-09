# Arquitectura

## Estructura de carpetas

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (MainProvider)
│   ├── page.tsx                  # Redirect a /dashboard
│   ├── login/page.tsx            # Página de login
│   └── dashboard/
│       ├── layout.tsx            # Layout con Sidebar + Topbar
│       └── page.tsx              # Renderiza DashboardRouter
│
├── config/
│   ├── dashboard-router.tsx      # Router SPA: currentPage → View
│   └── providers/
│       ├── main-provider.tsx     # ThemeProvider + ApolloWrapper + Toaster
│       ├── theme-provider.tsx    # next-themes
│       └── DashboardContext.tsx  # ⚠️ Deprecado — migrando a Zustand
│
├── modules/                      # Módulos de dominio
│   ├── auth/                     # Autenticación
│   ├── atencion/                 # Dashboard, Pacientes, Agenda, Sesiones, Ciclos, Portal Familiar
│   ├── clinica/                  # Expedientes, Evaluaciones, Planes, Escalas, Informes
│   ├── operaciones/              # Pagos, Gastos, Inventario, Análisis, Instituciones
│   ├── comunidad/                # Blog, Cursos, Recursos, Marketing
│   └── sistema/                  # Usuarios, Roles, Formularios, Ajustes
│
├── shared/
│   ├── store/                    # Stores Zustand globales
│   │   ├── dashboardStore.ts     # Navegación SPA, paciente seleccionado, búsqueda global
│   │   └── uiStore.ts            # Estado UI (sidebar)
│   ├── ui/                       # Componentes compartidos
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── Pagination.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── PDFExportModal.tsx
│   │   ├── MusicalNotes.tsx
│   │   └── components/           # Sub-componentes UI
│   │       ├── Modal.tsx
│   │       ├── PermissionGuard.tsx
│   │       ├── SearchableSelect.tsx
│   │       ├── CalendarPicker.tsx
│   │       └── SidebarItem.tsx
│   ├── lib/
│   │   ├── apollo/               # Cliente Apollo, links, token manager
│   │   ├── hooks/
│   │   │   └── useDebounce.ts
│   │   └── permissions/
│   │       └── permissions.config.ts
│   ├── data/
│   │   ├── permissions.ts        # canAccess(), tipos de permisos
│   │   ├── services.ts
│   │   └── staff.ts
│   ├── types/
│   │   └── forms.home.schema.ts
│   └── constants/
│
└── docs/                         # Esta documentación
```

## Patrón de módulo

Cada sub-módulo sigue esta estructura interna:

```
modules/<grupo>/<submodulo>/
├── page.tsx          # View (named export: <Nombre>View)
├── index.ts          # Barrel — re-exporta todo lo público del módulo
├── components/       # Componentes visuales del módulo
├── hooks/            # Hooks de datos y UI
├── graphql/          # Queries y mutaciones GQL
├── schemas/          # Schemas Zod + tipos inferidos
├── types/            # Interfaces y tipos del dominio
├── services/         # Lógica de negocio (PDF, Excel, etc.)
└── store/            # Store Zustand local (si aplica)
```

## Navegación SPA

El dashboard funciona como SPA. No usa rutas de Next.js para la navegación interna:

1. `useDashboardStore.currentPage` (tipo `PageType`) determina qué view mostrar
2. `DashboardRouter` (`config/dashboard-router.tsx`) hace el switch y renderiza el View
3. `Sidebar` llama `setCurrentPage(id)` al hacer click en un item

## Convenciones

- Named exports en todos los componentes y hooks (no `export default` salvo excepciones heredadas)
- `'use client'` solo en componentes que usan hooks de React o APIs del browser
- Tipos e interfaces centralizados en `types/` de cada módulo
- Schemas Zod en `schemas/` — los types se infieren con `z.infer<>`
- Imports usando alias `@/` (apunta a la raíz del proyecto)
