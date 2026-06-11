# Entidades de Dominio (Entities)

Este documento detalla las entidades principales del sistema y su responsabilidad dentro de la capa `entities/`.

## Estructura Estándar de una Entidad

Cada entidad debe seguir este patrón para asegurar el desacoplamiento:

```text
entities/<nombre>/
├── api/          # use<Nombre>(), useDetalle<Nombre>()
├── model/
│   ├── tipos.ts      # Interfaces de dominio (Server)
│   ├── esquema.ts    # Zod schemas (Validation)
│   └── dto.ts        # Data Transfer Objects (Exportación)
├── lib/
│   ├── exportar-pdf.ts     # Generador desacoplado
│   └── exportar-excel.ts   # Generador desacoplado
└── ui/           # Card base, mini-visualizadores
```

## Listado de Entidades Migradas

### 🟢 Atención y Clínica
- **`paciente`**: Corazón del sistema. Maneja la normalización de nombres, cédulas y datos de tutores. Incluye exportadores avanzados.
- **`sesion`**: Gestiona el historial clínico de intervenciones. Incluye el store `useSesionActiva` para la sesión en progreso.
- **`plan-tratamiento`**: Lógica de objetivos terapéuticos y pasos de intervención.
- **`evaluacion`**: Maneja escalas (MLT, etc.) y puntuaciones históricas.
- **`agenda`**: Estructura de eventos para el calendario.
- **`ciclo`**: Agrupación de sesiones por etapas de rehabilitación.

### 🟢 Operaciones
- **`pago`**: Control financiero de deudas de pacientes, descuentos y métodos de pago.
- **`gasto`**: Egresos operativos categorizados.
- **`institucion`**: Catálogo de centros externos, convenios y contactos institucionales.
- **`inventario`**: Registro de instrumentos musicales y materiales clínicos con su estado y ubicación.

### 🟢 Sistema y Comunidad
- **`usuario`**: Personal del centro, perfiles y datos de contacto.
- **`rol`**: Definición de permisos y jerarquías.
- **`blog`**: Contenido educativo externo.
- **`curso`**: Oferta de formación y lista de inscritos.
- **`recurso`**: Biblioteca digital de partituras, videos y documentos.
- **`marketing`**: Campañas y captación de leads.

## Guía de Extensión

Para añadir una nueva entidad:
1. Crear la carpeta en `entities/`.
2. Definir los tipos en `model/tipos.ts`.
3. Crear el hook de consulta en `api/`.
4. Exportar todo a través del `index.ts` de la carpeta de la entidad.
5. Importar exclusivamente desde `@/entities/<nombre>` en las capas superiores.
