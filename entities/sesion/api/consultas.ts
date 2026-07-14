import { gql } from "@apollo/client";

export const OBTENER_SESIONES = gql`
  query ObtenerSesiones(
    $patientId: ID
    $paymentStatus: String
    $sessionType: String
    $sessionStatus: String
    $therapistId: ID
    $page: Int
    $pageSize: Int
    $byCycles: Boolean
    $search: String
  ) {
    sessions(
      patientId: $patientId
      paymentStatus: $paymentStatus
      sessionStatus: $sessionStatus
      therapistId: $therapistId
      sessionType: $sessionType
      byCycles: $byCycles
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      byCycles
      currentPage
      totalCount
      totalPages
      sessions {
        id
        fechaCreacion: createdAt
        duracionMinutos: durationMinutes
        numeroCiclo: cycleNumber
        notas: notes
        estadoPagoMostrado: paymentStatusDisplay
        estadoPago: paymentStatus
        fechaSesion: sessionDate
        numeroSesion: sessionNumber
        estadoSesion: sessionStatus
        tipoSesion: sessionType
        tipoSesionMostrado: sessionTypeDisplay
        videoUrl
        grupo: group {
          id
          descripcion: description
          nombre: name
          institucion: institution {
            nombre: name
            __typename
          }
          __typename
        }
        paciente: patient {
          id
          fullName
          __typename
        }
        terapeuta: therapist {
          id
          fullName
          __typename
        }
        __typename
      }
    }
  }
`;

export const OBTENER_CICLOS = gql`
  query ObtenerCiclos(
    $patientId: ID
    $paymentStatus: String
    $sessionStatus: String
    $sessionType: String
    $therapistId: ID
    $page: Int
    $pageSize: Int
  ) {
    sessions(
      patientId: $patientId
      byCycles: true
      page: $page
      pageSize: $pageSize
      paymentStatus: $paymentStatus
      sessionType: $sessionType
      sessionStatus: $sessionStatus
      therapistId: $therapistId
    ) {
      currentPage
      totalCount
      totalPages
      byCycles
      cycles {
        patientId
        patientName
        patient {
          id
          fullName
          tutor {
            celular
            __typename
          }
          __typename
        }
        paymentSummary {
          exempt
          paid
          pending
          __typename
        }
        cycleNumber
        completedCount
        firstSessionDate
        id
        lastSessionDate
        sessionCount
        status
        therapists {
          id
          fullName
          __typename
        }
        sessions {
          durationMinutes
          databaseId
          cycleNumber
          createdAt
          notes
          videoUrl
          sessionTypeDisplay
          paymentStatusDisplay
          sessionDate
          sessionNumber
          sessionStatus
          sessionResources {
            resource {
              id
              title
              type
              url
              __typename
            }
            __typename
          }
          sessionResources {
            resource {
              title
              __typename
            }
            __typename
          }
          __typename
          sessionInventory {
            id
            item {
              name
            }
          }
          scaleEvaluations {
            id
            evaluatedAt
            totalScore
            scale {
              id
              name
              scaleType
              __typename
            }
            subscaleResponses {
              subscale {
                name
                __typename
              }
              score
              __typename
            }
            valueResponses {
              scaleValue {
                label
                value
                __typename
              }
              __typename
            }
            __typename
          }
        }
        __typename
      }
      __typename
    }
  }
`;

export const OBTENER_CICLOS_PACIENTES = gql`
  query ObtenerCiclosPacientes(
    $pageSize: Int
    $page: Int
    $search: String
    $therapistId: ID
  ) {
    patientsLastCycle(
      page: $page
      pageSize: $pageSize
      search: $search
      therapistId: $therapistId
    ) {
      currentPage
      totalCount
      totalPages
      results {
        patientName
        cycleNumber
        status
        sessionCount
        completedCount
        patient {
          id
        }
        paymentSummary {
          paid
          pending
          exempt
        }
        sessions {
          id
          sessionDate
          sessionStatus
        }
      }
    }
  }
`;

export const VER_SESION = gql`
  query VerSesion($id: ID!) {
    session(id: $id) {
      createdAt
      cycleNumber
      databaseId
      durationMinutes
      sessionResources {
        resource {
          title
        }
      }
      sessionDate
      notes
      formAssignments {
        completionRatio
        createdAt
        responses {
          response
          question {
            question
          }
        }
      }
      scaleEvaluations {
        totalScore
        evaluatedAt
        id
        inSession
        subscaleResponses {
          subscale {
            id
            maxValue
          }
          score
        }
        valueResponses {
          id
          scaleValue {
            label
            value
          }
        }
      }
      sessionInventory {
        item {
          name
          room
        }
      }
      sessionNumber
      sessionPlanSteps {
        actualDuration
        createdAt
        id
        isCompleted
        planStep {
          approach
          durationMinutes
          focus
          id
          mltMethod
          moment
          musicalEmphasis
          musicalResources
          objective
          orderIndex
        }
      }
    }
  }
`;
