import { gql } from "@apollo/client";

export const OBTENER_PACIENTES = gql`
  query ObtenerPacientes(
    $status: String
    $search: String
    $page: Int
    $pageSize: Int
  ) {
    patients(
      status: $status
      search: $search
      page: $page
      pageSize: $pageSize
    ) {
      totalCount
      totalPages
      currentPage
      results {
        id
        databaseId
        fullName
        firstName
        ci
        status
        registrationComplete
        diagnosis
        birthDate
        createdAt
        imageUrl
        residence
        tutor {
          id
          firstName
          celular
          email
        }
      }
    }
  }
`;

export const BUSCAR_PACIENTES = gql`
  query BuscarPacientes($search: String) {
    patients(search: $search, pageSize: 10) {
      results {
        id
        fullName
      }
    }
  }
`;

export const OBTENER_CRECIMIENTO_PACIENTES = gql`
  query ObtenerCrecimientoPacientes {
    patientGrowth {
      month
      total
    }
  }
`;

export const OBTENER_DETALLES_PACIENTE = gql`
  query ObtenerDetallesPaciente($id: ID!) {
    patient(id: $id) {
      id
      databaseId
      fullName
      ci
      birthDate
      imageUrl
      notes
      status
      registrationComplete
      diagnosis
      createdAt
      residence
      tutor {
        id
        fullName
        celular
      }
      clinicalNotes {
        id
        category
        content
        createdAt
      }
      therapeuticSessions {
        edges {
          node {
            id
            numeroSesion: sessionNumber
            fechaSesion: sessionDate
            estadoSesion: sessionStatus
            estadoPagoMostrado: paymentStatusDisplay
            terapeuta: therapist {
              fullName
            }
            videoUrl
            notes
          }
        }
      }
    }
  }
`;

export const OBTENER_PROGRESO_DE_ESCALA = gql`
  query EscaleERI($patientId: ID, $scaleId: ID) {
    scaleEvaluations(patientId: $patientId, scaleId: $scaleId) {
      results {
        evaluatedAt
        totalScore
        inSession
        id
      }
    }
  }
`;

export const OBTENER_PROGRESO_SUBESCALA = gql`
  query EscalaDEMUCA($patientId: ID, $scaleId: ID) {
    scaleEvaluations(patientId: $patientId, scaleId: $scaleId) {
      results {
        id
        inSession
        subscaleResponses {
          id
          score
          subscale {
            name
            category
          }
        }
      }
    }
  }
`;
