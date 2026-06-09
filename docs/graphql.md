# GraphQL

## Cliente Apollo

Configurado en `shared/lib/apollo/`. El `ApolloWrapper` se monta en `MainProvider`.

### Links activos

| Link | Archivo | Función |
|---|---|---|
| `authLink` | `links/authLink.ts` | Inyecta el token JWT en cada request |
| `errorLink` | `links/errorLink.ts` | Maneja errores globales (401, network) |
| `httpLink` | `links/httpLink.ts` | Conexión HTTP al backend |
| `loggerLink` | `links/loggerLink.ts` | Logs en desarrollo |

### Token manager

`shared/lib/apollo/utils/tokenManager.ts` — maneja almacenamiento y renovación del access token.

## Convenciones de archivos GraphQL

Cada módulo tiene su carpeta `graphql/` con:
- `query.ts` — todas las queries (`GET_*`, `SEARCH_*`)
- `mutacion.ts` — todas las mutaciones (`CREATE_*`, `UPDATE_*`, `DELETE_*`)
- Se re-exportan desde el `index.ts` del módulo

## Operaciones disponibles

### Auth — `modules/auth/graphql/index.ts`

```graphql
mutation TokenAuth($username, $password)   # Login — devuelve token + user
query Me                                    # Usuario autenticado completo
```

### Pacientes — `modules/atencion/pacientes/graphql/`

**Queries:**
```graphql
query GetPatients($status, $search, $page, $pageSize)   # Lista paginada
query SearchPatients($search)                            # Búsqueda rápida (top 10)
query GetPatientGrowth                                   # Datos de crecimiento mensual
query GetPatientDetails($id)                             # Detalle completo + sesiones + notas clínicas
query GetInstitutions                                    # Lista de instituciones
```

**Mutaciones:**
```graphql
mutation CreatePatient(...)              # Crear paciente + tutor + primer ciclo
mutation UpdatePatient($id, ...)         # Actualizar datos básicos
mutation UpdateClinicalNotes(...)        # Guardar notas clínicas por categoría
mutation DeletePatient($id)             # Eliminar paciente
```

## Codegen

El proyecto tiene `@graphql-codegen` configurado en devDependencies pero no tiene archivo de config activo aún. Cuando se configure, los tipos generados irían en `shared/types/generated/`.
