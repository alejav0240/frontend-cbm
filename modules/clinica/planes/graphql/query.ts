import {gql} from "@apollo/client";

export const GET_INTERVENTION_PLANS = gql`
  query GetInterventionPlans($patientId: ID, $search: String, $page: Int, $pageSize: Int) {
    interventionPlans(patientId: $patientId, search: $search, page: $page, pageSize: $pageSize) {
      results {
        id
        mainObjective
        startDate
        endDate
        progressPercent
        status
        patient {
          id
          fullName
        }
        steps {
          id
          moment
          durationMinutes
          objective
          focus
          musicalResources
          musicalEmphasis
          approach
          mltMethod
          orderIndex
          isCompleted
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
