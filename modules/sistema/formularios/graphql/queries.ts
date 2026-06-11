import { gql } from '@apollo/client';

export const GET_FORM_ASSIGNMENTS = gql`
  query GetFormAssignments($patientId: ID) {
    formAssignments(patientId: $patientId) {
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
  }
`;

export const GET_FORMS = gql`
  query GetForms {
    forms {
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
  }
`;