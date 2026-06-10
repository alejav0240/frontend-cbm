import { gql } from "@apollo/client";

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

export const ADD_SESSION_RESOURCE = gql`
  mutation AddSessionResource($sessionId: ID!, $resourceId: ID!) {
    addSessionResource(sessionId: $sessionId, resourceId: $resourceId) {
      sessionResource
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
