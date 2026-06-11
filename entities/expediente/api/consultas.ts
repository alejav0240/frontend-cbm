import { gql } from "@apollo/client";

export const OBTENER_INFORMES = gql`
  query ObtenerInformes($patientId: String = "") {
    therapyReports(patientId: $patientId) {
      id
      createdAt
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
