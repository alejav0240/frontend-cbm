import {gql} from "@apollo/client";

export const GET_SESSIONS = gql`
  query GetSessions($patientId: ID = "", $paymentStatus: String = "", $sessionType: String = "", $sessionStatus: String = "", $therapistId: ID = "") {
    sessions(
      patientId: $patientId
      paymentStatus: $paymentStatus
      sessionStatus: $sessionStatus
      therapistId: $therapistId
      sessionType: $sessionType
    ) {
      id
      createdAt
      durationMinutes
      cycleNumber
      notes
      paymentStatusDisplay
      paymentStatus
      sessionDate
      sessionNumber
      sessionStatus
      sessionType
      sessionTypeDisplay
      updatedAt
      videoUrl
      group {
        id
        description
        name
        institution {
          name
        }
      }
      patient {
        id
        fullName
      }
      therapist {
        fullName
      }
    }
  }
`;