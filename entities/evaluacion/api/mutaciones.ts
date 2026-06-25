import { gql } from "@apollo/client";

export const ADD_SCALE_RESPONSE = gql`
  mutation AddScaleResponse(
    $patientId: ID!
    $evaluatorId: ID!
    $scaleId: ID!
    $sessionId: ID
    $subscales: [ResponseSubScale]
    $valueId: ID
  ) {
    addScaleResponse(
      patientId: $patientId
      evaluatorId: $evaluatorId
      scaleId: $scaleId
      sessionId: $sessionId
      subscales: $subscales
      valueId: $valueId
    ) {
      success
      message
    }
  }
`;
