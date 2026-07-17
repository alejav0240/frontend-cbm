/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BasicNote = {
  category?: string | null | undefined;
  content?: string | null | undefined;
};

/** An enumeration. */
export type ClinicalPatientClinicalNoteCategoryChoices =
  /** Notas Adicionales */
  | 'ADDITIONAL_NOTES'
  /** Área Cognitiva */
  | 'COGNITIVE_AREA'
  /** Diagnóstico */
  | 'DIAGNOSIS'
  /** Área Emocional */
  | 'EMOTIONAL_AREA'
  /** Objetivo general */
  | 'GENERAL_OBJECTIVE'
  /** Métodos */
  | 'METHODS'
  /** Observación */
  | 'OBSERVATION'
  /** Área Física */
  | 'PHYSICAL_AREA'
  /** Área Social */
  | 'SOCIAL_AREA';

/** An enumeration. */
export type ClinicalPatientStatusChoices =
  /** Activo */
  | 'ACTIVE'
  /** Alta */
  | 'DISCHARGED'
  /** Inactivo */
  | 'INACTIVE'
  /** Pendiente */
  | 'PENDING';

/** An enumeration. */
export type ClinicalPlanStepApproachChoices =
  /** ACUL-E1: ABSORCIÓN */
  | 'ACUL_E1_ABSORCION'
  /** ACUL-E2: RESPUESTA SIN INTENCIÓN */
  | 'ACUL_E2_RESPUESTA_SIN_INTENCION'
  /** ACUL-E3: RESPUESTA INTENCIONADA */
  | 'ACUL_E3_RESPUESTA_INTENCIONADA'
  /** ASI-E6: INTROSPECCIÓN */
  | 'ASI_E6_INTROSPECCION'
  /** ASI-E7: COORDINACIÓN */
  | 'ASI_E7_COORDINACION'
  /** DALCROZE */
  | 'DALCROZE'
  /** GIM */
  | 'GIM'
  /** IMI-E4: SALIENDO DEL EGOCENTRISMO */
  | 'IMI_E4_SALIENDO_DEL_EGOCENTRISMO'
  /** IMI-E5: CAPTANDO EL SENTIDO */
  | 'IMI_E5_CAPTANDO_EL_SENTIDO'
  /** MLT GORDON */
  | 'MLT_GORDON'
  /** MT CONDUCTUAL */
  | 'MT_CONDUCTUAL'
  /** MT CREATIVA */
  | 'MT_CREATIVA'
  /** WILLIEMS */
  | 'WILLIEMS';

/** An enumeration. */
export type ClinicalPlanStepFocusChoices =
  /** AGRESIVIDAD */
  | 'AGRESIVIDAD'
  /** AISLAMIENTO */
  | 'AISLAMIENTO'
  /** ANDAR */
  | 'ANDAR'
  /** APOYO */
  | 'APOYO'
  /** ATENCIÓN */
  | 'ATENCION'
  /** BALBUCEOS */
  | 'BALBUCEOS'
  /** BERRINCHE */
  | 'BERRINCHE'
  /** COMUNICACIÓN VERBAL */
  | 'COMUNICACION_VERBAL'
  /** CONTACTO VISUAL */
  | 'CONTACTO_VISUAL'
  /** CONTRASTES DE INTENSIDAD */
  | 'CONTRASTES_DE_INTENSIDAD'
  /** CONTRASTES DE TEMPO */
  | 'CONTRASTES_DE_TEMPO'
  /** CORRER */
  | 'CORRER'
  /** CREACIÓN VOCAL */
  | 'CREACION_VOCAL'
  /** DANZAR */
  | 'DANZAR'
  /** DESINTERES */
  | 'DESINTERES'
  /** ESTEREOTIPIAS */
  | 'ESTEREOTIPIAS'
  /** GESTICULAR */
  | 'GESTICULAR'
  /** IMITACIÓN */
  | 'IMITACION'
  /** IMITACIÓN DE CANCIONES */
  | 'IMITACION_DE_CANCIONES'
  /** INTERACCIÓN CON EL MUSICOTERAPEUTA */
  | 'INTERACCION_CON_EL_MUSICOTERAPEUTA'
  /** INTERACCIÓN CON INSTRUMENTOS MUSICALES */
  | 'INTERACCION_CON_INSTRUMENTOS_MUSICALES'
  /** INTERACCIÓN CON LOS PADRES */
  | 'INTERACCION_CON_LOS_PADRES'
  /** INTERACCIÓN CON LOS PARES */
  | 'INTERACCION_CON_LOS_PARES'
  /** INTERACCIÓN CON OBJETOS */
  | 'INTERACCION_CON_OBJETOS'
  /** MOVIMIENTO EN SU LUGAR */
  | 'MOVIMIENTO_EN_SU_LUGAR'
  /** MOVIMIENTO SONORO */
  | 'MOVIMIENTO_SONORO'
  /** PARAR */
  | 'PARAR'
  /** PASIVIDAD */
  | 'PASIVIDAD'
  /** PLANOS DE ALTURA */
  | 'PLANOS_DE_ALTURA'
  /** PULSO INTERNO */
  | 'PULSO_INTERNO'
  /** REGULACIÓN TEMPORAL */
  | 'REGULACION_TEMPORAL'
  /** REPETICIÓN DE IDEAS RITMICAS/MELODICAS */
  | 'REPETICION_DE_IDEAS_RITMICAS_MELODICAS'
  /** RESISTENCIA */
  | 'RESISTENCIA'
  /** RITMO REAL */
  | 'RITMO_REAL'
  /** SALTAR */
  | 'SALTAR'
  /** SENSACIÓN DE CONCLUSIÓN */
  | 'SENSACION_DE_CONCLUSION'
  /** SILABAS CANÓNICAS */
  | 'SILABAS_CANONICAS'
  /** SONIDO / SILENCIO */
  | 'SONIDO_SILENCIO'
  /** TIMBRE */
  | 'TIMBRE'
  /** VOCALIZACIONES */
  | 'VOCALIZACIONES';

/** An enumeration. */
export type ClinicalPlanStepMltMethodChoices =
  /** ACUL-E1: ABSORCIÓN */
  | 'ACUL_E1_ABSORCION'
  /** ACUL-E2: RESPUESTA SIN INTENCIÓN */
  | 'ACUL_E2_RESPUESTA_SIN_INTENCION'
  /** ACUL-E3: RESPUESTA INTENCIONADA */
  | 'ACUL_E3_RESPUESTA_INTENCIONADA'
  /** ASI-E6: INTROSPECCIÓN */
  | 'ASI_E6_INTROSPECCION'
  /** ASI-E7: COORDINACIÓN */
  | 'ASI_E7_COORDINACION'
  /** DALCROZE */
  | 'DALCROZE'
  /** GIM */
  | 'GIM'
  /** IMI-E4: SALIENDO DEL EGOCENTRISMO */
  | 'IMI_E4_SALIENDO_DEL_EGOCENTRISMO'
  /** IMI-E5: CAPTANDO EL SENTIDO */
  | 'IMI_E5_CAPTANDO_EL_SENTIDO'
  /** MLT GORDON */
  | 'MLT_GORDON'
  /** MT CONDUCTUAL */
  | 'MT_CONDUCTUAL'
  /** MT CREATIVA */
  | 'MT_CREATIVA'
  /** WILLIEMS */
  | 'WILLIEMS';

/** An enumeration. */
export type ClinicalPlanStepMomentChoices =
  /** ABSTRACCIÓN */
  | 'ABSTRACCION'
  /** ARMÓNICO */
  | 'ARMONICO'
  /** BIENVENIDA */
  | 'BIENVENIDA'
  /** DANZA LIBRE */
  | 'DANZA_LIBRE'
  /** DESPEDIDA */
  | 'DESPEDIDA'
  /** EXPRESIÓN CORPORAL */
  | 'EXPRESION_CORPORAL'
  /** ISO */
  | 'ISO'
  /** MELÓDICO */
  | 'MELODICO'
  /** RELAJACIÓN */
  | 'RELAJACION'
  /** RITMICO */
  | 'RITMICO'
  /** RITMO Y ESPACIO */
  | 'RITMO_Y_ESPACIO';

/** An enumeration. */
export type ClinicalPlanStepObjectiveChoices =
  /** COMPORTAMIENTOS RESTRICTIVOS */
  | 'COMPORTAMIENTOS_RESTRICTIVOS'
  /** EXPLORACIÓN VOCAL */
  | 'EXPLORACION_VOCAL'
  /** INTERACCIÓN SOCIAL COGNITIVA */
  | 'INTERACCION_SOCIAL_COGNITIVA'
  /** MOVIMIENTO CORPORAL CON MÚSICA */
  | 'MOVIMIENTO_CORPORAL_CON_MUSICA'
  /** PERCEPCIÓN EXPLORACIÓN RITMICA */
  | 'PERCEPCION_EXPLORACION_RITMICA'
  /** PERCEPCIÓN EXPLORACIÓN SONORA */
  | 'PERCEPCION_EXPLORACION_SONORA';

/** An enumeration. */
export type EvaluationsFormQuestionQuestionTypeChoices =
  /** Sí / No */
  | 'BOOLEAN'
  /** Fecha */
  | 'DATE'
  /** Opción múltiple */
  | 'MULTIPLE_CHOICE'
  /** Número */
  | 'NUMBER'
  /** Escala */
  | 'SCALE'
  /** Texto corto */
  | 'TEXT'
  /** Texto libre */
  | 'TEXT_LONG';

/** An enumeration. */
export type EvaluationsScaleScaleTypeChoices =
  /** Por subescalas */
  | 'SUBSCALE'
  /** Por lista de valores */
  | 'VALUE_LIST';

/** An enumeration. */
export type FinanceCoursePaymentPaymentMethodChoices =
  /** Efectivo */
  | 'EFECTIVO'
  /** QR */
  | 'QR'
  /** Tarjeta */
  | 'TARJETA'
  /** Transferencia */
  | 'TRANSFERENCIA';

/** An enumeration. */
export type FinanceCoursePaymentPaymentStatusChoices =
  /** Completado */
  | 'COMPLETED'
  /** Pendiente */
  | 'PENDING'
  /** Reembolsado */
  | 'REFUNDED';

/** An enumeration. */
export type FinanceCourseStateChoices =
  /** Activo */
  | 'ACTIVE'
  /** Archivado */
  | 'ARCHIVED'
  /** Borrador */
  | 'DRAFT';

/** An enumeration. */
export type FinanceDiscountTypeChoices =
  /** Monto fijo */
  | 'FIXED'
  /** Porcentaje */
  | 'PERCENTAGE';

/** An enumeration. */
export type FinanceExpenseStatusChoices =
  /** Cancelado */
  | 'CANCELLED'
  /** Pagado */
  | 'PAID'
  /** Pendiente */
  | 'PENDING';

/** An enumeration. */
export type FinancePaymentPaymentMethodChoices =
  /** Efectivo */
  | 'EFECTIVO'
  /** QR */
  | 'QR'
  /** Tarjeta */
  | 'TARJETA'
  /** Transferencia */
  | 'TRANSFERENCIA';

/** An enumeration. */
export type FinancePaymentPaymentStatusChoices =
  /** Completado */
  | 'COMPLETED'
  /** Parcial */
  | 'PARTIAL'
  /** Pendiente */
  | 'PENDING';

/** An enumeration. */
export type MarketingBlogPostStatusChoices =
  /** Borrador */
  | 'DRAFT'
  /** Publicado */
  | 'PUBLISHED';

/** An enumeration. */
export type MarketingLeadStatusChoices =
  /** Contactado */
  | 'CONTACTED'
  /** Perdido */
  | 'LOST'
  /** Nuevo */
  | 'NEW'
  /** Calificado */
  | 'QUALIFIED';

/** An enumeration. */
export type MarketingMarketingCampaignStatusChoices =
  /** Activa */
  | 'ACTIVE'
  /** Borrador */
  | 'DRAFT'
  /** Finalizada */
  | 'FINISHED'
  /** Pausada */
  | 'PAUSED';

export type QuestionInput = {
  isRequired?: boolean | null | undefined;
  orderIndex?: number | null | undefined;
  question: string;
  questionType: string;
};

export type ResponseInput = {
  questionId: string | number;
  responseText: string;
};

export type ResponseSubScale = {
  score: number;
  subscaleId: string | number;
};

export type ScaleValueInput = {
  label: string;
  value: number;
};

export type SubscaleInput = {
  description?: string | null | undefined;
  maxValue: number;
  name: string;
};

/** An enumeration. */
export type TherapeuticSessionsDigitalResourceTypeChoices =
  /** Audio */
  | 'AUDIO'
  /** Documento */
  | 'DOCUMENT'
  /** Imagen */
  | 'IMAGE'
  /** Partitura */
  | 'SHEET_MUSIC'
  /** Video */
  | 'VIDEO'
  /** Enlace web */
  | 'WEB_LINK';

/** An enumeration. */
export type TherapeuticSessionsInventoryItemConditionChoices =
  /** Dañado */
  | 'DAMAGED'
  /** Regular */
  | 'FAIR'
  /** Bueno */
  | 'GOOD';

/** An enumeration. */
export type TherapeuticSessionsInventoryItemStatusChoices =
  /** Disponible */
  | 'AVAILABLE'
  /** En uso */
  | 'IN_USE'
  /** En mantenimiento */
  | 'MAINTENANCE';

/** An enumeration. */
export type TherapeuticSessionsInventoryItemTypeChoices =
  /** Equipo */
  | 'EQUIPMENT'
  /** Instrumento */
  | 'INSTRUMENT'
  /** Material */
  | 'MATERIAL';

/** An enumeration. */
export type TherapeuticSessionsSessionPaymentStatusChoices =
  /** Exenta */
  | 'EXEMPT'
  /** Pagada */
  | 'PAID'
  /** Pendiente */
  | 'PENDING';

/** An enumeration. */
export type TherapeuticSessionsSessionSessionStatusChoices =
  /** Agendada */
  | 'AGENDADA'
  /** Cancelada */
  | 'CANCELADA'
  /** Completa */
  | 'COMPLETA'
  /** Confirma */
  | 'CONFIRMA'
  /** Reprograma */
  | 'REPROGRAMA';

/** An enumeration. */
export type TherapeuticSessionsSessionSessionTypeChoices =
  /** Grupal */
  | 'GROUP'
  /** Individual */
  | 'INDIVIDUAL';

export type ObtenerPostsBlogQueryVariables = Exact<{
  status?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerPostsBlogQuery = { blogPosts: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, updatedAt: unknown, titulo: string, resumen: string | null, contenido: string, categoria: string, autor: string, urlImagen: string | null, tiempoLectura: string | null, estado: MarketingBlogPostStatusChoices, fechaCreacion: unknown } | null> | null } | null };

export type CreateBlogPostMutationVariables = Exact<{
  title: string;
  content: string;
  category: string;
  author: string;
  excerpt?: string | null | undefined;
  imageUrl?: string | null | undefined;
  readTime?: string | null | undefined;
  status?: string | null | undefined;
}>;


export type CreateBlogPostMutation = { createBlogPost: { post: { id: string, title: string } | null } | null };

export type UpdateBlogPostMutationVariables = Exact<{
  id: string | number;
  title?: string | null | undefined;
  content?: string | null | undefined;
  category?: string | null | undefined;
  author?: string | null | undefined;
  excerpt?: string | null | undefined;
  imageUrl?: string | null | undefined;
  readTime?: string | null | undefined;
  status?: string | null | undefined;
}>;


export type UpdateBlogPostMutation = { updateBlogPost: { post: { id: string, title: string } | null } | null };

export type DeleteBlogPostMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteBlogPostMutation = { deleteBlogPost: { success: boolean | null } | null };

export type ObtenerCursosQueryVariables = Exact<{
  state?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerCursosQuery = { courses: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, nombre: string, descripcion: string | null, precio: unknown, estado: FinanceCourseStateChoices, conteoEstudiantes: number | null, ingresosTotales: number | null } | null> | null } | null };

export type ObtenerCursoQueryVariables = Exact<{
  id: string | number;
}>;


export type ObtenerCursoQuery = { course: { id: string, name: string, description: string | null, price: unknown, state: FinanceCourseStateChoices, studentsCount: number | null, totalIncome: number | null, enrollments: Array<{ id: string, fullName: string, carnet: string | null, enrolledAt: unknown }> } | null };

export type ObtenerInscripcionesCursoQueryVariables = Exact<{
  courseId?: string | number | null | undefined;
}>;


export type ObtenerInscripcionesCursoQuery = { courseEnrollments: { results: Array<{ id: string, carnet: string | null, nombreCompleto: string, fechaInscripcion: unknown, pago: { id: string, monto: unknown, metodoPago: FinanceCoursePaymentPaymentMethodChoices, estadoPago: FinanceCoursePaymentPaymentStatusChoices } | null } | null> | null } | null };

export type CreateCourseMutationVariables = Exact<{
  name: string;
  price: number;
  description?: string | null | undefined;
  state?: string | null | undefined;
}>;


export type CreateCourseMutation = { createCourse: { course: { id: string } | null } | null };

export type UpdateCourseMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
  price?: number | null | undefined;
  description?: string | null | undefined;
  state?: string | null | undefined;
}>;


export type UpdateCourseMutation = { updateCourse: { course: { id: string } | null } | null };

export type DeleteCourseMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCourseMutation = { deleteCourse: { success: boolean | null } | null };

export type EnrollInCourseMutationVariables = Exact<{
  courseId: string | number;
  fullName: string;
  paymentMethod: string;
  amount: number;
  carnet?: string | null | undefined;
}>;


export type EnrollInCourseMutation = { enrollInCourse: { enrollment: { id: string } | null } | null };

export type ObtenerEscalasQueryVariables = Exact<{ [key: string]: never; }>;


export type ObtenerEscalasQuery = { scales: { results: Array<{ id: string, nombre: string, descripcion: string | null, tipoEscala: EvaluationsScaleScaleTypeChoices, subescalas: Array<{ id: string, nombre: string, valorMaximo: number }>, valores: Array<{ id: string, etiqueta: string, valor: number }> } | null> | null } | null };

export type ObtenerEvaluacionesQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  scaleId?: string | number | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerEvaluacionesQuery = { scaleEvaluations: { currentPage: number | null, totalCount: number | null, totalPages: number | null, results: Array<{ id: string, fechaEvaluacion: unknown, puntajeTotal: number | null, paciente: { id: string, fullName: string | null }, escala: { id: string, nombre: string }, respuestasSubescala: Array<{ id: string, puntaje: number, subescala: { id: string, nombre: string } }> } | null> | null } | null };

export type AddScaleResponseMutationVariables = Exact<{
  patientId: string | number;
  evaluatorId: string | number;
  scaleId: string | number;
  sessionId?: string | number | null | undefined;
  subscales?: Array<ResponseSubScale | null | undefined> | ResponseSubScale | null | undefined;
  valueId?: string | number | null | undefined;
}>;


export type AddScaleResponseMutation = { addScaleResponse: { success: boolean | null, message: string | null } | null };

export type DeleteScaleMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteScaleMutation = { deleteScale: { success: boolean | null } | null };

export type CreateScaleMutationVariables = Exact<{
  name: string;
  scaleType: string;
  description?: string | null | undefined;
  subscales?: Array<SubscaleInput | null | undefined> | SubscaleInput | null | undefined;
  values?: Array<ScaleValueInput | null | undefined> | ScaleValueInput | null | undefined;
}>;


export type CreateScaleMutation = { createScale: { scale: { id: string, name: string, scaleType: EvaluationsScaleScaleTypeChoices } | null } | null };

export type ObtenerInformesQueryVariables = Exact<{
  patientId: string | number;
}>;


export type ObtenerInformesQuery = { therapyReports: Array<{ id: string, createdAt: unknown, reportUrl: string, patient: { fullName: string | null }, generatedBy: { fullName: string | null } } | null> | null };

export type ObtenerAsignacionesFormularioQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
}>;


export type ObtenerAsignacionesFormularioQuery = { formAssignments: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, createdAt: unknown, form: { id: string, name: string, description: string | null, questions: Array<{ id: string, question: string, questionType: EvaluationsFormQuestionQuestionTypeChoices, isRequired: boolean, orderIndex: number }> }, assignedTo: { id: string, fullName: string | null } | null, assignedBy: { id: string, fullName: string | null }, patient: { id: string, fullName: string | null } | null, responses: Array<{ id: string, response: string, respondedAt: unknown, question: { id: string, question: string } }> } | null> | null } | null };

export type ObtenerFormulariosQueryVariables = Exact<{
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerFormulariosQuery = { forms: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, name: string, description: string | null, questions: Array<{ id: string, question: string, questionType: EvaluationsFormQuestionQuestionTypeChoices, isRequired: boolean, orderIndex: number }> } | null> | null } | null };

export type ObtenerFormularioQueryVariables = Exact<{
  id: string | number;
}>;


export type ObtenerFormularioQuery = { form: { description: string | null, id: string, name: string, questions: Array<{ isRequired: boolean, orderIndex: number, question: string, questionType: EvaluationsFormQuestionQuestionTypeChoices, id: string }> } | null };

export type ObtenerRespuestasFormularioQueryVariables = Exact<{
  assignedToId?: string | number | null | undefined;
  formId?: string | number | null | undefined;
  patientId?: string | number | null | undefined;
}>;


export type ObtenerRespuestasFormularioQuery = { formAssignments: { results: Array<{ id: string, responses: Array<{ response: string, question: { question: string } }> } | null> | null } | null };

export type SubmitFullFormMutationVariables = Exact<{
  assignmentId: string | number;
  responses: Array<ResponseInput> | ResponseInput;
}>;


export type SubmitFullFormMutation = { submitFullForm: { success: boolean | null, assignment: { id: string } | null } | null };

export type CreateFormMutationVariables = Exact<{
  name: string;
  description?: string | null | undefined;
  questions: Array<QuestionInput | null | undefined> | QuestionInput;
}>;


export type CreateFormMutation = { createForm: { form: { id: string, name: string } | null } | null };

export type DeleteFormMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteFormMutation = { deleteForm: { success: boolean | null } | null };

export type MyMutationMutationVariables = Exact<{
  assignedById: string | number;
  formId: string | number;
  assignedToId?: string | number | null | undefined;
  patientId?: string | number | null | undefined;
  sessionId?: string | number | null | undefined;
}>;


export type MyMutationMutation = { assignForm: { assignment: { id: string } | null } | null };

export type ObtenerGastosQueryVariables = Exact<{
  status?: string | null | undefined;
  category?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerGastosQuery = { expenses: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, descripcion: string, categoria: string, monto: unknown, fechaGasto: unknown, estado: FinanceExpenseStatusChoices } | null> | null } | null };

export type CrearGastoMutationVariables = Exact<{
  description: string;
  category: string;
  amount: number;
  expenseDate: unknown;
}>;


export type CrearGastoMutation = { createExpense: { expense: { id: string } | null } | null };

export type ActualizarEstadoGastoMutationVariables = Exact<{
  id: string | number;
  status: string;
}>;


export type ActualizarEstadoGastoMutation = { updateExpenseStatus: { expense: { id: string, status: FinanceExpenseStatusChoices } | null } | null };

export type EliminarGastoMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarGastoMutation = { deleteExpense: { success: boolean | null } | null };

export type GetTherapyReportsQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
}>;


export type GetTherapyReportsQuery = { therapyReports: Array<{ id: string, reportUrl: string, createdAt: unknown, patient: { id: string, fullName: string | null }, generatedBy: { id: string, fullName: string | null } } | null> | null };

export type CreateTherapyReportMutationVariables = Exact<{
  patientId: string | number;
  generatedById: string | number;
  reportUrl: string;
}>;


export type CreateTherapyReportMutation = { createTherapyReport: { report: { id: string } | null } | null };

export type DeleteTherapyReportMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTherapyReportMutation = { deleteTherapyReport: { success: boolean | null } | null };

export type ObtenerInstitucionesQueryVariables = Exact<{
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerInstitucionesQuery = { institutions: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, nombre: string, direccion: string | null, nombreContacto: string, emailContacto: string | null, telefonoContacto: string | null, grupos: Array<{ id: string, nombre: string } | null> | null } | null> | null } | null };

export type ObtenerDetalleInstitucionQueryVariables = Exact<{
  id: string | number;
}>;


export type ObtenerDetalleInstitucionQuery = { institution: { id: string, nombre: string, direccion: string | null, nombreContacto: string, emailContacto: string | null, telefonoContacto: string | null, grupos: Array<{ id: string, nombre: string, descripcion: string | null } | null> | null } | null };

export type GetGroupDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type GetGroupDetailQuery = { institutionGroup: { id: string, name: string, description: string | null, therapeuticSessions: Array<{ id: string, sessionNumber: number, sessionDate: unknown, sessionStatus: TherapeuticSessionsSessionSessionStatusChoices, paymentStatus: TherapeuticSessionsSessionPaymentStatusChoices, durationMinutes: number | null, notes: string | null, therapist: { fullName: string | null } } | null> | null } | null };

export type CrearInstitucionMutationVariables = Exact<{
  name: string;
  contactEmail: string;
  phone: string;
}>;


export type CrearInstitucionMutation = { createInstitution: { institution: { id: string, name: string } | null } | null };

export type EliminarInstitucionMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarInstitucionMutation = { deleteInstitution: { success: boolean | null } | null };

export type CrearGrupoMutationVariables = Exact<{
  institutionId: string | number;
  name: string;
}>;


export type CrearGrupoMutation = { createInstitutionGroup: { group: { name: string } | null } | null };

export type EliminarGrupoMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarGrupoMutation = { deleteInstitutionGroup: { success: boolean | null } | null };

export type ActualizarInstitucionMutationVariables = Exact<{
  contactEmail?: string | null | undefined;
  id1: string | number;
  name?: string | null | undefined;
  phone?: string | null | undefined;
}>;


export type ActualizarInstitucionMutation = { updateInstitution: { institution: { name: string } | null } | null };

export type ActualizarGrupoMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
}>;


export type ActualizarGrupoMutation = { updateInstitutionGroup: { group: { name: string } | null } | null };

export type ObtenerArticulosInventarioQueryVariables = Exact<{
  status?: string | null | undefined;
  type?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerArticulosInventarioQuery = { inventoryItems: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, nombre: string, tipo: TherapeuticSessionsInventoryItemTypeChoices, condicion: TherapeuticSessionsInventoryItemConditionChoices, estado: TherapeuticSessionsInventoryItemStatusChoices, aula: string, estadoMostrado: string | null } | null> | null } | null };

export type BulkAddSessionInventoryItemsMutationVariables = Exact<{
  itemIds: Array<string | number> | string | number;
  sessionId: string | number;
}>;


export type BulkAddSessionInventoryItemsMutation = { bulkAddSessionInventoryItems: { __typename: 'BulkAddSessionInventoryItems', addedCount: number | null } | null };

export type CreateInventoryItemMutationVariables = Exact<{
  name: string;
  type: string;
  condition: string;
  room: string;
  status?: string | null | undefined;
}>;


export type CreateInventoryItemMutation = { createInventoryItem: { item: { id: string, name: string } | null } | null };

export type UpdateInventoryItemMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
  type?: string | null | undefined;
  condition?: string | null | undefined;
  room?: string | null | undefined;
  status?: string | null | undefined;
}>;


export type UpdateInventoryItemMutation = { updateInventoryItem: { item: { id: string, name: string } | null } | null };

export type DeleteInventoryItemMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteInventoryItemMutation = { deleteInventoryItem: { success: boolean | null } | null };

export type ObtenerCampanasMarketingQueryVariables = Exact<{
  status?: string | null | undefined;
  platform?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerCampanasMarketingQuery = { marketingCampaigns: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, nombre: string, plataforma: string, estado: MarketingMarketingCampaignStatusChoices, presupuesto: unknown, gastado: unknown, presupuestoRestante: number | null, leads: Array<{ id: string }> } | null> | null } | null };

export type ObtenerLeadsQueryVariables = Exact<{
  campaignId?: string | number | null | undefined;
  status?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerLeadsQuery = { leads: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, email: string | null, nombre: string, telefono: string | null, estado: MarketingLeadStatusChoices, fechaCreacion: unknown, campana: { id: string, nombre: string } | null } | null> | null } | null };

export type CreateCampaignMutationVariables = Exact<{
  name: string;
  platform: string;
  budget: number;
  status?: string | null | undefined;
}>;


export type CreateCampaignMutation = { createCampaign: { campaign: { id: string } | null } | null };

export type UpdateCampaignMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
  platform?: string | null | undefined;
  budget?: number | null | undefined;
  status?: string | null | undefined;
}>;


export type UpdateCampaignMutation = { updateCampaign: { campaign: { id: string } | null } | null };

export type DeleteCampaignMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCampaignMutation = { deleteCampaign: { success: boolean | null } | null };

export type CreateLeadMutationVariables = Exact<{
  name: string;
  phone?: string | null | undefined;
  email?: string | null | undefined;
  campaignId?: string | number | null | undefined;
}>;


export type CreateLeadMutation = { createLead: { lead: { id: string } | null } | null };

export type UpdateLeadStatusMutationVariables = Exact<{
  id: string | number;
  status: string;
}>;


export type UpdateLeadStatusMutation = { updateLeadStatus: { lead: { id: string, status: MarketingLeadStatusChoices } | null } | null };

export type DeleteLeadMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteLeadMutation = { deleteLead: { success: boolean | null } | null };

export type ObtenerPacientesQueryVariables = Exact<{
  status?: string | null | undefined;
  search?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerPacientesQuery = { patients: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, databaseId: number | null, fullName: string | null, firstName: string, ci: string | null, status: ClinicalPatientStatusChoices, registrationComplete: boolean, diagnosis: string, birthDate: unknown, createdAt: unknown, imageUrl: string | null, residence: string | null, tutor: { id: string, firstName: string, celular: string, email: string | null } | null } | null> | null } | null };

export type BuscarPacientesQueryVariables = Exact<{
  search?: string | null | undefined;
}>;


export type BuscarPacientesQuery = { patients: { results: Array<{ id: string, fullName: string | null } | null> | null } | null };

export type ObtenerCrecimientoPacientesQueryVariables = Exact<{ [key: string]: never; }>;


export type ObtenerCrecimientoPacientesQuery = { patientGrowth: Array<{ month: string | null, total: number | null } | null> | null };

export type ObtenerDetallesPacienteQueryVariables = Exact<{
  id: string | number;
}>;


export type ObtenerDetallesPacienteQuery = { patient: { id: string, databaseId: number | null, fullName: string | null, ci: string | null, birthDate: unknown, imageUrl: string | null, notes: string | null, status: ClinicalPatientStatusChoices, registrationComplete: boolean, diagnosis: string, createdAt: unknown, residence: string | null, tutor: { id: string, fullName: string | null, celular: string } | null, clinicalNotes: Array<{ id: string, category: ClinicalPatientClinicalNoteCategoryChoices, content: string, createdAt: unknown }>, therapeuticSessions: { edges: Array<{ node: { id: string, videoUrl: string | null, notes: string | null, numeroSesion: number, fechaSesion: unknown, estadoSesion: TherapeuticSessionsSessionSessionStatusChoices, estadoPagoMostrado: string | null, terapeuta: { fullName: string | null } } | null } | null> } } | null };

export type EscaleEriQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  scaleId?: string | number | null | undefined;
}>;


export type EscaleEriQuery = { scaleEvaluations: { results: Array<{ evaluatedAt: unknown, totalScore: number | null, inSession: boolean | null, id: string } | null> | null } | null };

export type EscalaDemucaQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  scaleId?: string | number | null | undefined;
}>;


export type EscalaDemucaQuery = { scaleEvaluations: { results: Array<{ id: string, inSession: boolean | null, subscaleResponses: Array<{ id: string, score: number, subscale: { name: string, category: string | null } }> } | null> | null } | null };

export type UserWithPatientsQueryVariables = Exact<{
  id: string | number;
}>;


export type UserWithPatientsQuery = { userWithPatients: { patientsCount: number | null, user: { fullName: string | null, email: string | null, role: { name: string } | null } | null, patients: Array<{ fullName: string | null, diagnosis: string | null, status: string | null, relation: string | null } | null> | null } | null };

export type CrearPacienteMutationVariables = Exact<{
  authorId: string | number;
  firstName: string;
  lastName: string;
  birthDate?: unknown;
  ci?: string | null | undefined;
  imageUrl?: string | null | undefined;
  diagnosis?: string | null | undefined;
  notes?: string | null | undefined;
  residence?: string | null | undefined;
  tutorCelular?: string | null | undefined;
  tutorCi?: string | null | undefined;
  tutorEmail?: string | null | undefined;
  tutorName?: string | null | undefined;
  selectedDay?: string | null | undefined;
  selectedTime?: string | null | undefined;
}>;


export type CrearPacienteMutation = { createPatient: { patient: { id: string, fullName: string | null, databaseId: number | null } | null } | null };

export type ActualizarPacienteMutationVariables = Exact<{
  id: string | number;
  imageUrl?: string | null | undefined;
  residence?: string | null | undefined;
  diagnosis?: string | null | undefined;
  registrationComplete?: boolean | null | undefined;
}>;


export type ActualizarPacienteMutation = { updatePatient: { patient: { id: string, registrationComplete: boolean, status: ClinicalPatientStatusChoices } | null } | null };

export type EliminarPacienteMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarPacienteMutation = { deletePatient: { success: boolean | null, message: string | null } | null };

export type UpdateClinicalNotesMutationVariables = Exact<{
  patientId: string | number;
  authorId: string | number;
  notes: Array<BasicNote | null | undefined> | BasicNote;
}>;


export type UpdateClinicalNotesMutation = { updateClinicalNotes: { notesUpdated: Array<{ id: string, category: ClinicalPatientClinicalNoteCategoryChoices, content: string } | null> | null } | null };

export type ObtenerPagosQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  paymentStatus?: string | null | undefined;
  search?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerPagosQuery = { payments: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, cantidadSesiones: number, precioPorSesion: unknown, montoPagado: unknown, montoTotal: number | null, deuda: number | null, metodoPago: FinancePaymentPaymentMethodChoices, fechaPago: unknown, estadoPago: FinancePaymentPaymentStatusChoices, paciente: { id: string, fullName: string | null }, descuento: { id: string, nombre: string, valor: unknown, tipo: FinanceDiscountTypeChoices } | null } | null> | null } | null };

export type ObtenerDescuentosQueryVariables = Exact<{ [key: string]: never; }>;


export type ObtenerDescuentosQuery = { discounts: Array<{ id: string, nombre: string, valor: unknown, tipo: FinanceDiscountTypeChoices, descripcion: string | null } | null> | null };

export type CrearPagoMutationVariables = Exact<{
  patientId: string | number;
  sessionsCount: number;
  pricePerSession: number;
  amountPaid: number;
  paymentMethod: string;
  discountId?: string | number | null | undefined;
}>;


export type CrearPagoMutation = { createPayment: { payment: { id: string } | null } | null };

export type ActualizarPagoMutationVariables = Exact<{
  id: string | number;
  amountPaid?: number | null | undefined;
  paymentStatus?: string | null | undefined;
}>;


export type ActualizarPagoMutation = { updatePayment: { payment: { id: string, amountPaid: unknown, paymentStatus: FinancePaymentPaymentStatusChoices } | null } | null };

export type EliminarPagoMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarPagoMutation = { deletePayment: { success: boolean | null } | null };

export type CrearDescuentoMutationVariables = Exact<{
  description?: string | null | undefined;
  name: string;
  type: string;
  value: number;
}>;


export type CrearDescuentoMutation = { createDiscount: { discount: { name: string } | null } | null };

export type EliminarDescuentoMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarDescuentoMutation = { deleteDiscount: { success: boolean | null, message: string | null } | null };

export type ObtenerPlanesIntervencionQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  search?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerPlanesIntervencionQuery = { interventionPlans: { __typename: 'PaginatedInterventionPlans', totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ __typename: 'InterventionPlanType', id: string, objetivoPrincipal: string, fechaInicio: unknown, fechaFin: unknown, porcentajeProgreso: number, estado: string | null, paciente: { __typename: 'PatientType', id: string, fullName: string | null }, pasos: Array<{ __typename: 'PlanStepType', id: string, momento: ClinicalPlanStepMomentChoices, duracionMinutos: number | null, objetivo: ClinicalPlanStepObjectiveChoices, enfoque: ClinicalPlanStepFocusChoices | null, recursosMusicales: string | null, enfasisMusical: string | null, abordaje: ClinicalPlanStepApproachChoices | null, metodoMlt: ClinicalPlanStepMltMethodChoices | null, indiceOrden: number }> } | null> | null } | null };

export type BulkAddStepsToSessionMutationVariables = Exact<{
  planStepIds: Array<string | number> | string | number;
  sessionId: string | number;
}>;


export type BulkAddStepsToSessionMutation = { bulkAddStepsToSession: { addedCount: number | null } | null };

export type CreateInterventionPlanMutationVariables = Exact<{
  patientId: string | number;
  createdById: string | number;
  mainObjective: string;
  startDate?: unknown;
  endDate?: unknown;
}>;


export type CreateInterventionPlanMutation = { createInterventionPlan: { plan: { id: string } | null } | null };

export type UpdateInterventionPlanMutationVariables = Exact<{
  id: string | number;
  mainObjective?: string | null | undefined;
  startDate?: unknown;
  endDate?: unknown;
}>;


export type UpdateInterventionPlanMutation = { updateInterventionPlan: { plan: { id: string } | null } | null };

export type DeleteInterventionPlanMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteInterventionPlanMutation = { deleteInterventionPlan: { success: boolean | null } | null };

export type CreateStepPlanMutationVariables = Exact<{
  planId: string | number;
  moment: string;
  objective: string;
  durationMinutes?: number | null | undefined;
  focus?: string | null | undefined;
  musicalResources?: string | null | undefined;
  musicalEmphasis?: string | null | undefined;
  approach?: string | null | undefined;
  mltMethod?: string | null | undefined;
}>;


export type CreateStepPlanMutation = { createStepPlan: { step: { id: string } | null } | null };

export type UpdateStepPlanMutationVariables = Exact<{
  id: string | number;
  moment?: string | null | undefined;
  objective?: string | null | undefined;
  durationMinutes?: number | null | undefined;
  focus?: string | null | undefined;
  musicalResources?: string | null | undefined;
  musicalEmphasis?: string | null | undefined;
  approach?: string | null | undefined;
  mltMethod?: string | null | undefined;
}>;


export type UpdateStepPlanMutation = { updateStepPlan: { step: { id: string } | null } | null };

export type DeleteStepPlanMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteStepPlanMutation = { deleteStepPlan: { success: boolean | null } | null };

export type ObtenerRecursosDigitalesQueryVariables = Exact<{
  type?: string | null | undefined;
  search?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerRecursosDigitalesQuery = { digitalResources: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, url: string, titulo: string, tipo: TherapeuticSessionsDigitalResourceTypeChoices, categoria: string | null, tipoMostrado: string | null } | null> | null } | null };

export type BulkAddSessionResourcesMutationVariables = Exact<{
  resourceIds: Array<string | number> | string | number;
  sessionId: string | number;
}>;


export type BulkAddSessionResourcesMutation = { bulkAddSessionResources: { __typename: 'BulkAddSessionResources', addedCount: number | null } | null };

export type CreateDigitalResourceMutationVariables = Exact<{
  title: string;
  type: string;
  url: string;
  category?: string | null | undefined;
}>;


export type CreateDigitalResourceMutation = { createDigitalResource: { resource: { id: string, title: string } | null } | null };

export type UpdateDigitalResourceMutationVariables = Exact<{
  id: string | number;
  title?: string | null | undefined;
  type?: string | null | undefined;
  url?: string | null | undefined;
  category?: string | null | undefined;
}>;


export type UpdateDigitalResourceMutation = { updateDigitalResource: { resource: { id: string, title: string } | null } | null };

export type DeleteDigitalResourceMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteDigitalResourceMutation = { deleteDigitalResource: { success: boolean | null } | null };

export type ObtenerRolesQueryVariables = Exact<{
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerRolesQuery = { roles: { totalCount: number | null, totalPages: number | null, currentPage: number | null, results: Array<{ id: string, nombre: string, permisos: Array<string | null> | null, conteoUsuarios: number | null } | null> | null } | null };

export type CreateRoleMutationVariables = Exact<{
  name: string;
  permissions?: Array<string | null | undefined> | string | null | undefined;
}>;


export type CreateRoleMutation = { createRole: { role: { id: string, name: string, permissions: Array<string | null> | null } | null } | null };

export type UpdateRoleMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
  permissions?: Array<string | null | undefined> | string | null | undefined;
}>;


export type UpdateRoleMutation = { updateRole: { role: { id: string, name: string, permissions: Array<string | null> | null } | null } | null };

export type DeleteRoleMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteRoleMutation = { deleteRole: { success: boolean | null } | null };

export type ObtenerSesionesQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  paymentStatus?: string | null | undefined;
  sessionType?: string | null | undefined;
  sessionStatus?: string | null | undefined;
  therapistId?: string | number | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  byCycles?: boolean | null | undefined;
  search?: string | null | undefined;
}>;


export type ObtenerSesionesQuery = { sessions: { byCycles: boolean | null, currentPage: number | null, totalCount: number | null, totalPages: number | null, sessions: Array<{ __typename: 'SessionType', id: string, videoUrl: string | null, fechaCreacion: unknown, duracionMinutos: number | null, numeroCiclo: number | null, notas: string | null, estadoPagoMostrado: string | null, estadoPago: TherapeuticSessionsSessionPaymentStatusChoices, fechaSesion: unknown, numeroSesion: number, estadoSesion: TherapeuticSessionsSessionSessionStatusChoices, tipoSesion: TherapeuticSessionsSessionSessionTypeChoices, tipoSesionMostrado: string | null, grupo: { __typename: 'InstitutionGroupType', id: string, descripcion: string | null, nombre: string, institucion: { __typename: 'InstitutionType', nombre: string } } | null, paciente: { __typename: 'PatientType', id: string, fullName: string | null } | null, terapeuta: { __typename: 'UserType', id: string, fullName: string | null } } | null> | null } | null };

export type ObtenerCiclosQueryVariables = Exact<{
  patientId?: string | number | null | undefined;
  paymentStatus?: string | null | undefined;
  sessionStatus?: string | null | undefined;
  sessionType?: string | null | undefined;
  therapistId?: string | number | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type ObtenerCiclosQuery = { sessions: { __typename: 'PaginatedSessions', currentPage: number | null, totalCount: number | null, totalPages: number | null, byCycles: boolean | null, cycles: Array<{ __typename: 'CycleType', patientId: string | null, patientName: string | null, cycleNumber: number | null, completedCount: number | null, firstSessionDate: unknown, id: string | null, lastSessionDate: unknown, sessionCount: number | null, status: string | null, patient: { __typename: 'PatientType', id: string, fullName: string | null, tutor: { __typename: 'UserType', celular: string } | null } | null, paymentSummary: { __typename: 'CyclePaymentSummaryType', exempt: number | null, paid: number | null, pending: number | null } | null, therapists: Array<{ __typename: 'UserType', id: string, fullName: string | null } | null> | null, sessions: Array<{ __typename: 'SessionType', durationMinutes: number | null, databaseId: number | null, cycleNumber: number | null, createdAt: unknown, notes: string | null, videoUrl: string | null, sessionTypeDisplay: string | null, paymentStatusDisplay: string | null, sessionDate: unknown, sessionNumber: number, sessionStatus: TherapeuticSessionsSessionSessionStatusChoices, sessionResources: Array<{ __typename: 'SessionResourceType', resource: { __typename: 'DigitalResourceType', id: string, title: string, type: TherapeuticSessionsDigitalResourceTypeChoices, url: string } }>, sessionInventory: Array<{ id: string, item: { name: string } }>, scaleEvaluations: Array<{ __typename: 'ScaleEvaluationType', id: string, evaluatedAt: unknown, totalScore: number | null, scale: { __typename: 'ScaleType', id: string, name: string, scaleType: EvaluationsScaleScaleTypeChoices }, subscaleResponses: Array<{ __typename: 'ScaleEvaluationSubscaleResponseType', score: number, subscale: { __typename: 'SubscaleType', name: string } }>, valueResponses: Array<{ __typename: 'ScaleEvaluationValueResponseType', scaleValue: { __typename: 'ScaleValueType', label: string, value: number } }> }> } | null> | null } | null> | null } | null };

export type ObtenerCiclosPacientesQueryVariables = Exact<{
  pageSize?: number | null | undefined;
  page?: number | null | undefined;
  search?: string | null | undefined;
  therapistId?: string | number | null | undefined;
}>;


export type ObtenerCiclosPacientesQuery = { patientsLastCycle: { currentPage: number | null, totalCount: number | null, totalPages: number | null, results: Array<{ patientName: string | null, cycleNumber: number | null, status: string | null, sessionCount: number | null, completedCount: number | null, patient: { id: string } | null, paymentSummary: { paid: number | null, pending: number | null, exempt: number | null } | null, sessions: Array<{ id: string, sessionDate: unknown, sessionStatus: TherapeuticSessionsSessionSessionStatusChoices } | null> | null } | null> | null } | null };

export type VerSesionQueryVariables = Exact<{
  id: string | number;
}>;


export type VerSesionQuery = { session: { createdAt: unknown, cycleNumber: number | null, databaseId: number | null, durationMinutes: number | null, sessionDate: unknown, notes: string | null, sessionNumber: number, sessionResources: Array<{ resource: { title: string } }>, formAssignments: Array<{ completionRatio: string | null, createdAt: unknown, responses: Array<{ response: string, question: { question: string } }> } | null> | null, scaleEvaluations: Array<{ totalScore: number | null, evaluatedAt: unknown, id: string, inSession: boolean | null, subscaleResponses: Array<{ score: number, subscale: { id: string, maxValue: number } }>, valueResponses: Array<{ id: string, scaleValue: { label: string, value: number } }> }>, sessionInventory: Array<{ item: { name: string, room: string } }>, sessionPlanSteps: Array<{ actualDuration: number | null, createdAt: unknown, id: string, isCompleted: boolean, planStep: { approach: ClinicalPlanStepApproachChoices | null, durationMinutes: number | null, focus: ClinicalPlanStepFocusChoices | null, id: string, mltMethod: ClinicalPlanStepMltMethodChoices | null, moment: ClinicalPlanStepMomentChoices, musicalEmphasis: string | null, musicalResources: string | null, objective: ClinicalPlanStepObjectiveChoices, orderIndex: number } }> } | null };

export type CrearSesionMutationVariables = Exact<{
  patientId?: string | number | null | undefined;
  therapistId: string | number;
  sessionDate: unknown;
  sessionType: string;
  durationMinutes?: number | null | undefined;
  notes?: string | null | undefined;
  groupId?: string | number | null | undefined;
  videoUrl?: string | null | undefined;
}>;


export type CrearSesionMutation = { createSession: { session: { id: string, sessionNumber: number } | null } | null };

export type ActualizarSesionMutationVariables = Exact<{
  id: string | number;
  therapistId?: string | number | null | undefined;
  sessionDate?: unknown;
  sessionType?: string | null | undefined;
  durationMinutes?: number | null | undefined;
  notes?: string | null | undefined;
  videoUrl?: string | null | undefined;
  sessionStatus?: string | null | undefined;
}>;


export type ActualizarSesionMutation = { updateSession: { session: { id: string, sessionStatus: TherapeuticSessionsSessionSessionStatusChoices, sessionDate: unknown, notes: string | null, durationMinutes: number | null, videoUrl: string | null } | null } | null };

export type CreateCycleMutationVariables = Exact<{
  patientId: string | number;
  therapistId: string | number;
  startDate: unknown;
  numSessions?: number | null | undefined;
}>;


export type CreateCycleMutation = { createCycle: { success: boolean | null, message: string | null } | null };

export type EliminarSesionMutationVariables = Exact<{
  id: string | number;
}>;


export type EliminarSesionMutation = { deleteSession: { success: boolean | null, message: string | null } | null };

export type ObtenerUsuariosQueryVariables = Exact<{
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  search?: string | null | undefined;
  roleName?: string | null | undefined;
  excludeRole?: string | null | undefined;
}>;


export type ObtenerUsuariosQuery = { users: { currentPage: number | null, totalPages: number | null, totalCount: number | null, results: Array<{ id: string, username: string, email: string | null, fullName: string | null, isStaff: boolean, isActive: boolean, celular: string, status: string, foto: string | null, ci: string, rol: { id: string, nombre: string } | null } | null> | null } | null };

export type BuscarTerapeutasQueryVariables = Exact<{
  search?: string | null | undefined;
  pageSize?: number | null | undefined;
  roleName?: string | null | undefined;
  excludeRole?: string | null | undefined;
  page?: number | null | undefined;
}>;


export type BuscarTerapeutasQuery = { users: { results: Array<{ id: string, fullName: string | null } | null> | null } | null };

export type CreateUserMutationVariables = Exact<{
  username: string;
  email: string;
  password: string;
  ci: string;
  firstName: string;
  lastName: string;
  celular?: string | null | undefined;
  roleId: string | number;
}>;


export type CreateUserMutation = { createUser: { plainPassword: string | null, user: { id: string, username: string, email: string | null } | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: string | number;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  celular?: string | null | undefined;
  ci?: string | null | undefined;
  visibility?: string | null | undefined;
  isActive?: boolean | null | undefined;
}>;


export type UpdateUserMutation = { updateUser: { user: { id: string, databaseId: number | null, username: string, email: string | null, firstName: string, lastName: string, fullName: string | null, ci: string, celular: string, status: string, visibility: string, isStaff: boolean, isActive: boolean, foto: string | null, cv: string | null, role: { id: string, name: string } | null } | null } | null };

export type ChangePasswordMutationVariables = Exact<{
  newPassword: string;
  oldPassword: string;
}>;


export type ChangePasswordMutation = { changePassword: { success: boolean | null } | null };

export type TokenAuthMutationVariables = Exact<{
  username: string;
  password: string;
}>;


export type TokenAuthMutation = { tokenAuth: { token: string, refreshToken: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, databaseId: number | null, username: string, email: string | null, firstName: string, lastName: string, fullName: string | null, ci: string, celular: string, status: string, visibility: string, isStaff: boolean, foto: string | null, cv: string | null, modules: Array<string | null> | null, role: { id: string, name: string } | null } | null };


export const ObtenerPostsBlogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerPostsBlog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"titulo"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"resumen"},"name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","alias":{"kind":"Name","value":"contenido"},"name":{"kind":"Name","value":"content"}},{"kind":"Field","alias":{"kind":"Name","value":"categoria"},"name":{"kind":"Name","value":"category"}},{"kind":"Field","alias":{"kind":"Name","value":"autor"},"name":{"kind":"Name","value":"author"}},{"kind":"Field","alias":{"kind":"Name","value":"urlImagen"},"name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","alias":{"kind":"Name","value":"tiempoLectura"},"name":{"kind":"Name","value":"readTime"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaCreacion"},"name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerPostsBlogQuery, ObtenerPostsBlogQueryVariables>;
export const CreateBlogPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBlogPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excerpt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"readTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBlogPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"author"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author"}}},{"kind":"Argument","name":{"kind":"Name","value":"excerpt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excerpt"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"readTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"readTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBlogPostMutation, CreateBlogPostMutationVariables>;
export const UpdateBlogPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBlogPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excerpt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"readTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBlogPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"author"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author"}}},{"kind":"Argument","name":{"kind":"Name","value":"excerpt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excerpt"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"readTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"readTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateBlogPostMutation, UpdateBlogPostMutationVariables>;
export const DeleteBlogPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBlogPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBlogPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteBlogPostMutation, DeleteBlogPostMutationVariables>;
export const ObtenerCursosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerCursos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"descripcion"},"name":{"kind":"Name","value":"description"}},{"kind":"Field","alias":{"kind":"Name","value":"precio"},"name":{"kind":"Name","value":"price"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"state"}},{"kind":"Field","alias":{"kind":"Name","value":"conteoEstudiantes"},"name":{"kind":"Name","value":"studentsCount"}},{"kind":"Field","alias":{"kind":"Name","value":"ingresosTotales"},"name":{"kind":"Name","value":"totalIncome"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerCursosQuery, ObtenerCursosQueryVariables>;
export const ObtenerCursoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerCurso"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"studentsCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalIncome"}},{"kind":"Field","name":{"kind":"Name","value":"enrollments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"carnet"}},{"kind":"Field","name":{"kind":"Name","value":"enrolledAt"}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerCursoQuery, ObtenerCursoQueryVariables>;
export const ObtenerInscripcionesCursoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerInscripcionesCurso"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombreCompleto"},"name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"carnet"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaInscripcion"},"name":{"kind":"Name","value":"enrolledAt"}},{"kind":"Field","alias":{"kind":"Name","value":"pago"},"name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"monto"},"name":{"kind":"Name","value":"amount"}},{"kind":"Field","alias":{"kind":"Name","value":"metodoPago"},"name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoPago"},"name":{"kind":"Name","value":"paymentStatus"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerInscripcionesCursoQuery, ObtenerInscripcionesCursoQueryVariables>;
export const CreateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCourseMutation, CreateCourseMutationVariables>;
export const UpdateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCourseMutation, UpdateCourseMutationVariables>;
export const DeleteCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const EnrollInCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnrollInCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"carnet"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollInCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentMethod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethod"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"carnet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"carnet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EnrollInCourseMutation, EnrollInCourseMutationVariables>;
export const ObtenerEscalasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerEscalas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"descripcion"},"name":{"kind":"Name","value":"description"}},{"kind":"Field","alias":{"kind":"Name","value":"tipoEscala"},"name":{"kind":"Name","value":"scaleType"}},{"kind":"Field","alias":{"kind":"Name","value":"subescalas"},"name":{"kind":"Name","value":"subscales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"valorMaximo"},"name":{"kind":"Name","value":"maxValue"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"valores"},"name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"etiqueta"},"name":{"kind":"Name","value":"label"}},{"kind":"Field","alias":{"kind":"Name","value":"valor"},"name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerEscalasQuery, ObtenerEscalasQueryVariables>;
export const ObtenerEvaluacionesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerEvaluaciones"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scaleEvaluations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"inSession"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"scaleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaEvaluacion"},"name":{"kind":"Name","value":"evaluatedAt"}},{"kind":"Field","alias":{"kind":"Name","value":"puntajeTotal"},"name":{"kind":"Name","value":"totalScore"}},{"kind":"Field","alias":{"kind":"Name","value":"paciente"},"name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"escala"},"name":{"kind":"Name","value":"scale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"respuestasSubescala"},"name":{"kind":"Name","value":"subscaleResponses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"puntaje"},"name":{"kind":"Name","value":"score"}},{"kind":"Field","alias":{"kind":"Name","value":"subescala"},"name":{"kind":"Name","value":"subscale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerEvaluacionesQuery, ObtenerEvaluacionesQueryVariables>;
export const AddScaleResponseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddScaleResponse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"evaluatorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscales"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseSubScale"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valueId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addScaleResponse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"evaluatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"evaluatorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"scaleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscales"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscales"}}},{"kind":"Argument","name":{"kind":"Name","value":"valueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AddScaleResponseMutation, AddScaleResponseMutationVariables>;
export const DeleteScaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteScale"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteScale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteScaleMutation, DeleteScaleMutationVariables>;
export const CreateScaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateScale"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scaleType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscales"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscaleInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScaleValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createScale"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"scaleType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scaleType"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscales"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscales"}}},{"kind":"Argument","name":{"kind":"Name","value":"values"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scaleType"}}]}}]}}]}}]} as unknown as DocumentNode<CreateScaleMutation, CreateScaleMutationVariables>;
export const ObtenerInformesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerInformes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"therapyReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reportUrl"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"generatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerInformesQuery, ObtenerInformesQueryVariables>;
export const ObtenerAsignacionesFormularioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerAsignacionesFormulario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formAssignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"response"}},{"kind":"Field","name":{"kind":"Name","value":"respondedAt"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerAsignacionesFormularioQuery, ObtenerAsignacionesFormularioQueryVariables>;
export const ObtenerFormulariosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerFormularios"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerFormulariosQuery, ObtenerFormulariosQueryVariables>;
export const ObtenerFormularioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerFormulario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerFormularioQuery, ObtenerFormularioQueryVariables>;
export const ObtenerRespuestasFormularioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerRespuestasFormulario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignedToId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formAssignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignedToId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignedToId"}}},{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"}}]}},{"kind":"Field","name":{"kind":"Name","value":"response"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerRespuestasFormularioQuery, ObtenerRespuestasFormularioQueryVariables>;
export const SubmitFullFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitFullForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responses"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitFullForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"responses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responses"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitFullFormMutation, SubmitFullFormMutationVariables>;
export const CreateFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"questions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFormMutation, CreateFormMutationVariables>;
export const DeleteFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteFormMutation, DeleteFormMutationVariables>;
export const MyMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MyMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignedById"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignedToId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignedById"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignedById"}}},{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assignedToId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignedToId"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MyMutationMutation, MyMutationMutationVariables>;
export const ObtenerGastosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerGastos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"descripcion"},"name":{"kind":"Name","value":"description"}},{"kind":"Field","alias":{"kind":"Name","value":"categoria"},"name":{"kind":"Name","value":"category"}},{"kind":"Field","alias":{"kind":"Name","value":"monto"},"name":{"kind":"Name","value":"amount"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaGasto"},"name":{"kind":"Name","value":"expenseDate"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerGastosQuery, ObtenerGastosQueryVariables>;
export const CrearGastoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearGasto"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expenseDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"expenseDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expenseDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CrearGastoMutation, CrearGastoMutationVariables>;
export const ActualizarEstadoGastoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActualizarEstadoGasto"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpenseStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<ActualizarEstadoGastoMutation, ActualizarEstadoGastoMutationVariables>;
export const EliminarGastoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarGasto"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EliminarGastoMutation, EliminarGastoMutationVariables>;
export const GetTherapyReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTherapyReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"therapyReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reportUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"generatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetTherapyReportsQuery, GetTherapyReportsQueryVariables>;
export const CreateTherapyReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTherapyReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"generatedById"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reportUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTherapyReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"generatedById"},"value":{"kind":"Variable","name":{"kind":"Name","value":"generatedById"}}},{"kind":"Argument","name":{"kind":"Name","value":"reportUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reportUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTherapyReportMutation, CreateTherapyReportMutationVariables>;
export const DeleteTherapyReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTherapyReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTherapyReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteTherapyReportMutation, DeleteTherapyReportMutationVariables>;
export const ObtenerInstitucionesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerInstituciones"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"direccion"},"name":{"kind":"Name","value":"address"}},{"kind":"Field","alias":{"kind":"Name","value":"nombreContacto"},"name":{"kind":"Name","value":"contactName"}},{"kind":"Field","alias":{"kind":"Name","value":"emailContacto"},"name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","alias":{"kind":"Name","value":"telefonoContacto"},"name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","alias":{"kind":"Name","value":"grupos"},"name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerInstitucionesQuery, ObtenerInstitucionesQueryVariables>;
export const ObtenerDetalleInstitucionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerDetalleInstitucion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"direccion"},"name":{"kind":"Name","value":"address"}},{"kind":"Field","alias":{"kind":"Name","value":"nombreContacto"},"name":{"kind":"Name","value":"contactName"}},{"kind":"Field","alias":{"kind":"Name","value":"emailContacto"},"name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","alias":{"kind":"Name","value":"telefonoContacto"},"name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","alias":{"kind":"Name","value":"grupos"},"name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"descripcion"},"name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerDetalleInstitucionQuery, ObtenerDetalleInstitucionQueryVariables>;
export const GetGroupDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGroupDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"therapeuticSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sessionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"sessionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"therapist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<GetGroupDetailQuery, GetGroupDetailQueryVariables>;
export const CrearInstitucionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearInstitucion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contactEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInstitution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"contactEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contactEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CrearInstitucionMutation, CrearInstitucionMutationVariables>;
export const EliminarInstitucionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarInstitucion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInstitution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EliminarInstitucionMutation, EliminarInstitucionMutationVariables>;
export const CrearGrupoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearGrupo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"institutionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInstitutionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"institutionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"institutionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CrearGrupoMutation, CrearGrupoMutationVariables>;
export const EliminarGrupoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarGrupo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInstitutionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EliminarGrupoMutation, EliminarGrupoMutationVariables>;
export const ActualizarInstitucionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActualizarInstitucion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contactEmail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInstitution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id1"}}},{"kind":"Argument","name":{"kind":"Name","value":"contactEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contactEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ActualizarInstitucionMutation, ActualizarInstitucionMutationVariables>;
export const ActualizarGrupoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActualizarGrupo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInstitutionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ActualizarGrupoMutation, ActualizarGrupoMutationVariables>;
export const ObtenerArticulosInventarioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerArticulosInventario"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"tipo"},"name":{"kind":"Name","value":"type"}},{"kind":"Field","alias":{"kind":"Name","value":"condicion"},"name":{"kind":"Name","value":"condition"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"aula"},"name":{"kind":"Name","value":"room"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoMostrado"},"name":{"kind":"Name","value":"statusDisplay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerArticulosInventarioQuery, ObtenerArticulosInventarioQueryVariables>;
export const BulkAddSessionInventoryItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkAddSessionInventoryItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkAddSessionInventoryItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"itemIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedCount"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<BulkAddSessionInventoryItemsMutation, BulkAddSessionInventoryItemsMutationVariables>;
export const CreateInventoryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInventoryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"condition"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"room"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInventoryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"condition"}}},{"kind":"Argument","name":{"kind":"Name","value":"room"},"value":{"kind":"Variable","name":{"kind":"Name","value":"room"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateInventoryItemMutation, CreateInventoryItemMutationVariables>;
export const UpdateInventoryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInventoryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"condition"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"room"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInventoryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"condition"}}},{"kind":"Argument","name":{"kind":"Name","value":"room"},"value":{"kind":"Variable","name":{"kind":"Name","value":"room"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateInventoryItemMutation, UpdateInventoryItemMutationVariables>;
export const DeleteInventoryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInventoryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInventoryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteInventoryItemMutation, DeleteInventoryItemMutationVariables>;
export const ObtenerCampanasMarketingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerCampanasMarketing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketingCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"plataforma"},"name":{"kind":"Name","value":"platform"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"presupuesto"},"name":{"kind":"Name","value":"budget"}},{"kind":"Field","alias":{"kind":"Name","value":"gastado"},"name":{"kind":"Name","value":"spent"}},{"kind":"Field","alias":{"kind":"Name","value":"presupuestoRestante"},"name":{"kind":"Name","value":"remainingBudget"}},{"kind":"Field","name":{"kind":"Name","value":"leads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerCampanasMarketingQuery, ObtenerCampanasMarketingQueryVariables>;
export const ObtenerLeadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerLeads"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"campaignId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"campaignId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"campaignId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"telefono"},"name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaCreacion"},"name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","alias":{"kind":"Name","value":"campana"},"name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerLeadsQuery, ObtenerLeadsQueryVariables>;
export const CreateCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"budget"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"budget"},"value":{"kind":"Variable","name":{"kind":"Name","value":"budget"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCampaignMutation, CreateCampaignMutationVariables>;
export const UpdateCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"budget"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"budget"},"value":{"kind":"Variable","name":{"kind":"Name","value":"budget"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaign"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCampaignMutation, UpdateCampaignMutationVariables>;
export const DeleteCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteCampaignMutation, DeleteCampaignMutationVariables>;
export const CreateLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"campaignId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"campaignId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"campaignId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLeadMutation, CreateLeadMutationVariables>;
export const UpdateLeadStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLeadStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLeadStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLeadStatusMutation, UpdateLeadStatusMutationVariables>;
export const DeleteLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteLeadMutation, DeleteLeadMutationVariables>;
export const ObtenerPacientesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerPacientes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"ci"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"registrationComplete"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"residence"}},{"kind":"Field","name":{"kind":"Name","value":"tutor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"celular"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerPacientesQuery, ObtenerPacientesQueryVariables>;
export const BuscarPacientesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BuscarPacientes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<BuscarPacientesQuery, BuscarPacientesQueryVariables>;
export const ObtenerCrecimientoPacientesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerCrecimientoPacientes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientGrowth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<ObtenerCrecimientoPacientesQuery, ObtenerCrecimientoPacientesQueryVariables>;
export const ObtenerDetallesPacienteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerDetallesPaciente"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"ci"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"registrationComplete"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"residence"}},{"kind":"Field","name":{"kind":"Name","value":"tutor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"celular"}}]}},{"kind":"Field","name":{"kind":"Name","value":"clinicalNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"therapeuticSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numeroSesion"},"name":{"kind":"Name","value":"sessionNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaSesion"},"name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoSesion"},"name":{"kind":"Name","value":"sessionStatus"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoPagoMostrado"},"name":{"kind":"Name","value":"paymentStatusDisplay"}},{"kind":"Field","alias":{"kind":"Name","value":"terapeuta"},"name":{"kind":"Name","value":"therapist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerDetallesPacienteQuery, ObtenerDetallesPacienteQueryVariables>;
export const EscaleEriDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EscaleERI"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scaleEvaluations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"scaleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"evaluatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalScore"}},{"kind":"Field","name":{"kind":"Name","value":"inSession"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EscaleEriQuery, EscaleEriQueryVariables>;
export const EscalaDemucaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EscalaDEMUCA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scaleEvaluations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"scaleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scaleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inSession"}},{"kind":"Field","name":{"kind":"Name","value":"subscaleResponses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subscale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<EscalaDemucaQuery, EscalaDemucaQueryVariables>;
export const UserWithPatientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserWithPatients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userWithPatients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"patientsCount"}},{"kind":"Field","name":{"kind":"Name","value":"patients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"relation"}}]}}]}}]}}]} as unknown as DocumentNode<UserWithPatientsQuery, UserWithPatientsQueryVariables>;
export const CrearPacienteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearPaciente"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ci"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"diagnosis"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"residence"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tutorCelular"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tutorCi"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tutorEmail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tutorName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selectedDay"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selectedTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"authorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"birthDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"ci"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ci"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"diagnosis"},"value":{"kind":"Variable","name":{"kind":"Name","value":"diagnosis"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}},{"kind":"Argument","name":{"kind":"Name","value":"residence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"residence"}}},{"kind":"Argument","name":{"kind":"Name","value":"tutorCelular"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tutorCelular"}}},{"kind":"Argument","name":{"kind":"Name","value":"tutorCi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tutorCi"}}},{"kind":"Argument","name":{"kind":"Name","value":"tutorEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tutorEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"tutorName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tutorName"}}},{"kind":"Argument","name":{"kind":"Name","value":"selectedDay"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selectedDay"}}},{"kind":"Argument","name":{"kind":"Name","value":"selectedTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selectedTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}}]}}]}}]}}]} as unknown as DocumentNode<CrearPacienteMutation, CrearPacienteMutationVariables>;
export const ActualizarPacienteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActualizarPaciente"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"residence"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"diagnosis"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationComplete"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"residence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"residence"}}},{"kind":"Argument","name":{"kind":"Name","value":"diagnosis"},"value":{"kind":"Variable","name":{"kind":"Name","value":"diagnosis"}}},{"kind":"Argument","name":{"kind":"Name","value":"registrationComplete"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationComplete"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"registrationComplete"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<ActualizarPacienteMutation, ActualizarPacienteMutationVariables>;
export const EliminarPacienteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarPaciente"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EliminarPacienteMutation, EliminarPacienteMutationVariables>;
export const UpdateClinicalNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateClinicalNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicNote"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateClinicalNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"authorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateClinicalNotesMutation, UpdateClinicalNotesMutationVariables>;
export const ObtenerPagosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerPagos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"cantidadSesiones"},"name":{"kind":"Name","value":"sessionsCount"}},{"kind":"Field","alias":{"kind":"Name","value":"precioPorSesion"},"name":{"kind":"Name","value":"pricePerSession"}},{"kind":"Field","alias":{"kind":"Name","value":"montoPagado"},"name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","alias":{"kind":"Name","value":"montoTotal"},"name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","alias":{"kind":"Name","value":"deuda"},"name":{"kind":"Name","value":"debt"}},{"kind":"Field","alias":{"kind":"Name","value":"metodoPago"},"name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaPago"},"name":{"kind":"Name","value":"paymentDate"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoPago"},"name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","alias":{"kind":"Name","value":"paciente"},"name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"descuento"},"name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"valor"},"name":{"kind":"Name","value":"value"}},{"kind":"Field","alias":{"kind":"Name","value":"tipo"},"name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerPagosQuery, ObtenerPagosQueryVariables>;
export const ObtenerDescuentosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerDescuentos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"valor"},"name":{"kind":"Name","value":"value"}},{"kind":"Field","alias":{"kind":"Name","value":"tipo"},"name":{"kind":"Name","value":"type"}},{"kind":"Field","alias":{"kind":"Name","value":"descripcion"},"name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<ObtenerDescuentosQuery, ObtenerDescuentosQueryVariables>;
export const CrearPagoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearPago"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionsCount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pricePerSession"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amountPaid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionsCount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionsCount"}}},{"kind":"Argument","name":{"kind":"Name","value":"pricePerSession"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pricePerSession"}}},{"kind":"Argument","name":{"kind":"Name","value":"amountPaid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amountPaid"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentMethod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethod"}}},{"kind":"Argument","name":{"kind":"Name","value":"discountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CrearPagoMutation, CrearPagoMutationVariables>;
export const ActualizarPagoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActualizarPago"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amountPaid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"amountPaid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amountPaid"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}}]}}]}}]} as unknown as DocumentNode<ActualizarPagoMutation, ActualizarPagoMutationVariables>;
export const EliminarPagoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarPago"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EliminarPagoMutation, EliminarPagoMutationVariables>;
export const CrearDescuentoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearDescuento"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CrearDescuentoMutation, CrearDescuentoMutationVariables>;
export const EliminarDescuentoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarDescuento"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EliminarDescuentoMutation, EliminarDescuentoMutationVariables>;
export const ObtenerPlanesIntervencionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerPlanesIntervencion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interventionPlans"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"objetivoPrincipal"},"name":{"kind":"Name","value":"mainObjective"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaInicio"},"name":{"kind":"Name","value":"startDate"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaFin"},"name":{"kind":"Name","value":"endDate"}},{"kind":"Field","alias":{"kind":"Name","value":"porcentajeProgreso"},"name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","alias":{"kind":"Name","value":"estado"},"name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"paciente"},"name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pasos"},"name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"momento"},"name":{"kind":"Name","value":"moment"}},{"kind":"Field","alias":{"kind":"Name","value":"duracionMinutos"},"name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","alias":{"kind":"Name","value":"objetivo"},"name":{"kind":"Name","value":"objective"}},{"kind":"Field","alias":{"kind":"Name","value":"enfoque"},"name":{"kind":"Name","value":"focus"}},{"kind":"Field","alias":{"kind":"Name","value":"recursosMusicales"},"name":{"kind":"Name","value":"musicalResources"}},{"kind":"Field","alias":{"kind":"Name","value":"enfasisMusical"},"name":{"kind":"Name","value":"musicalEmphasis"}},{"kind":"Field","alias":{"kind":"Name","value":"abordaje"},"name":{"kind":"Name","value":"approach"}},{"kind":"Field","alias":{"kind":"Name","value":"metodoMlt"},"name":{"kind":"Name","value":"mltMethod"}},{"kind":"Field","alias":{"kind":"Name","value":"indiceOrden"},"name":{"kind":"Name","value":"orderIndex"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<ObtenerPlanesIntervencionQuery, ObtenerPlanesIntervencionQueryVariables>;
export const BulkAddStepsToSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkAddStepsToSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"planStepIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkAddStepsToSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"planStepIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"planStepIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedCount"}}]}}]}}]} as unknown as DocumentNode<BulkAddStepsToSessionMutation, BulkAddStepsToSessionMutationVariables>;
export const CreateInterventionPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInterventionPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdById"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mainObjective"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInterventionPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdById"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdById"}}},{"kind":"Argument","name":{"kind":"Name","value":"mainObjective"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mainObjective"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateInterventionPlanMutation, CreateInterventionPlanMutationVariables>;
export const UpdateInterventionPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInterventionPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mainObjective"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInterventionPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"mainObjective"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mainObjective"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateInterventionPlanMutation, UpdateInterventionPlanMutationVariables>;
export const DeleteInterventionPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInterventionPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInterventionPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteInterventionPlanMutation, DeleteInterventionPlanMutationVariables>;
export const CreateStepPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStepPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"planId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moment"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objective"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"musicalResources"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"musicalEmphasis"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"approach"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mltMethod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStepPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"planId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"planId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moment"}}},{"kind":"Argument","name":{"kind":"Name","value":"objective"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objective"}}},{"kind":"Argument","name":{"kind":"Name","value":"durationMinutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}}},{"kind":"Argument","name":{"kind":"Name","value":"focus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focus"}}},{"kind":"Argument","name":{"kind":"Name","value":"musicalResources"},"value":{"kind":"Variable","name":{"kind":"Name","value":"musicalResources"}}},{"kind":"Argument","name":{"kind":"Name","value":"musicalEmphasis"},"value":{"kind":"Variable","name":{"kind":"Name","value":"musicalEmphasis"}}},{"kind":"Argument","name":{"kind":"Name","value":"approach"},"value":{"kind":"Variable","name":{"kind":"Name","value":"approach"}}},{"kind":"Argument","name":{"kind":"Name","value":"mltMethod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mltMethod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"step"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateStepPlanMutation, CreateStepPlanMutationVariables>;
export const UpdateStepPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStepPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objective"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"musicalResources"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"musicalEmphasis"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"approach"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mltMethod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStepPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"moment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moment"}}},{"kind":"Argument","name":{"kind":"Name","value":"objective"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objective"}}},{"kind":"Argument","name":{"kind":"Name","value":"durationMinutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}}},{"kind":"Argument","name":{"kind":"Name","value":"focus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focus"}}},{"kind":"Argument","name":{"kind":"Name","value":"musicalResources"},"value":{"kind":"Variable","name":{"kind":"Name","value":"musicalResources"}}},{"kind":"Argument","name":{"kind":"Name","value":"musicalEmphasis"},"value":{"kind":"Variable","name":{"kind":"Name","value":"musicalEmphasis"}}},{"kind":"Argument","name":{"kind":"Name","value":"approach"},"value":{"kind":"Variable","name":{"kind":"Name","value":"approach"}}},{"kind":"Argument","name":{"kind":"Name","value":"mltMethod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mltMethod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"step"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateStepPlanMutation, UpdateStepPlanMutationVariables>;
export const DeleteStepPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteStepPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStepPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteStepPlanMutation, DeleteStepPlanMutationVariables>;
export const ObtenerRecursosDigitalesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerRecursosDigitales"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"digitalResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"titulo"},"name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"tipo"},"name":{"kind":"Name","value":"type"}},{"kind":"Field","alias":{"kind":"Name","value":"categoria"},"name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","alias":{"kind":"Name","value":"tipoMostrado"},"name":{"kind":"Name","value":"typeDisplay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerRecursosDigitalesQuery, ObtenerRecursosDigitalesQueryVariables>;
export const BulkAddSessionResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkAddSessionResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkAddSessionResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"resourceIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedCount"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<BulkAddSessionResourcesMutation, BulkAddSessionResourcesMutationVariables>;
export const CreateDigitalResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDigitalResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDigitalResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDigitalResourceMutation, CreateDigitalResourceMutationVariables>;
export const UpdateDigitalResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDigitalResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDigitalResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDigitalResourceMutation, UpdateDigitalResourceMutationVariables>;
export const DeleteDigitalResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDigitalResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDigitalResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteDigitalResourceMutation, DeleteDigitalResourceMutationVariables>;
export const ObtenerRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"permisos"},"name":{"kind":"Name","value":"permissions"}},{"kind":"Field","alias":{"kind":"Name","value":"conteoUsuarios"},"name":{"kind":"Name","value":"usersCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}}]}}]}}]} as unknown as DocumentNode<ObtenerRolesQuery, ObtenerRolesQueryVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const ObtenerSesionesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerSesiones"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"byCycles"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"therapistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}}},{"kind":"Argument","name":{"kind":"Name","value":"byCycles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"byCycles"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"byCycles"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaCreacion"},"name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","alias":{"kind":"Name","value":"duracionMinutos"},"name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","alias":{"kind":"Name","value":"numeroCiclo"},"name":{"kind":"Name","value":"cycleNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"notas"},"name":{"kind":"Name","value":"notes"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoPagoMostrado"},"name":{"kind":"Name","value":"paymentStatusDisplay"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoPago"},"name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","alias":{"kind":"Name","value":"fechaSesion"},"name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","alias":{"kind":"Name","value":"numeroSesion"},"name":{"kind":"Name","value":"sessionNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"estadoSesion"},"name":{"kind":"Name","value":"sessionStatus"}},{"kind":"Field","alias":{"kind":"Name","value":"tipoSesion"},"name":{"kind":"Name","value":"sessionType"}},{"kind":"Field","alias":{"kind":"Name","value":"tipoSesionMostrado"},"name":{"kind":"Name","value":"sessionTypeDisplay"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","alias":{"kind":"Name","value":"grupo"},"name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"descripcion"},"name":{"kind":"Name","value":"description"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"institucion"},"name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"paciente"},"name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"terapeuta"},"name":{"kind":"Name","value":"therapist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerSesionesQuery, ObtenerSesionesQueryVariables>;
export const ObtenerCiclosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerCiclos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"byCycles"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"therapistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"byCycles"}},{"kind":"Field","name":{"kind":"Name","value":"cycles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"tutor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"celular"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exempt"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cycleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"completedCount"}},{"kind":"Field","name":{"kind":"Name","value":"firstSessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastSessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"therapists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"sessionTypeDisplay"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatusDisplay"}},{"kind":"Field","name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"sessionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"sessionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"sessionResources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionResources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sessionInventory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scaleEvaluations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalScore"}},{"kind":"Field","name":{"kind":"Name","value":"scale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scaleType"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscaleResponses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueResponses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scaleValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<ObtenerCiclosQuery, ObtenerCiclosQueryVariables>;
export const ObtenerCiclosPacientesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerCiclosPacientes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientsLastCycle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"therapistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"cycleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCount"}},{"kind":"Field","name":{"kind":"Name","value":"completedCount"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"exempt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"sessionStatus"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerCiclosPacientesQuery, ObtenerCiclosPacientesQueryVariables>;
export const VerSesionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VerSesion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cycleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"sessionResources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"formAssignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completionRatio"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"response"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scaleEvaluations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalScore"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inSession"}},{"kind":"Field","name":{"kind":"Name","value":"subscaleResponses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maxValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueResponses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scaleValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionInventory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"room"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"sessionPlanSteps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actualDuration"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"planStep"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approach"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"focus"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mltMethod"}},{"kind":"Field","name":{"kind":"Name","value":"moment"}},{"kind":"Field","name":{"kind":"Name","value":"musicalEmphasis"}},{"kind":"Field","name":{"kind":"Name","value":"musicalResources"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VerSesionQuery, VerSesionQueryVariables>;
export const CrearSesionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CrearSesion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"videoUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"therapistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}}},{"kind":"Argument","name":{"kind":"Name","value":"durationMinutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"videoUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"videoUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sessionNumber"}}]}}]}}]}}]} as unknown as DocumentNode<CrearSesionMutation, CrearSesionMutationVariables>;
export const ActualizarSesionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActualizarSesion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"videoUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"therapistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionType"}}},{"kind":"Argument","name":{"kind":"Name","value":"durationMinutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"durationMinutes"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}},{"kind":"Argument","name":{"kind":"Name","value":"videoUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"videoUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sessionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"sessionDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}}]}}]}}]}}]} as unknown as DocumentNode<ActualizarSesionMutation, ActualizarSesionMutationVariables>;
export const CreateCycleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCycle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"numSessions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCycle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"therapistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"therapistId"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"numSessions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"numSessions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateCycleMutation, CreateCycleMutationVariables>;
export const EliminarSesionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EliminarSesion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EliminarSesionMutation, EliminarSesionMutationVariables>;
export const ObtenerUsuariosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObtenerUsuarios"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeRole"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleName"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeRole"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"celular"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"foto"}},{"kind":"Field","name":{"kind":"Name","value":"ci"}},{"kind":"Field","alias":{"kind":"Name","value":"rol"},"name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"nombre"},"name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObtenerUsuariosQuery, ObtenerUsuariosQueryVariables>;
export const BuscarTerapeutasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BuscarTerapeutas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeRole"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleName"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeRole"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<BuscarTerapeutasQuery, BuscarTerapeutasQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ci"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"celular"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"ci"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ci"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"celular"},"value":{"kind":"Variable","name":{"kind":"Name","value":"celular"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plainPassword"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"celular"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ci"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"celular"},"value":{"kind":"Variable","name":{"kind":"Name","value":"celular"}}},{"kind":"Argument","name":{"kind":"Name","value":"ci"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ci"}}},{"kind":"Argument","name":{"kind":"Name","value":"visibility"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"ci"}},{"kind":"Field","name":{"kind":"Name","value":"celular"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"foto"}},{"kind":"Field","name":{"kind":"Name","value":"cv"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const TokenAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TokenAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<TokenAuthMutation, TokenAuthMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"ci"}},{"kind":"Field","name":{"kind":"Name","value":"celular"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"foto"}},{"kind":"Field","name":{"kind":"Name","value":"cv"}},{"kind":"Field","name":{"kind":"Name","value":"modules"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;