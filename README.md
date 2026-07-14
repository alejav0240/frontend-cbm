# CBM Frontend

Sistema de gestión clínica y administrativa para terapia. Aplicación web construida con Next.js, GraphQL y arquitectura Feature-Sliced Design.

## Requisitos

- Node.js >= 18
- pnpm (gestor de paquetes)
- Backend GraphQL en `NEXT_PUBLIC_GRAPHQL_URI` (por defecto `http://localhost:8000/graphql/`)

## Instalación

```bash
pnpm install
```

## Entorno

Crea un archivo `.env.local` en la raíz:

```
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:8000/graphql/
```

## Scripts

| Acción | Comando |
|--------|---------|
| Servidor de desarrollo | `pnpm dev` |
| Build de producción | `pnpm build` |
| Iniciar producción | `pnpm start` |
| Lint | `pnpm lint` |
| Formatear código | `pnpm format` |
| Codegen GraphQL | `pnpm codegen` |

## Arquitectura

Proyecto basado en **Feature-Sliced Design (FSD)**:

```
app/                    # App Router de Next.js
  dashboard/            # Rutas protegidas
    <seccion>/page.tsx  # Wrappers delgados → views/

entities/               # Modelos de dominio, queries/mutations GraphQL, esquemas Zod, exportadores PDF/Excel
features/               # Acciones de usuario con lógica de negocio (filtros, formularios, sesión en progreso)
widgets/                # Bloques complejos autónomos (tablas, dashboards, navegación)
views/                  # Orquestadores de página (componen widgets + features)
shared/                 # UI kit, cliente Apollo, stores Zustand, permisos, utilidades
config/                 # Providers, configuración de la app
```

**Regla de importaciones**: las capas solo importan de abajo hacia arriba (`entities ← features ← widgets ← views`, `shared` desde cualquier lugar).

## Módulos principales

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Dashboard | `/dashboard` | Vista general con estadísticas y accesos rápidos |
| Pacientes | `/dashboard/pacientes` | Gestión de pacientes y formulario clínico |
| Agenda | `/dashboard/agenda` | Citas y calendario |
| Sesiones | `/dashboard/sesiones` | Sesiones de terapia con registro en progreso |
| Ciclos | `/dashboard/ciclos` | Ciclos de tratamiento |
| Expedientes | `/dashboard/expedientes` | Historial clínico |
| Evaluaciones | `/dashboard/evaluaciones` | Evaluaciones y escalas |
| Planes | `/dashboard/planes` | Planes de intervención |
| Informes | `/dashboard/informes` | Generación de informes |
| Pagos | `/dashboard/pagos` | Gestión de pagos y descuentos |
| Gastos | `/dashboard/gastos` | Control de gastos |
| Inventario | `/dashboard/inventario` | Inventario de recursos |
| Instituciones | `/dashboard/instituciones` | Gestión de instituciones y grupos |
| Marketing | `/dashboard/marketing` | Campañas y leads |
| Cursos | `/dashboard/cursos` | Cursos y capacitación |
| Blog | `/dashboard/blog` | Publicaciones con Markdown y LaTeX |
| Usuarios | `/dashboard/usuarios` | Gestión de usuarios |
| Roles | `/dashboard/roles` | Roles y permisos |
| Portal Familiar | `/dashboard/portal-familiar` | Portal para tutores |
| Mi Perfil | `/dashboard/mi-perfil` | Edición de perfil y contraseña |

## Stack tecnológico

- **Framework**: Next.js 16 (App Router)
- **GraphQL**: Apollo Client v4 + GraphQL Codegen
- **Formularios**: react-hook-form + zod
- **Estado**: Apollo Cache (server) + Zustand (UI)
- **Estilos**: Tailwind CSS v4
- **Gráficas**: Recharts
- **Exportación**: jsPDF, docx, xlsx
- **Markdown**: react-markdown + KaTeX (matemáticas)
- **Animaciones**: Motion
- **Iconos**: Lucide React
- **Notificaciones**: Sonner

## Convenciones

- Carpetas: `kebab-case`
- Componentes: `PascalCase`
- Nombres de lógica de negocio: **español** (ej. `usePacientes`, `esquemaPaciente`)
- Exportadores PDF/Excel aceptan DTOs, no modelos de Apollo directamente

## Autenticación

- JWT almacenado en `localStorage` (`token`, `refreshToken`)
- Verificación de sesión en `app/dashboard/layout.tsx` vía query `CONSULTA_YO`
- Redirección a `/login` si la autenticación falla

## GraphQL Codegen

Los archivos generados en `shared/api/generated/` están commiteados. Ejecutar `pnpm codegen` después de cambios en el esquema o queries.

Documentos escaneados: `entities/**/*.ts`, `shared/api/**/*.ts`, `features/**/*.ts`
