# Arquitectura y Estado del Proyecto - CBM Frontend

Este documento detalla la estructura actual, los patrones de diseño y el estado técnico del frontend tras el refactor de hooks y la estabilización de componentes globales.

## 1. Visión General de la Arquitectura

El proyecto está construido sobre **Next.js 15+ (App Router)** utilizando una arquitectura modular orientada a dominios. Se prioriza la separación de responsabilidades entre la capa de datos (GraphQL/Apollo), la lógica de negocio (Hooks) y la interfaz de usuario (Componentes).

### Pilares Tecnológicos:
- **Framework:** Next.js (TypeScript)
- **Gestión de Estado:** Zustand (Global) + Apollo Cache (Server State)
- **Capa de Datos:** Apollo Client (GraphQL)
- **Formularios:** React Hook Form + Zod (Validación)
- **Estilos:** Tailwind CSS (Vanilla CSS para componentes complejos)

---

## 2. Estructura de Directorios

El proyecto se divide en tres áreas principales:

```
frontend/
├── app/                # Rutas de Next.js y Layouts globales
├── modules/            # Dominios de negocio independientes (Modular)
│   ├── atencion/       # Pacientes, Sesiones, Agenda
│   ├── clinica/        # Planes, Evaluaciones, Expedientes
│   ├── operaciones/    # Pagos, Inventario, Gastos
│   └── sistema/        # Usuarios, Roles, Ajustes
├── shared/             # Recursos compartidos por todos los módulos
│   ├── ui/             # Componentes base (Botones, Modales, Tablas)
│   ├── store/          # Stores de Zustand (UI, Loading, Auth)
│   └── lib/            # Utilidades, Hooks genéricos, Config Apollo
└── config/             # Configuración de proveedores y router
```

---

## 3. Patrón de Hooks Refactorizado

Se ha implementado un patrón de **Hooks Granulares** para evitar los "God Hooks" que mezclaban consultas (queries) y acciones (mutations).

### Estructura de un Módulo (Ejemplo: `pagos`)
Cada submódulo ahora sigue este esquema de responsabilidades:

- `usePayments.ts`: Hook de solo lectura (Query) para listar pagos.
- `useCreatePayment.ts`: Hook de acción (Mutation) para crear.
- `useUpdatePayment.ts`: Hook de acción (Mutation) para actualizar.
- `useDeletePayment.ts`: Hook de acción (Mutation) para eliminar.

### Beneficios:
1. **Estabilidad de Renderizado:** Los componentes que solo mutan no se re-renderizan cuando la lista cambia, a menos que sea explícito.
2. **Reutilización:** `useCreatePayment` puede ser usado en diferentes partes de la app sin importar cómo se listan los datos.
3. **Mantenibilidad:** Menos líneas de código por archivo y mayor claridad en las dependencias de Apollo.

---

## 4. Estado de la Capa de Datos (Apollo/GraphQL)

- **Mutaciones:** Todas las mutaciones ahora aceptan un callback `onCompleted` opcional para facilitar el refresco de datos (`refetch`) desde el componente o hook de vista superior.
- **Fragmentación:** Se recomienda el uso de fragmentos para mantener la consistencia de tipos entre componentes.
- **Loading State:** Se utiliza un `loadingStore` (Zustand) global para manejar indicadores de carga persistentes en la UI durante mutaciones críticas.

---

## 5. Componentes Globales y UI

### PDFExportModal
- **Estado:** Corregido error de "Maximum update depth exceeded".
- **Mejora:** Implementación de referencias estables para filtros y memoización de datos de entrada.
- **Capacidad:** Soporta exportación a PDF (jsPDF), Excel y Word de forma dinámica mediante inyección de funciones generadoras.

### Shared UI
- **Modal:** Componente base estandarizado para todos los diálogos.
- **SearchableSelect:** Implementación personalizada para búsqueda asíncrona de pacientes y terapeutas.

---

## 6. Próximos Pasos Recomendados

1. **Normalización de Tipos:** Consolidar todos los esquemas de Zod y tipos de TypeScript en la carpeta `types/` de cada módulo para evitar duplicidad.
2. **Pruebas Unitarias:** Implementar tests para los hooks de mutación ahora que están aislados.
3. **Optimización de Bundle:** Revisar las dependencias de exportación de archivos (Word/Excel) para carga dinámica (Code Splitting).

---
*Última actualización: Junio 2026*
