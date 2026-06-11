import { gql } from "@apollo/client";

export const CREAR_SESION = gql`
  mutation CrearSesion(
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

export const ACTUALIZAR_SESION = gql`
  mutation ActualizarSesion(
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

export const ELIMINAR_SESION = gql`
  mutation EliminarSesion($id: ID!) {
    deleteSession(id: $id) {
      success
      message
    }
  }
`;
