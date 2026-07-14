import { gql } from "@apollo/client";

export const GET_THERAPY_REPORTS = gql`
  query GetTherapyReports(
    $patientId: ID
    $page: Int
    $pageSize: Int
  ) {
    therapyReports(
      patientId: $patientId
      page: $page
      pageSize: $pageSize
    ) {
      results {
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
      totalCount
      totalPages
      currentPage
    }
  }
`;
