import { gql } from '@apollo/client';

export const GET_SCALES = gql`
  query GetScales {
    scales {
      id
      name
      description
      scaleType
      subscales {
        id
        name
        maxValue
      }
      values {
        id
        label
        value
      }
    }
  }
`;

export const GET_EVALUATIONS = gql`
  query GetEvaluations($patientId: ID) {
    scaleEvaluations(patientId: $patientId) {
      id
      evaluatedAt
      totalScore
      patient {
        id
        fullName
      }
      scale {
        id
        name
      }
      subscaleResponses {
        id
        score
        subscale {
          id
          name
        }
      }
    }
  }
`;

