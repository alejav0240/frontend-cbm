// Auto-generated Mutations
import { gql } from '@apollo/client';

export const CREATE_REPORT = gql`
mutation CreateReport {
  createTherapyReport(generatedById: "", patientId: "", reportUrl: "") {
    report {
      patient {
        fullName
      }
    }
  }
}
`;

export const DELETE_REPORT = gql`
mutation DeleteReport {
  deleteTherapyReport(id: "") {
    success
  }
}
`;
