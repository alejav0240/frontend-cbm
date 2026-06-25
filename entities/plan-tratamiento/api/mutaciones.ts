import {gql} from "@apollo/client";

export const BULK_ADD_STEPS_TO_SESSION = gql`
  mutation BulkAddStepsToSession($planStepIds: [ID!]!, $sessionId: ID!) {
    bulkAddStepsToSession(planStepIds: $planStepIds, sessionId: $sessionId) {
      addedCount
    }
  }
`;
