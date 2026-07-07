import {gql} from "@apollo/client";

export const BULK_ADD_STEPS_TO_SESSION = gql`
  mutation BulkAddStepsToSession($planStepIds: [ID!]!, $sessionId: ID!) {
    bulkAddStepsToSession(planStepIds: $planStepIds, sessionId: $sessionId) {
      addedCount
    }
  }
`;

export const CREATE_INTERVENTION_PLAN = gql`
  mutation CreateInterventionPlan($patientId: ID!, $createdById: ID!, $mainObjective: String!, $startDate: Date, $endDate: Date) {
    createInterventionPlan(patientId: $patientId, createdById: $createdById, mainObjective: $mainObjective, startDate: $startDate, endDate: $endDate) {
      plan {
        id
      }
    }
  }
`;

export const UPDATE_INTERVENTION_PLAN = gql`
  mutation UpdateInterventionPlan($id: ID!, $mainObjective: String, $startDate: Date, $endDate: Date) {
    updateInterventionPlan(id: $id, mainObjective: $mainObjective, startDate: $startDate, endDate: $endDate) {
      plan {
        id
      }
    }
  }
`;

export const DELETE_INTERVENTION_PLAN = gql`
  mutation DeleteInterventionPlan($id: ID!) {
    deleteInterventionPlan(id: $id) {
      success
    }
  }
`;


export const CREATE_STEP_PLAN = gql`
  mutation CreateStepPlan(
    $planId: ID!, 
    $moment: String!, 
    $objective: String!, 
    $durationMinutes: Int,
    $focus: String,
    $musicalResources: String,
    $musicalEmphasis: String,
    $approach: String,
    $mltMethod: String
  ) {
    createStepPlan(
      planId: $planId, 
      moment: $moment, 
      objective: $objective, 
      durationMinutes: $durationMinutes,
      focus: $focus,
      musicalResources: $musicalResources,
      musicalEmphasis: $musicalEmphasis,
      approach: $approach,
      mltMethod: $mltMethod
    ) {
      step {
        id
      }
    }
  }
`;

export const UPDATE_STEP_PLAN = gql`
  mutation UpdateStepPlan(
    $id: ID!, 
    $moment: String, 
    $objective: String, 
    $durationMinutes: Int,
    $focus: String,
    $musicalResources: String,
    $musicalEmphasis: String,
    $approach: String,
    $mltMethod: String
  ) {
    updateStepPlan(
      id: $id, 
      moment: $moment, 
      objective: $objective, 
      durationMinutes: $durationMinutes,
      focus: $focus,
      musicalResources: $musicalResources,
      musicalEmphasis: $musicalEmphasis,
      approach: $approach,
      mltMethod: $mltMethod
    ) {
      step {
        id
      }
    }
  }
`;

export const DELETE_STEP_PLAN = gql`
  mutation DeleteStepPlan($id: ID!) {
    deleteStepPlan(id: $id) {
      success
    }
  }
`;
