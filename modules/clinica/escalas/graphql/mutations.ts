import { gql } from '@apollo/client';

export const CREATE_SCALE = gql`
  mutation CreateScale($name: String!, $scaleType: String!, $description: String, $subscales: [SubscaleInput], $values: [ScaleValueInput]) {
    createScale(name: $name, scaleType: $scaleType, description: $description, subscales: $subscales, values: $values) {
      scale {
        id
        name
        scaleType
      }
    }
  }
`;

export const ADD_SCALE_RESPONSE = gql`
  mutation AddScaleResponse(
    $patientId: ID!,
    $evaluatorId: ID!,
    $scaleId: ID!,
    $sessionId: ID,
    $subscales: [ResponseSubScale],
    $valueId: ID
  ) {
    addScaleResponse(
      patientId: $patientId,
      evaluatorId: $evaluatorId,
      scaleId: $scaleId,
      sessionId: $sessionId,
      subscales: $subscales,
      valueId: $valueId
    ) {
      success
      message
    }
  }
`;

export const DELETE_SCALE = gql`
mutation CreateReport {
  deleteScale(id: "") {
    success
  }
}`;
