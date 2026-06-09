// ─── View ─────────────────────────────────────────────────────────────────────
export { PacientesView } from './page';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { usePatients, usePatientDetails } from './hooks/usePatient';
export { usePatientGrowth } from './hooks/usePatientGrowth';
export { usePatientsViewData } from './hooks/usePatientsViewData';
export { usePatientsModals } from './hooks/usePatientsModals';
export { LOADING_KEYS } from '@/shared/store/loadingStore';

// ─── Types ────────────────────────────────────────────────────────────────────
export type { Patient, NormalizedPatient, PatientsData, GrowthPoint, GrowthResponse } from './types/patient';

// ─── Schemas ─────────────────────────────────────────────────────────────────
export { patientSchema, clinicalSchema } from './schemas/schema';
export type { PatientFormData, ClinicalFormData } from './schemas/schema';

// ─── GraphQL ─────────────────────────────────────────────────────────────────
export { GET_PATIENTS, GET_GROWTH, GET_INSTITUTIONS, GET_PATIENT_DETAILS, SEARCH_PATIENTS } from './graphql/query';
export { CREATE_PATIENT, DELETE_PATIENT, UPDATE_PATIENT, UPDATE_CLINICAL_NOTES } from './graphql/mutacion';

// ─── Components ───────────────────────────────────────────────────────────────
export { PatientsStats } from './components/PatientsStats';
export { PatientsHeader } from './components/PatientsHeader';
export { PatientsFilters } from './components/PatientsFilters';
export { PatientsList } from './components/PatientsList';
export { PatientsModals } from './components/PatientsModals';
export { default as PatientsTable } from './components/PatientsTable';
export { default as CreatePatientForm } from './components/CreatePatientForm';
export { default as ClinicalForm } from './components/ClinicalForm';

// ─── Services ─────────────────────────────────────────────────────────────────
export { generatePatientsPDF, generatePatientsExcel } from './services/pdf';
