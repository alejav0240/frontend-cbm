import {gql} from "@apollo/client";

export const CREATE_THERAPY_REPORT = gql`
  mutation CreateTherapyReport($patientId: ID!, $generatedById: ID!, $reportUrl: String!) {
    createTherapyReport(patientId: $patientId, generatedById: $generatedById, reportUrl: $reportUrl) {
      report {
        id
      }
    }
  }
`;

export const DELETE_THERAPY_REPORT = gql`
  mutation DeleteTherapyReport($id: ID!) {
    deleteTherapyReport(id: $id) {
      success
    }
  }
`;