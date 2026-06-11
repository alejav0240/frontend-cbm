# Arquitectura - CBM Frontend (FSD)

Este proyecto utiliza **Feature-Sliced Design (FSD)**, una metodología arquitectónica para el desarrollo de aplicaciones frontend que prioriza la escalabilidad, el desacoplamiento y la mantenibilidad.

## Pilares Tecnológicos
- **Framework:** Next.js 15 (App Router) + Turbopack
- **Capa de Datos:** Apollo Client (GraphQL)
- **Gestión de Estado:** Zustand (UI Global) + Apollo Cache (Server State)
- **Formularios:** React Hook Form + Zod
- **Estilos:** Tailwind CSS

## Estructura de Capas (FSD)

```text
frontend/
├── app/                  # Entrada de la aplicación, rutas y layouts
├── views/                # Composiciones de página (anteriormente /pages)
├── widgets/              # Bloques complejos autónomos (Tablas, Sidebar, Métricas)
├── features/             # Acciones de usuario con lógica de negocio (Filtros, Grabación)
├── entities/             # Lógica de dominio, modelos y API Apollo
└── shared/               # UI Kit base, clientes de API y utilidades globales
```

### 1. Entities (Capa de Dominio)
Contiene el "qué" de la aplicación. Cada entidad (ej. `paciente`, `sesion`, `pago`) se estructura internamente en:
- `api/`: Consultas y mutaciones GraphQL + Hooks de Apollo.
- `model/`: Tipos TypeScript, Esquemas Zod y DTOs de exportación.
- `lib/`: Lógica de transformación, generadores de PDF/Excel y utilidades específicas.
- `ui/`: Componentes visuales de bajo nivel (ej. `PacienteCard`).

### 2. Features (Capa de Interacción)
Implementa las acciones que el usuario puede realizar.
- `filtrar-pacientes`: Lógica de búsqueda con debounce.
- `gestion-paciente`: Formularios de creación y edición.
- `sesion-en-progreso`: Lógica de grabación, temporizadores y notas clínicas.

### 3. Widgets (Capa de Composición)
Combina entidades y features en bloques de interfaz autónomos.
- `tabla-pacientes`: Lista interactiva con filtros.
- `dashboard-metricas`: Resumen visual de KPIs.
- `navegacion`: Sidebar y Topbar inteligentes.

### 4. Views (Capa de Vistas)
Orquestadores de widgets y features. Son componentes de alto nivel que se inyectan en las rutas del `app/`.

## Patrón de Exportación y Desacoplamiento (DTO)

Para evitar que los servicios de exportación (PDF/Excel) se rompan ante cambios en el backend, utilizamos **DTOs (Data Transfer Objects)** en la capa `entities/*/lib`.

1. **Adaptador:** La vista transforma el modelo del servidor al DTO de exportación.
2. **Generador:** El generador de PDF/Excel solo conoce el DTO, no el modelo de Apollo.

## Navegación

El proyecto ha eliminado la navegación SPA basada en estado. Se utiliza el **App Router de Next.js** de forma nativa:
- Las rutas viven en `app/(dashboard)/*`.
- Se utiliza el componente `Link` de Next.js para una navegación optimizada.
- El bundle de JavaScript se divide automáticamente por ruta (Code Splitting).

## Convenciones de Nomenclatura
- **Carpetas:** `kebab-case`.
- **Componentes:** `PascalCase`.
- **Lógica de Negocio:** Español (ej. `usePacientes`, `esquemaPaciente`).
- **Imports:** Absolutos usando `@/layers/...`.
