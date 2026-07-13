import { gql } from "@apollo/client";

export const SUBMIT_FULL_FORM = gql`
  mutation SubmitFullForm($assignmentId: ID!, $responses: [ResponseInput!]!) {
    submitFullForm(assignmentId: $assignmentId, responses: $responses) {
      success
      assignment {
        id
      }
    }
  }
`;

export const CREATE_FORM = gql`
  mutation CreateForm(
    $name: String!
    $description: String
    $questions: [QuestionInput]!
  ) {
    createForm(name: $name, description: $description, questions: $questions) {
      form {
        id
        name
      }
    }
  }
`;

export const DELETE_FORM = gql`
  mutation DeleteForm($id: ID!) {
    deleteForm(id: $id) {
      success
    }
  }
`;

export const ASSIGN_FORM = gql`
  mutation MyMutation(
    $assignedById: ID!
    $formId: ID!
    $assignedToId: ID
    $patientId: ID
    $sessionId: ID
  ) {
    assignForm(
      assignedById: $assignedById
      formId: $formId
      assignedToId: $assignedToId
      patientId: $patientId
      sessionId: $sessionId
    ) {
      assignment {
        id
      }
    }
  }
`;
