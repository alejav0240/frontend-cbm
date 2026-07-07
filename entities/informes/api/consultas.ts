import {gql} from "@apollo/client";

export const GET_THERAPY_REPORTS = gql`
  query GetTherapyReports($patientId: ID) {
    therapyReports(patientId: $patientId) {
      id
      reportUrl
      createdAt
      patient {
        id
        fullName
      }
      generatedBy {
        id
        fullName
      }
    }
  }
`;