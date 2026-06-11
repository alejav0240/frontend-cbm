// Auto-generated Mutations
import { gql } from '@apollo/client';

export const GET_INFORMES = gql`
query gettherapyReports {
  therapyReports(patientId: "") {
    createdAt
    id
    reportUrl
    patient {
      fullName
    }
    generatedBy {
      fullName
    }
  }
}
`;
