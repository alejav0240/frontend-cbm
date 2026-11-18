# Flujos de rutas del frontend

Este documento describe qué puede hacer una persona usuaria en cada ruta visible del frontend y cómo se conecta cada pantalla con el resto del sistema. Los flujos se basan en los wrappers de `app/dashboard`, la navegación del sidebar, las vistas y las pruebas E2E disponibles.

> **Importante:** que una opción no aparezca en el menú depende de permisos y módulos del usuario. La visibilidad del enlace no sustituye una validación de autorización al acceder directamente por URL.

## 1. Entrada y navegación global

### Rutas públicas

| Ruta | Propósito | Flujo principal |
|---|---|---|
| `/` | Portada pública | Revisar la presentación del sistema y entrar al acceso. |
| `/login` | Autenticación | Introducir credenciales → validar → entrar a `/dashboard`; credenciales inválidas muestran un error. |

### Layout protegido

1. El layout consulta la sesión actual.
2. Si no existe una sesión válida, redirige a `/login`.
3. Para usuarios normales muestra sidebar, barra superior y contenido de la ruta.
4. Para tutores redirige a `/dashboard/portal-familiar` y limita la navegación al portal familiar.
5. Si existe una sesión terapéutica activa, aparece **En Progreso** y permite volver al registro en curso.
6. Desde el menú de perfil se puede abrir la guía de la página, cambiar el tema, ir al perfil o cerrar sesión.

## 2. Rutas de Atención

### `/dashboard` — Dashboard

**Objetivo:** obtener una vista rápida del estado del centro.

**Recorrido:**

1. Revisar bienvenida e indicadores generales.
2. Consultar sesiones programadas para el día.
3. Revisar balance y actividad reciente.
4. Usar las acciones rápidas para ir a pacientes, sesiones, pagos o evaluaciones.
5. Abrir la guía contextual para conocer sidebar, barra superior y bloques de la pantalla.

**Salidas:** pacientes, agenda, sesiones, pagos, evaluaciones y otras vistas mediante navegación o acciones rápidas.

### `/dashboard/pacientes` — Pacientes

**Objetivo:** administrar los registros de pacientes.

**Recorrido:**

1. Buscar o filtrar un paciente.
2. Crear un registro desde **Nuevo paciente** y completar sus datos.
3. Abrir el registro clínico desde la tabla cuando corresponda.
4. Editar o eliminar un registro después de confirmar la acción.
5. Usar la guía para ubicar búsqueda, filtros, tabla y acción principal.

**Salidas:** expediente clínico, ciclos, agenda y sesiones relacionadas.

### `/dashboard/agenda` — Agenda

**Objetivo:** organizar citas y sesiones.

**Recorrido:**

1. Cambiar entre las vistas disponibles del calendario.
2. Navegar entre fechas.
3. Crear una cita y buscar el paciente asociado.
4. Abrir una sesión de prueba cuando el flujo lo requiera.
5. Desde una cita, iniciar o consultar la sesión relacionada.

**Salidas:** sesión en progreso, pacientes y sesiones.

### `/dashboard/sesiones` — Sesiones

**Objetivo:** consultar y administrar sesiones terapéuticas.

**Recorrido:**

1. Crear una sesión nueva.
2. Revisar, filtrar o buscar sesiones registradas.
3. Iniciar una sesión para pasar a `/dashboard/sesion-en-progreso`.
4. Marcarla como completada desde la tabla.
5. Abrir detalles, editar notas o eliminar confirmando la acción.

**Salidas:** sesión en progreso, expediente y ciclos.

### `/dashboard/ciclos` — Ciclos

**Objetivo:** seguir el progreso de ciclos terapéuticos.

**Recorrido:**

1. Crear un ciclo.
2. Expandirlo para revisar sus sesiones.
3. Completar una sesión asociada.
4. Actualizar el estado de pago del ciclo.
5. Eliminarlo solo después de confirmar.

### `/dashboard/portal-familiar` — Portal Familiar

**Objetivo:** ofrecer a tutores la información compartida con la familia.

**Recorrido:**

1. Entrar al portal desde la redirección automática o el sidebar.
2. Consultar las secciones y datos disponibles.
3. Revisar el contenido compartido por el equipo.

**Nota:** los tutores son dirigidos aquí desde cualquier otra ruta del dashboard.

## 3. Rutas Clínicas

### `/dashboard/expedientes` — Expedientes

**Objetivo:** localizar pacientes y abrir su información clínica.

**Recorrido:**

1. Buscar un paciente.
2. Seleccionarlo para abrir `/dashboard/expedientes/[id]`.
3. Volver a la lista cuando termine la consulta.

### `/dashboard/expedientes/[id]` — Expediente del paciente

**Objetivo:** concentrar la información clínica y el seguimiento del paciente.

**Recorrido:**

1. Revisar datos generales y secciones del expediente.
2. Cambiar entre información general, análisis, ciclos e historial.
3. Abrir y guardar notas clínicas.
4. Completar o consultar el cuestionario de ingreso.
5. Revisar sesiones y abrir sus detalles.
6. Exportar el informe clínico o el informe de sesión en PDF/Word cuando las opciones estén disponibles.
7. Volver a `/dashboard/expedientes`.

### `/dashboard/evaluaciones` — Evaluaciones

**Objetivo:** crear y consultar evaluaciones.

**Recorrido:**

1. Abrir **Nueva evaluación**.
2. Completar los datos solicitados y guardar.
3. Buscar o revisar la evaluación en la lista.
4. Abrir el detalle de una evaluación.

### `/dashboard/planes` — Planes terapéuticos

**Objetivo:** definir el plan de intervención.

**Recorrido:**

1. Crear un plan.
2. Expandirlo para revisar sus etapas.
3. Abrir el formulario de pasos y completar objetivos.
4. Exportar el plan a PDF cuando corresponda.

### `/dashboard/escalas` — Escalas

**Objetivo:** administrar escalas de evaluación.

**Recorrido:** buscar una escala → revisar la lista → crear una nueva escala desde la acción principal.

### `/dashboard/informes` — Informes

**Objetivo:** generar y consultar informes terapéuticos.

**Recorrido:**

1. Buscar informes por paciente.
2. Abrir **Nuevo informe**.
3. Completar y guardar la información solicitada.
4. Consultar los informes existentes.

## 4. Rutas de Operaciones

### `/dashboard/pagos` — Pagos

Cambiar entre **Pagos** y **Descuentos** → registrar un nuevo pago → filtrar o revisar movimientos → abrir el modal de exportación cuando se necesite un archivo.

### `/dashboard/gastos` — Gastos

Revisar indicadores → registrar un gasto → buscar o filtrar gastos → confirmar el guardado.

### `/dashboard/inventario` — Inventario

Revisar estadísticas → añadir un ítem → buscar recursos existentes → consultar y mantener la tabla de inventario.

### `/dashboard/analisis` — Análisis

Consultar gráficos de salud financiera e impacto terapéutico → cambiar el rango temporal → interpretar la tendencia mostrada.

### `/dashboard/instituciones` — Instituciones

1. Crear una institución.
2. Abrir su detalle.
3. Crear o revisar un grupo dentro de la institución.
4. Abrir el detalle del grupo.
5. Crear o revisar una sesión asociada.

## 5. Rutas de Comunidad

### `/dashboard/blog` — Blog

Consultar artículos → crear un artículo → abrir la previsualización en el editor → guardar o volver a la lista.

### `/dashboard/cursos` — Cursos

1. Revisar estadísticas y cursos.
2. Crear un curso.
3. Abrir el curso para administrar estudiantes.
4. Inscribir un estudiante.
5. Consultar la lista de estudiantes.

### `/dashboard/cursos/[id]` — Detalle del curso

La ruta recibe el identificador del curso desde la lista. Su recorrido es consultar la información, administrar estudiantes, inscribir participantes y volver a `/dashboard/cursos`.

### `/dashboard/recursos` — Recursos

Abrir **Añadir recurso** → completar el formulario → guardar → buscar recursos en la lista.

### `/dashboard/marketing` — Marketing

1. Revisar el dashboard con sus gráficos.
2. Cambiar entre **Campañas** y **Leads**.
3. Crear una campaña.
4. Crear un lead.
5. Buscar o filtrar registros cuando el módulo lo permita.

## 6. Rutas de Sistema

### `/dashboard/usuarios` — Usuarios

**Acceso:** restringido a administradores y a quienes tengan el módulo habilitado.

**Recorrido:** cambiar entre **Personal** y **Tutores** → buscar → crear un usuario → validar correo → consultar credenciales generadas → ver credenciales de un usuario existente.

### `/dashboard/roles` — Roles

Listar roles → crear un rol → editar permisos → guardar la configuración.

### `/dashboard/formularios` — Formularios

Cambiar entre **Plantillas**, **Asignaciones** y **Respuestas** → crear un formulario → previsualizarlo → asignarlo → consultar respuestas.

### `/dashboard/ajustes` — Ajustes

Revisar las pestañas de configuración → modificar preferencias disponibles → guardar los cambios → confirmar el nuevo estado.

### `/dashboard/mi-perfil` — Mi perfil

Consultar la información básica → entrar en modo edición → actualizar datos → guardar.

## 7. Sesión en progreso

### `/dashboard/sesion-en-progreso`

Esta ruta usa una vista de pantalla completa y oculta temporalmente sidebar y barra superior.

1. Entrar desde una sesión, cita o acción del dashboard.
2. Registrar el desarrollo de la sesión y los datos disponibles.
3. Revisar el tiempo transcurrido y el estado de la sesión.
4. Finalizar la sesión.
5. Confirmar el cierre cuando el sistema lo solicite.
6. Tras guardar, regresar a `/dashboard/sesiones`.

Si se abandona la pantalla mientras hay cargas pendientes, el sistema conserva la cola de subidas para reanudarla cuando corresponda.

## 8. Reglas comunes

- Las acciones destructivas requieren confirmación.
- Los formularios deben validarse antes de guardar.
- Las listas suelen combinar búsqueda, filtros y acciones por fila.
- Las guías de Driver.js aparecen por primera vez en cada vista y se pueden repetir desde **Ver guía de esta página**.
- El menú se adapta a los permisos, módulos y rol del usuario.
