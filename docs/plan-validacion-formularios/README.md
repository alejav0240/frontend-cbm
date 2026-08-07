# Plan: Validar los 21 formularios con react-hook-form + zod

## Contexto

El sistema tiene **35 formularios** de entrada de datos. De ellos, **14 ya están validados**
(`useForm` + `zodResolver`). Este plan cubre los **21 restantes** para llevarlos al mismo
estándar definido en `AGENTS.md`:

> Forms: `react-hook-form` + `zod` (`@hookform/resolvers/zod`). Zod schemas live per entity:
> `entities/<nombre>/model/esquema.ts`.

## Decisiones tomadas

- **Enfoque:** convertir todos a `react-hook-form` + `zodResolver` (consistente con los 14 ya validados).
- **Alcance:** por fases (3 fases).
- **Código muerto:** eliminar `views/sesiones/ui/components/SessionFormModal.tsx`.

## Convenciones a seguir (consistentes con el código existente)

- Esquemas zod en `entities/<x>/model/esquema.ts` (patrón `z.object(...)` + `export type`).
- `useForm` + `zodResolver` con `defaultValues` (desde `initialData` para edición).
- Campos nativos con `{...register("campo")}`; `{ valueAsNumber: true }` para números;
  `z.coerce.number()` en schemas cuando haga falta.
- `SearchableSelect` con `Controller` o `setValue(..., { shouldValidate: true })` + `watch()`.
- Errores con `<p className="text-xs text-red-500">{errors.x?.message}</p>`.
- Formularios "tontos" (estado en el padre): mover el estado al formulario; el `onSubmit`
  del padre pasa de `(e: FormEvent)` a `(data)` y deja de recibir setters.

---

## Fase 1 — Autocontenidos (9) · estado interno → `useForm`

| Formulario | Archivo form | Esquema |
|---|---|---|
| Pago | `views/pagos/.../PaymentFormModal.tsx` | Reusar **`esquemaCrearPago`** (ya existe, sin usar). Total calculado con `watch()` |
| Descuento | `views/pagos/.../DiscountFormModal.tsx` | Reusar **`esquemaCrearDescuento`** (ya existe) |
| Recurso | `features/gestion-recurso/.../ResourceFormModal.tsx` | Nuevo `entities/recurso/model/esquema.ts` |
| Sesión de prueba | `features/gestion-sesion/.../FormSesionPrueba.tsx` | Nuevo `entities/sesion/model/esquema.ts` |
| Lead | `views/marketing/.../LeadFormModal.tsx` | Nuevo `entities/marketing/model/esquema.ts` |
| Campaña | `views/marketing/.../CampaignFormModal.tsx` | Mismo archivo marketing |
| Artículo inventario | `views/inventario/.../InventoryFormModal.tsx` | Nuevo `entities/inventario/model/esquema.ts` |
| Curso | `views/cursos/.../CourseFormModal.tsx` | Nuevo `entities/curso/model/esquema.ts` |
| Inscripción | `views/cursos/.../EnrollStudentModal.tsx` | Mismo archivo curso |

**Padres:** sin refactor (mantienen `onAdd` / `onSave` / `onSubmit(data)`).

## Fase 2 — Controlados por el padre (9) · migrar estado al formulario

| Formulario | Padre a refactorizar |
|---|---|
| `InterventionPlanForm.tsx` | `PlanesPage.tsx` (quitar 3 `useState`, `handleCreatePlan(data)`) |
| `StepFormModal.tsx` | `PlanesPage.tsx` (quitar 8 `useState`, `handleCreateStep(data)`) |
| `CycleForm.tsx` | `CrearCicloModal.tsx` (mover estado al `ContenidoFormulario`/form) |
| `SessionFormModal.tsx` (instituciones) | `InstitucionesPage.tsx` |
| `EvaluationForm.tsx` | `EvaluacionesPage.tsx` (useForm para paciente/fecha/tipo/escala; score y subescalas como estado adicional del form) |
| `ReportFormModal.tsx` | `InformesPage.tsx` |
| `InstitutionFormModal.tsx` | `InstitucionesPage.tsx` |
| `GroupFormModal.tsx` | `InstitucionesPage.tsx` |
| `ExpenseForm.tsx` | `views/gastos` (padre que maneja `newExpense`) |

## Fase 3 — Especiales (3)

1. **Editar notas de sesión** (expedientes, form inline): validar notas no vacías con un
   schema pequeño (inline o `entities/sesion`).
2. **Cuestionario de ingreso** (expedientes, dinámico vía `ViewForm`): generar un schema zod
   dinámico a partir de las preguntas del template (usando `isRequired`) y validar
   `formValues` antes del submit.
3. **Eliminar `views/sesiones/ui/components/SessionFormModal.tsx`** (código muerto, no se
   importa en ningún lado — verificado).

---

## Inventario completo de formularios

### ✅ Ya validados (14)

| Formulario | Archivo |
|---|---|
| Login | `app/login/page.tsx` |
| Contacto (landing) | `app/page.tsx` |
| Usuario | `features/gestion-usuario/ui/UserForm.tsx` |
| Crear paciente | `features/gestion-paciente/ui/FormularioCrearPaciente.tsx` |
| Información clínica | `features/gestion-paciente/ui/FormularioClinico.tsx` |
| Crear sesión | `features/gestion-sesiones/ui/ModalCrearSesion.tsx` |
| Crear escala | `features/gestion-escalas/ui/FormularioCrearEscala.tsx` |
| Rol | `views/roles/ui/components/RoleFormModal.tsx` |
| Nueva cita | `views/agenda/ui/components/FormNuevaCita.tsx` |
| Blog | `views/blog/ui/components/BlogForm.tsx` |
| Editar perfil | `views/mi-perfil/ui/MiPerfilPage.tsx` |
| Cambiar contraseña | `views/mi-perfil/ui/MiPerfilPage.tsx` |
| Crear formulario (cuestionario) | `views/formularios/ui/components/FormCreateModal.tsx` |
| Asignar formulario | `views/formularios/ui/components/FormAssignModal.tsx` |

### ❌ Sin validar (21) — objetivo de este plan

Ver tablas de Fases 1, 2 y 3.

---

## Verificación

- `pnpm lint` (eslint) y `pnpm build` tras cada fase.
- No hay test framework configurado (según `AGENTS.md`).

## Riesgos / notas

- `EvaluationForm` es el más complejo (score dinámico por escala); se valida el núcleo y se
  mantienen los controles de puntuación.
- Los esquemas de pago existentes ya definen `sessionsCount` / `value` como `z.number()`;
  confirmar compatibilidad con `valueAsNumber`.
