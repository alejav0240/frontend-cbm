# Plan maestro de casos de prueba

## 1. Objetivo

Validar de extremo a extremo todos los flujos e interacciones observables de CBM: sitio
público, autenticación, navegación, permisos, módulos clínicos, operación, finanzas,
administración, comunidad, portal familiar e integraciones. El plan cubre UI, API GraphQL,
persistencia, errores, accesibilidad básica y comportamiento responsive.

Este documento es el catálogo de pruebas. Un caso se considera cubierto solamente cuando
verifica el resultado visible **y** el efecto persistido mediante recarga o consulta API.

## 2. Alcance y niveles

| Nivel | Objetivo | Herramienta sugerida |
|---|---|---|
| Unitario | Esquemas Zod, transformaciones, permisos, temporizador y colas | Vitest/Jest |
| Componente | Formularios, tablas, selectores, modales y estados | Testing Library |
| API/integración | Queries/mutations, reglas de negocio, propiedad y permisos | Django TestCase/GraphQLTestCase |
| E2E | Flujos reales por rol y navegador | Playwright |
| No funcional | Accesibilidad, responsive, seguridad y rendimiento | axe, Playwright, Lighthouse |

## 3. Datos, roles y ambientes

Datos mínimos aislados por ejecución:

- Administrador con todos los permisos.
- Terapeuta A con permisos CRUD y pacientes/sesiones propios; Terapeuta B con datos ajenos.
- Personal con permisos parciales: solo ver, crear, editar o eliminar.
- Tutor sin paciente, con un paciente y con varios pacientes.
- Paciente activo, inactivo, con expediente completo y sin datos clínicos.
- Registros suficientes para paginación, búsqueda sin resultados y exportación.
- Integración OneDrive conectada, desconectada, token vencido y servicio no disponible.

Ambientes: API y frontend limpios, reloj controlable, correo/OneDrive simulables y archivos
de prueba válidos, sobredimensionados, con tipo inválido y nombre duplicado.

## 4. Criterio común para cada pantalla CRUD

Aplicar `COM-01` a `COM-16` a cada módulo que exponga la interacción correspondiente:

| ID | Caso | Resultado esperado |
|---|---|---|
| COM-01 | Abrir ruta desde menú y URL directa | Título, datos y acción principal correctos; sin errores de consola |
| COM-02 | Estado de carga, vacío, error y reintento | No hay parpadeos/datos viejos; mensaje y recuperación correctos |
| COM-03 | Buscar con coincidencia, mayúsculas, espacios y sin resultado | Filtro consistente, debounced y reinicia la página |
| COM-04 | Combinar filtros, limpiar uno y limpiar todos | URL/estado y resultados quedan sincronizados |
| COM-05 | Paginar hacia delante/atrás y cambiar filtros | Límites correctos; no duplica ni omite filas |
| COM-06 | Abrir modal, cerrar con Cancelar, X, Escape y clic exterior | No persiste cambios ni conserva valores indebidos |
| COM-07 | Enviar formulario vacío e inválido | Mensajes por campo; foco en primer error; sin mutation |
| COM-08 | Crear con valores mínimos y completos | Una sola mutation, aviso de éxito y dato persistido |
| COM-09 | Doble clic o red lenta al guardar | Botón bloqueado; no crea duplicados |
| COM-10 | Editar, cancelar y guardar | Precarga correcta; cancelar no altera; guardar persiste |
| COM-11 | Eliminar: cancelar y confirmar | Confirmación explícita; solo confirmar elimina y refresca |
| COM-12 | Error 400/GraphQL/500 en mutation | Conserva datos ingresados, informa error y permite reintento |
| COM-13 | Sesión expirada durante lectura y escritura | Renueva token o redirige a login sin ejecutar dos veces |
| COM-14 | Exportar PDF/Excel con filtros y caracteres especiales | Archivo válido, columnas/datos/acentos correctos |
| COM-15 | Teclado, foco, etiquetas y lector de pantalla | Orden lógico, foco atrapado/restaurado y nombres accesibles |
| COM-16 | Desktop, tablet y móvil | Sin overflow accidental; acciones y tablas siguen utilizables |

## 5. Casos funcionales por flujo

### Público, autenticación y shell

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| PUB-01 | Recorrer navegación de landing y CTA | Anclas/rutas correctas y foco visible |
| PUB-02 | Enviar contacto válido, inválido y con fallo de red | Valida, evita duplicado e informa éxito/error |
| AUTH-01 | Login válido por rol | Cookies HttpOnly creadas y ruta inicial acorde al rol |
| AUTH-02 | Usuario/contraseña inválidos, vacíos e inactivo | Mensaje seguro; no revela qué credencial falló |
| AUTH-03 | Acceder a dashboard sin sesión | Redirección a login y retorno seguro tras autenticarse |
| AUTH-04 | Refresh con access token vencido y refresh válido/inválido | Recupera sesión o la cierra limpiamente |
| AUTH-05 | Logout desde menú y con API fallida | Cookies/estado local limpiados y rutas privadas bloqueadas |
| AUTH-06 | Abrir dos pestañas y cerrar sesión en una | La otra pestaña deja de exponer datos privados |
| NAV-01 | Expandir/contraer sidebar, navegar y usar atrás/adelante | Selección y ruta permanecen sincronizadas |
| NAV-02 | Alternar tema y recargar | Preferencia persiste sin flash incorrecto |
| NAV-03 | Onboarding: completar, omitir y volver a entrar | Se guarda por usuario y vista una sola vez |
| NAV-04 | Ruta inexistente, error de página y loading global | 404/error/reintento correctos |

### Autorización

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| PER-01 | Admin entra a todos los módulos | Acceso total |
| PER-02 | Usuario sin `view` abre menú y URL directa | Menú oculto y acceso directo denegado |
| PER-03 | Solo `view` intenta crear/editar/eliminar | Acciones ocultas/bloqueadas y API rechaza manipulación directa |
| PER-04 | Probar por separado `add`, `change`, `delete` | Cada permiso habilita únicamente su acción |
| PER-05 | Cambiar permisos durante una sesión | Se aplican tras refresco/renovación sin conservar acceso viejo |
| PER-06 | Terapeuta intenta leer/modificar datos de otro | API deniega y UI no filtra información sensible |
| PER-07 | Tutor intenta rutas administrativas | Solo accede al portal familiar y a sus pacientes |

### Dashboard y agenda

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| DASH-01 | Cargar métricas, sesiones del día y balance | Valores coinciden con API y manejan cero/nulos |
| DASH-02 | Usar todas las acciones rápidas | Cada tarjeta lleva al módulo correcto |
| AGE-01 | Alternar día/semana/mes y navegar fechas/hoy | Rango, encabezado y eventos coinciden |
| AGE-02 | Crear cita con paciente/terapeuta, fecha y hora | Aparece una vez en agenda y persiste |
| AGE-03 | Validar choque horario, fecha pasada y campos vacíos | Se impide guardar con mensaje específico |
| AGE-04 | Buscar paciente/terapeuta remoto y sin resultados | Loading, selección y limpieza correctos |
| AGE-05 | Agendar sesión de prueba individual/grupal | Datos completos persistidos y modal reiniciado al reabrir |

### Pacientes y expedientes

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| PAC-01 | Crear paciente con/sin foto y datos mínimos/completos | Foto y registro persisten; se crean notas clínicas por defecto |
| PAC-02 | Foto inválida, excesiva o carga interrumpida | Rechazo seguro o reintento sin paciente parcial |
| PAC-03 | Buscar, filtrar estado, paginar y exportar | Resultados y archivo respetan los filtros |
| PAC-04 | Abrir acción clínica, validar y guardar notas | Actualización idempotente y visible tras recarga |
| PAC-05 | Editar estado/datos y eliminar/cancelar eliminación | Tabla y detalle quedan consistentes |
| EXP-01 | Seleccionar paciente y entrar por URL de detalle | Pestaña/resumen corresponden al ID solicitado |
| EXP-02 | Cambiar entre resumen, sesiones, evaluaciones y ciclos | Datos correctos; estado de pestaña estable |
| EXP-03 | Abrir/cerrar/guardar información clínica | Precarga y persistencia correctas |
| EXP-04 | Completar cuestionario dinámico con requeridos y tipos | Validación por pregunta y una respuesta persistida |
| EXP-05 | Ver sesión: notas, recursos, inventario, pasos, escalas y formularios | Todo lo registrado en sesión aparece sin pérdidas |
| EXP-06 | ID inexistente o paciente ajeno | 404/denegación sin filtrar datos |

### Sesiones, ciclos y sesión en progreso (P0)

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| SES-01 | Crear sesión normal y asociada a ciclo | Fecha/terapeuta/paciente y ciclo calculado correctamente |
| SES-02 | Filtrar por estado/terapeuta/paciente y paginar | Solo datos autorizados y conteos correctos |
| SES-03 | Ver detalle, editar notas y recargar | Notas persistidas sin sobrescribir cambios ajenos |
| SES-04 | Completar y eliminar sesión con confirmación | Transiciones válidas; vistas relacionadas se actualizan |
| SES-05 | Iniciar sesión sin configuración o con ID inválido | Bloqueo y mensaje accionable |
| LIVE-01 | Iniciar/pausar/reanudar temporizador | Tiempo preciso y sin doble intervalo |
| LIVE-02 | Recargar, ocultar pestaña y volver | Estado/tiempo se recuperan según diseño |
| LIVE-03 | Escribir notas e insertar timestamp/tags con cursor | Texto insertado en posición correcta; autoguardado visible |
| LIVE-04 | Marcar/desmarcar pasos del plan | Badge/progreso y datos finales coinciden |
| LIVE-05 | Seleccionar/deseleccionar recursos | Badge y recursos de sesión coinciden |
| LIVE-06 | Completar escalas de subescalas/lista de valores | Cálculo, requeridos y respuestas persistidos |
| LIVE-07 | Completar formularios dinámicos | Tipos/requeridos correctos; respuesta ligada a asignación |
| LIVE-08 | Autorizar/denegar cámara y micrófono | Preview o error recuperable; controles reflejan estado real |
| LIVE-09 | Iniciar/detener grabación, espejo y Picture-in-Picture | Archivo reproducible y controles coherentes |
| LIVE-10 | Perder conexión durante grabación/subida | Fragmentos quedan en IndexedDB y reintentan sin duplicarse |
| LIVE-11 | Token OneDrive vencido o backend no disponible | Grabación queda pendiente; progreso/error y retry correctos |
| LIVE-12 | Finalizar con/sin grabación y con carga pendiente | Confirmación clara; sesión completa sin perder material |
| LIVE-13 | Intentar cerrar/navegar con cambios pendientes | Advertencia y elección respetadas |
| CIC-01 | Crear ciclo y verificar sesiones generadas | Cantidad, fechas y asociación correctas |
| CIC-02 | Expandir ciclo y completar una sesión | Progreso y estados se actualizan |
| CIC-03 | Cambiar estado de pago | Persistencia y reflejo en finanzas |
| CIC-04 | Eliminar ciclo con sesiones | Regla de negocio y confirmación correctas |

### Evaluaciones, escalas, planes, informes y formularios

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| EVA-01 | Crear evaluación para escala de subescalas | Puntajes y total correctos |
| EVA-02 | Crear evaluación para lista de valores | Solo valores válidos; detalle correcto |
| EVA-03 | Ver/eliminar evaluación y exportar | Persistencia, confirmación y archivo correctos |
| ESC-01 | Crear escala por subescalas; agregar/quitar/reordenar | Requeridos y estructura persisten |
| ESC-02 | Crear escala por valores; agregar/quitar opciones | No permite lista vacía/duplicados inválidos |
| ESC-03 | Buscar, editar/eliminar y exportar escalas | CRUD y archivo consistentes |
| PLA-01 | Crear plan, validar fechas/objetivo y asociar paciente | Plan aparece con 0% y persiste |
| PLA-02 | Expandir plan; crear/editar/eliminar/reordenar pasos | Orden y porcentaje se actualizan |
| PLA-03 | Completar pasos desde sesión y exportar PDF | Progreso compartido y PDF correcto |
| INF-01 | Buscar paciente y crear informe con URL/tipo válidos | Informe aparece y queda ligado a paciente/tutor |
| INF-02 | URL inválida, paciente vacío y error de envío | Validación y recuperación sin pérdida |
| INF-03 | Ver detalle, lista de tutores y eliminar/exportar | Datos autorizados y acciones consistentes |
| FOR-01 | Crear plantilla y agregar/quitar/reordenar tipos de pregunta | Estructura y requeridos persisten |
| FOR-02 | Previsualizar plantilla vacía/completa | Preview coincide con formulario final |
| FOR-03 | Asignar a paciente/tutor con fecha límite | Asignación aparece una vez |
| FOR-04 | Responder requeridos/opcionales y reenviar | Estado pasa a completado; no duplica respuesta |
| FOR-05 | Pestañas Plantillas/Asignaciones/Respuestas y filtros | Conteos, URL y resultados correctos |
| FOR-06 | Eliminar plantilla con asignaciones | Se aplica la regla de integridad sin huérfanos |

### Finanzas, inventario y análisis

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| PAG-01 | Registrar pago total/parcial con/sin descuento | Total, saldo y estado calculados correctamente |
| PAG-02 | Alternar Pagos/Descuentos; crear y eliminar descuento | Acción/título/datos corresponden a la pestaña |
| PAG-03 | Buscar, filtrar fechas/estado y exportar recibo/listado | Datos filtrados y archivos correctos |
| GAS-01 | Crear gasto con categorías, montos y fechas límite | Estadísticas y listado se actualizan |
| GAS-02 | Cambiar estado, editar/eliminar y exportar | Totales recalculados y persistentes |
| INV-01 | Crear/editar ítem; validar stock/precio/categoría | Valores no negativos y estadísticas correctas |
| INV-02 | Buscar, ajustar estado/stock, eliminar y exportar | Alertas/totales y archivo consistentes |
| ANA-01 | Cambiar rango temporal | Todos los gráficos y KPIs usan el mismo rango |
| ANA-02 | Cero datos, nulos y error parcial | Gráficos no fallan ni muestran NaN |

### Instituciones, blog, cursos, recursos y marketing

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| INS-01 | Crear/editar/eliminar institución | Listado y detalle persisten |
| INS-02 | Entrar al detalle; crear/editar/eliminar grupo | Grupo queda ligado a institución correcta |
| INS-03 | Entrar al grupo; crear/editar/eliminar sesión | Sesión queda ligada al grupo y respeta permisos |
| BLOG-01 | Crear borrador/publicación con contenido y metadatos | Estado y tarjeta correctos |
| BLOG-02 | Previsualizar, editar, publicar/despublicar y eliminar | Preview fiel y transición persistente |
| CUR-01 | Crear/editar/eliminar curso | Estadísticas/listado/detalle consistentes |
| CUR-02 | Inscribir estudiante duplicado/nuevo | Duplicado rechazado; nuevo aparece una vez |
| CUR-03 | Buscar/ver estudiantes y exportar PDF/Excel | Filtros y columnas correctos |
| REC-01 | Crear recurso por tipo y URL/archivo | Tarjeta y enlace/descarga correctos |
| REC-02 | Buscar, editar/eliminar y exportar | CRUD y archivo respetan filtros |
| MKT-01 | Crear/editar/eliminar campaña y validar presupuesto/fechas | Presupuesto restante y estado correctos |
| MKT-02 | Crear lead con/sin campaña y mover estado | Relación y métricas se actualizan |
| MKT-03 | Alternar Campañas/Leads y probar gráficos/filtros | Pestaña y datos permanecen sincronizados |

### Usuarios, roles, perfil y ajustes

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| USR-01 | Crear usuario con correo, rol y username/password automáticos | Credenciales únicas, correo y registro persistidos |
| USR-02 | Generar username varias veces y usar CI/email duplicado | Formato esperado; duplicados rechazados |
| USR-03 | Ver/ocultar/copiar credenciales | Clipboard correcto; contraseña no queda expuesta al cerrar |
| USR-04 | Editar estado/visibilidad/rol y eliminar | Acceso y tabla cambian de inmediato |
| ROL-01 | Crear/editar/eliminar rol | Nombre único y listado actualizado |
| ROL-02 | Marcar módulo completo y acciones individuales | Checkboxes padre/hijo y permisos persistidos |
| ROL-03 | Quitar permiso usado por sesión activa | API y navegación aplican el nuevo alcance |
| PERF-01 | Editar datos/foto y cancelar/guardar | Preview, persistencia y cabecera sincronizados |
| PERF-02 | Cambiar contraseña: actual incorrecta, nueva débil y válida | Reglas claras; login viejo falla y nuevo funciona |
| AJU-01 | Modificar cada preferencia y recargar | Valor persiste y se aplica donde corresponde |
| AJU-02 | Cancelar/restaurar valores y error de guardado | No hay cambios parciales; permite reintento |

### Portal familiar

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| POR-01 | Tutor sin pacientes | Estado vacío y orientación correcta |
| POR-02 | Tutor con uno o varios pacientes; seleccionar/cambiar | Solo datos del paciente elegido |
| POR-03 | Ver próxima sesión, actividad y progreso | Datos coinciden con clínica y manejan vacíos |
| POR-04 | Abrir/cerrar detalle de informe | Solo informes autorizados y contenido completo |
| POR-05 | Seleccionar y responder formulario pendiente | Abre formulario, valida y desaparece al completar |
| POR-06 | Contactar terapeuta y ver todos los informes | Acción/ruta funcional, no botones inertes |
| POR-07 | Intentar manipular ID de otro tutor | API deniega sin revelar existencia/datos |

### Integraciones y archivos

| ID | Flujo / interacción | Resultado esperado |
|---|---|---|
| INT-01 | Consultar estado y conectar OneDrive | Callback valida estado y refleja conexión |
| INT-02 | Callback cancelado/estado inválido/token inválido | Error seguro; secretos nunca llegan al cliente/log |
| INT-03 | Subir foto/grabación válida e inválida | Firma, tamaño, MIME y autorización validados |
| INT-04 | Consultar progreso, ver archivo y reintentar | Solo propietario/autorizado; resultado idempotente |
| INT-05 | Dos reintentos o workers concurrentes | Un único archivo/registro final |

## 6. Pruebas no funcionales

| ID | Área | Verificación |
|---|---|---|
| NF-01 | Navegadores | Chromium desktop, WebKit iPhone 13 y Chromium Pixel 5 |
| NF-02 | Responsive | 320, 375, 768, 1024 y 1440 px; portrait/landscape |
| NF-03 | Accesibilidad | Sin violaciones críticas axe; contraste, zoom 200%, teclado y SR |
| NF-04 | Rendimiento | Ruta inicial y tablas grandes dentro del presupuesto acordado |
| NF-05 | Resiliencia | Latencia, offline, timeout, 401, 403, 409, 500 y GraphQL parcial |
| NF-06 | Seguridad | CSRF, XSS en texto enriquecido, subida maliciosa, IDOR y rate limit de login |
| NF-07 | Privacidad | Sin tokens/PII en URL, consola, storage no seguro, trazas o exportes ajenos |
| NF-08 | Concurrencia | Ediciones simultáneas, doble submit y eliminación mientras otro usuario edita |

## 7. Automatización y prioridad

- **P0 por commit:** AUTH-01/03/04/05, PER-02/03/06, PAC-01, SES-01,
  LIVE-01/03/08/09/10/12, PAG-01, USR-01 y un smoke de cada ruta.
- **P1 nocturno:** CRUD completo, filtros/paginación, portal familiar, archivos, exportes y
  los tres proyectos Playwright.
- **P2 semanal:** accesibilidad completa, seguridad activa, rendimiento, concurrencia y
  matrices de error/compatibilidad.

Orden de implementación recomendado:

1. Fixtures/API helpers y usuarios por rol; cada prueba crea y limpia sus propios datos.
2. Unitarios de validación, permisos, cálculos y cola offline.
3. Integración backend para todas las queries/mutations, incluido 401/403 e IDOR.
4. E2E de persistencia para cada CRUD; reemplazar checks que solo abren modales.
5. Flujo `sesion-en-progreso`, portal familiar e integraciones.
6. No funcionales y pipeline CI con trazas, video y screenshots al fallar.

## 8. Trazabilidad con la suite actual

La suite existente ya ofrece smoke E2E para login, dashboard y 23 módulos, pero muchos
casos únicamente comprueban que una vista o modal abre. Antes de marcarlos como cubiertos:

- Exigir aserción de respuesta de red, mensaje y dato persistido tras recarga.
- Evitar dependencia entre archivos numerados o datos dejados por una prueba previa.
- Añadir casos E2E dedicados a `sesion-en-progreso` y `portal-familiar`.
- Ampliar backend, que hoy concentra cobertura en usuarios, clínica, sesiones,
  evaluaciones, pagos, instituciones, marketing, cargas y OneDrive.
- Incorporar cobertura API para módulos restantes y para cada combinación de permisos.

## 9. Criterios de entrada, salida y evidencia

Entrada: build estable, migraciones aplicadas, seed versionado, servicios simulables y
requisitos de negocio definidos para transiciones/destrucción.

Salida:

- 100% de P0 y P1 aprobados en Chromium; P0 aprobado en los tres proyectos.
- Cero defectos críticos/altos abiertos y cero violaciones críticas de accesibilidad.
- Cada permiso probado en UI y API; cada CRUD prueba éxito, validación, error y persistencia.
- Flujos P0 repetidos tres veces sin flakiness; archivos de salida abiertos/validados.

Evidencia por ejecución: ID del caso, commit, ambiente, rol/datos, resultado, duración,
captura/traza en fallo y enlace al defecto. Un caso bloqueado no cuenta como aprobado.
