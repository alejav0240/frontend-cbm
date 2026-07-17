import { gql } from "@apollo/client";

export const OBTENER_ASIGNACIONES_FORMULARIO = gql`
  query ObtenerAsignacionesFormulario(
    $patientId: ID
  ) {
    formAssignments(
      patientId: $patientId
    ) {
      results {
        id
        createdAt
        form {
          id
          name
          description
          questions {
            id
            question
            questionType
            isRequired
            orderIndex
          }
        }
        assignedTo {
          id
          fullName
        }
        assignedBy {
          id
          fullName
        }
        patient {
          id
          fullName
        }
        responses {
          id
          response
          respondedAt
          question {
            id
            question
          }
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

export const OBTENER_FORMULARIOS = gql`
  query ObtenerFormularios($page: Int, $pageSize: Int) {
    forms(page: $page, pageSize: $pageSize) {
      results {
        id
        name
        description
        questions {
          id
          question
          questionType
          isRequired
          orderIndex
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

export const OBTENER_FORMULARIO = gql`
  query ObtenerFormulario($id: ID!) {
    form(id: $id) {
      description
      id
      name
      questions {
        isRequired
        orderIndex
        question
        questionType
        id
      }
    }
  }
`;

export const OBTENER_RESPUESTAS_FORMULARIO = gql`
  query ObtenerRespuestasFormulario(
    $assignedToId: ID
    $formId: ID
    $patientId: ID
  ) {
    formAssignments(
      assignedToId: $assignedToId
      formId: $formId
      patientId: $patientId
    ) {
      results {
        id
        responses {
          question {
            question
          }
          response
        }
      }
    }
  }
`;
