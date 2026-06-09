# Shared

## UI Components — `shared/ui/`

### Componentes de layout

| Componente | Descripción |
|---|---|
| `Sidebar.tsx` | Sidebar colapsable. Lee `menuGroups` filtrados por permisos. Usa `useDashboardStore` para navegación |
| `Topbar.tsx` | Barra superior con búsqueda global, notificaciones y perfil |

### Modales

| Componente | Props clave | Descripción |
|---|---|---|
| `components/Modal.tsx` | `isOpen, onClose, title, maxWidth?` | Modal base genérico |
| `ConfirmModal.tsx` | `isOpen, onClose, onConfirm, title, message, confirmLabel?` | Confirmación de acciones destructivas |
| `PDFExportModal.tsx` | `data, generatePDF, generateExcel?, fileName, filtersConfig?` | Exportación con preview PDF y botón Excel opcional |

### Otros

| Componente | Descripción |
|---|---|
| `Pagination.tsx` | Paginación numérica |
| `MusicalNotes.tsx` | Decoración SVG de notas musicales |
| `LoadingScreen.tsx` | Pantalla de carga inicial |
| `components/SearchableSelect.tsx` | Select con búsqueda integrada |
| `components/PermissionGuard.tsx` | Renderiza children solo si el usuario tiene el permiso |
| `components/CalendarPicker.tsx` | Selector de fecha |
| `components/SidebarItem.tsx` | Item individual del sidebar |

### PermissionGuard

```tsx
// Oculta el botón si no tiene permiso "pacientes:add"
<PermissionGuard permission="pacientes:add">
  <button>Nuevo Paciente</button>
</PermissionGuard>

// Hook equivalente
const canDelete = useCan('pacientes:delete');
```

### PDFExportModal con Excel

```tsx
<PDFExportModal
  isOpen={showExport}
  onClose={() => setShowExport(false)}
  title="Exportar Pacientes"
  data={patients}
  generatePDF={generatePatientsPDF}
  generateExcel={generatePatientsExcel}   // opcional
  fileName="reporte_pacientes"
  filtersConfig={[...]}
/>
```

## Lib — `shared/lib/`

### `hooks/useDebounce.ts`

```ts
const debouncedValue = useDebounce(value, 500);
```

### `permissions/permissions.config.ts`

Contiene `PERMISSIONS` (objeto constante), `MENU_GROUPS` (configuración del menú con permisos), y `getFilteredMenu()` (deprecado — usar `usePermissions()`).

## Data — `shared/data/`

### `permissions.ts`

```ts
canAccess(modules, 'pacientes:add')        // boolean
toPermissionKey('pacientes', 'view')       // 'pacientes:view'
normalizePermissions(rawPermissions)       // PermissionKey[]
```

Formato de permisos: `"modulo:accion"` donde acción es `view | add | change | delete`.
