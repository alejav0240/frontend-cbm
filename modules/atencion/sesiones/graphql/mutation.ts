import { gql } from "@apollo/client";

export const CREATE_SESSION = gql`
  mutation CreateSession(
    $patientId: ID
    $therapistId: ID!
    $sessionDate: DateTime!
    $sessionType: String!
    $durationMinutes: Int
    $notes: String
    $groupId: ID
    $videoUrl: String
  ) {
    createSession(
      patientId: $patientId
      therapistId: $therapistId
      sessionDate: $sessionDate
      sessionType: $sessionType
      durationMinutes: $durationMinutes
      notes: $notes
      groupId: $groupId
      videoUrl: $videoUrl
    ) {
      session {
        id
        sessionNumber
      }
    }
  }
`;

export const UPDATE_SESSION_PAYMENT = gql`
  mutation UpdateSessionPaymentStatus($id: ID!, $paymentStatus: String!) {
    updateSessionPaymentStatus(id: $id, paymentStatus: $paymentStatus) {
      session {
        id
        paymentStatus
      }
    }
  }
`;

export const ADD_SESSION_RESOURCE = gql`
  mutation AddSessionResource($sessionId: ID!, $resourceId: ID!) {
    addSessionResource(sessionId: $sessionId, resourceId: $resourceId) {
      sessionResource
    }
  }
`;

export const UPDATE_SESSION = gql`
  mutation UpdateSession(
    $id: ID!
    $notes: String
    $durationMinutes: Int
    $videoUrl: String
    $sessionStatus: String
  ) {
    updateSession(
      id: $id
      notes: $notes
      durationMinutes: $durationMinutes
      videoUrl: $videoUrl
      sessionStatus: $sessionStatus
    ) {
      session {
        id
        sessionStatus
        notes
        durationMinutes
        videoUrl
      }
    }
  }
`;

export const DELETE_SESSION = gql`
  mutation DeleteSession($id: ID!) {
    deleteSession(id: $id) {
      success
      message
    }
  }
`;
