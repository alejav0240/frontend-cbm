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

Cada entidad tiene su carpeta `api/` con:
- `consultas.ts` — todas las queries (`GET_*`, `SEARCH_*`)
- `mutaciones.ts` — todas las mutaciones (`CREATE_*`, `UPDATE_*`, `DELETE_*`)
- Hooks Apollo (`use*`) en archivos propios; se re-exportan desde el `index.ts` de la entidad

## Operaciones disponibles

### Auth — `shared/api/auth.ts` y `shared/lib/apollo/operations/auth.ts`

```graphql
mutation TokenAuth($username, $password)   # Login — devuelve token + user
query Me                                    # Usuario autenticado completo
```

### Pacientes — `entities/paciente/api/`

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

Configurado en `codegen.ts`. Descarga el schema del backend (`NEXT_PUBLIC_GRAPHQL_URI`,
por defecto `http://localhost:8000/graphql/`) y genera los tipos en
`shared/api/generated/` con el preset `client`. Ejecutar con `pnpm codegen` tras cambios de
schema o queries; los archivos generados se commitean. Documentos escaneados:
`entities/**/*.ts`, `shared/api/**/*.ts`, `features/**/*.ts`.
