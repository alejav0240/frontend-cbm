// ─── View ─────────────────────────────────────────────────────────────────────
export { SesionesView } from './page';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useSessions } from './hooks/useSession';
export { useSessionsData } from './hooks/useSessionsData';
export { useSessionsModals } from './hooks/useSessionsModals';

// ─── Types ────────────────────────────────────────────────────────────────────
export type { SesionType, SesionData, filtersData, NormalizedSession, CreateSessionVars, UpdateSessionVars, FilterConfig } from './types/session';

// ─── Schemas ─────────────────────────────────────────────────────────────────
export { sessionSchema } from './schemas/schema';
export type { SessionFormData } from './schemas/schema';

// ─── GraphQL ─────────────────────────────────────────────────────────────────
export { GET_SESSIONS } from './graphql/query';
export { CREATE_SESSION, UPDATE_SESSION, UPDATE_SESSION_PAYMENT, ADD_SESSION_RESOURCE, DELETE_SESSION } from './graphql/mutation';

// ─── Components ───────────────────────────────────────────────────────────────
export { SessionsStats } from './components/SessionsStats';
export { SessionsHeader } from './components/SessionsHeader';
export { SessionsFilters } from './components/SessionsFilters';
export { SessionsTable } from './components/SessionsTable';
export { SessionFormModal } from './components/SessionFormModal';

// ─── Data ─────────────────────────────────────────────────────────────────────
export { sessionsFilters } from './data/data';

// ─── Services ─────────────────────────────────────────────────────────────────
export { generateSessionsListPDF, generateSessionSummaryPDF, generateSessionsExcel } from './services/pdf';
