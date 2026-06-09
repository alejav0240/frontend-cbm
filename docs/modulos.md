# Módulos

## Grupos y sub-módulos

| Grupo | Sub-módulo | `PageType` | Estado |
|---|---|---|---|
| **atencion** | dashboard | `overview` | ✅ |
| | pacientes | `pacientes` | ✅ Completo |
| | agenda | `agenda` | 🔲 Stub |
| | sesiones | `sesiones` | 🔲 Stub |
| | ciclos | `ciclos` | 🔲 Stub |
| | portal-familiar | `portal-familiar` | 🔲 Stub |
| **clinica** | expedientes | `expedientes` | 🔲 Stub |
| | evaluaciones | `evaluaciones` | 🔲 Stub |
| | planes | `planes` | 🔲 Stub |
| | escalas | `escalas` | 🔲 Stub |
| | informes | `informes` | 🔲 Stub |
| **operaciones** | pagos | `pagos` | 🔲 Stub |
| | gastos | `gastos` | 🔲 Stub |
| | inventario | `inventario` | 🔲 Stub |
| | analisis | `analisis` | 🔲 Stub |
| | instituciones | `instituciones` | 🔲 Stub |
| **comunidad** | blog | `blog` | 🔲 Stub |
| | cursos | `cursos` | 🔲 Stub |
| | recursos | `recursos` | 🔲 Stub |
| | marketing | `marketing` | 🔲 Stub |
| **sistema** | usuarios | `users` | 🔲 Stub |
| | roles | `roles` | 🔲 Stub |
| | formularios | `formularios` | 🔲 Stub |
| | ajustes | `ajustes` | 🔲 Stub |

## Módulo Pacientes (referencia)

El módulo más completo del sistema. Sirve como referencia de arquitectura para los demás.

### Archivos

```
modules/atencion/pacientes/
├── page.tsx                        # PacientesView
├── index.ts                        # Barrel completo
├── types/patient.ts                # Patient, NormalizedPatient, GrowthPoint, etc.
├── schemas/schema.ts               # patientSchema, clinicalSchema + tipos
├── graphql/
│   ├── query.ts                    # GET_PATIENTS, GET_GROWTH, GET_PATIENT_DETAILS, GET_INSTITUTIONS, SEARCH_PATIENTS
│   └── mutacion.ts                 # CREATE_PATIENT, UPDATE_PATIENT, UPDATE_CLINICAL_NOTES, DELETE_PATIENT
├── hooks/
│   ├── usePatient.ts               # usePatients(), usePatientDetails()
│   ├── usePatientGrowth.ts         # usePatientGrowth() — query separada
│   ├── usePatientsModals.ts        # Estado de modales
│   └── usePatientsViewData.ts      # Hook orquestador principal
├── components/
│   ├── PatientsStats.tsx           # Gráfica de crecimiento + contador
│   ├── PatientsHeader.tsx          # Título + botones (exportar, nuevo)
│   ├── PatientsFilters.tsx         # Input de búsqueda
│   ├── PatientsList.tsx            # Tabla + paginación
│   ├── PatientsTable.tsx           # Tabla con acciones por fila
│   ├── PatientsModals.tsx          # Contenedor de todos los modales
│   ├── CreatePatientForm.tsx       # Formulario de creación (react-hook-form + zod)
│   └── ClinicalForm.tsx            # Formulario de notas clínicas
└── services/
    └── pdf.ts                      # generatePatientsPDF(), generatePatientsExcel()
```

### Flujo de datos

```
PacientesView
  └── usePatientsViewData
        ├── usePatients(search, page, status)  →  Apollo GET_PATIENTS
        ├── usePatientGrowth()                 →  Apollo GET_GROWTH
        ├── usePatientsModals()                →  estado local de modales
        ├── useDashboardStore                  →  globalSearchTerm, navegación
        └── useAuthStore                       →  user.databaseId para mutaciones
```

### Normalización de paciente

El backend devuelve `status` en inglés (`active`, `inactive`, `discharged`). El hook `usePatientsViewData` normaliza al español antes de pasarlo a los componentes, usando el tipo `NormalizedPatient`.
