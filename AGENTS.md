<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CBM Frontend

## Package manager
- **Always use `pnpm`** (never npm/yarn). Lockfile: `pnpm-lock.yaml`.

## Commands
| Action | Command |
|--------|---------|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Format | `pnpm format` (Prettier) |
| GraphQL codegen | `pnpm codegen` |

No test framework configured.

## Architecture: Feature-Sliced Design (FSD)
- `entities/` — domain models, GraphQL queries/mutations, Zod schemas, DTOs, PDF/Excel generators
- `features/` — user actions with business logic (filters, forms, session recording)
- `widgets/` — autonomous complex blocks (tables, dashboards, navigation)
- `views/` — page orchestrators (compose widgets + features)
- `app/dashboard/<seccion>/page.tsx` — thin wrappers that import from `@/views/<seccion>`
- `shared/` — UI kit, Apollo client, Zustand stores, permissions, utilities
- **Import rule**: layers import only from below (entities←features←widgets←views, shared from anywhere)

## Routes
- Public: `/login`, `/` (landing page)
- Protected: `/dashboard/*` — auth check in `app/dashboard/layout.tsx` via `CONSULTA_YO` query; redirects to `/login` on failure
- JWT stored in `localStorage` keys: `token`, `refreshToken`

## Path aliases
- `@/*` → project root
- `@/shared/*` → `shared/*`

## GraphQL
- Apollo Client v4, configured in `shared/lib/apollo/`
- `ApolloWrapper` mounted in `config/providers/main-provider.tsx`
- Codegen generates to `shared/api/generated/` (types, hooks, gql fragments)
- Schema expected at `NEXT_PUBLIC_GRAPHQL_URI` (default: `http://localhost:8000/graphql/`)

## State management
- **Server state**: Apollo Cache (GraphQL)
- **UI/global state**: Zustand stores in `shared/model/` (e.g. `useAuthStore`, `useInterfazStore`)
- **Session-in-progress**: Zustand store within `features/sesion-en-progreso/`

## Forms
- `react-hook-form` + `zod` (`@hookform/resolvers/zod`)
- Zod schemas live per entity: `entities/<nombre>/model/esquema.ts`

## Styling
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Animation utilities via `tw-animate-css`
- Dark mode via `next-themes`; requires `suppressHydrationWarning` on `<html>` (see `app/layout.tsx`)

## Key dependencies (non-obvious)
- `motion` instead of `framer-motion`
- `lucide-react` for icons
- `sonner` for toasts
- `recharts` for charts
- `zustand` for state

## Conventions
- Folders: `kebab-case`
- Components: `PascalCase`
- Business logic naming: **Spanish** (e.g. `usePacientes`, `esquemaPaciente`)
- Exports: DTO pattern — PDF/Excel generators accept DTOs (not raw Apollo models) in `entities/*/lib/`

## Codegen reminder
- GraphQL codegen runs against a local backend. Generated files are committed — run `pnpm codegen` after schema or query changes.
- Documents scanned: `entities/**/*.ts`, `shared/api/**/*.ts`, `features/**/*.ts`
