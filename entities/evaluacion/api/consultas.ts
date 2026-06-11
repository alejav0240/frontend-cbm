import { gql } from "@apollo/client";

export const OBTENER_ESCALAS = gql`
  query ObtenerEscalas {
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

export const OBTENER_EVALUACIONES = gql`
  query ObtenerEvaluaciones($patientId: ID) {
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
