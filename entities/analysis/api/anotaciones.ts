import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

export const OBTENER_CASOS_ANOTACION = gql`
  query ObtenerCasosAnotacion($runId: ID!, $status: String) {
    annotationCases(runId: $runId, status: $status) {
      id
      windowId
      startSeconds
      endSeconds
      modality
      label
      actorRole
      source
      status
      proposal
      reviews {
        id
        decision
        label
        actorRole
        comment
        reviewedAt
      }
    }
  }
`;

export const REVISAR_CASO_ANOTACION = gql`
  mutation RevisarCasoAnotacion(
    $caseId: ID!
    $decision: String!
    $label: String
    $actorRole: String
    $startSeconds: Float
    $endSeconds: Float
    $comment: String
  ) {
    reviewAnnotationCase(
      caseId: $caseId
      decision: $decision
      label: $label
      actorRole: $actorRole
      startSeconds: $startSeconds
      endSeconds: $endSeconds
      comment: $comment
    ) {
      case {
        id
        status
        label
        actorRole
      }
    }
  }
`;

export type AnnotationCase = {
  id: string;
  windowId: string;
  startSeconds: number;
  endSeconds: number;
  modality: string;
  label: string;
  actorRole: string;
  source: string;
  status: string;
  reviews: Array<{
    id: string;
    decision: string;
    label: string;
    actorRole: string;
    comment: string;
    reviewedAt?: string | null;
  }>;
};

type AnnotationResponse = { annotationCases: AnnotationCase[] };

export function useAnnotationCases(runId: string | null) {
  const query = useQuery<AnnotationResponse>(OBTENER_CASOS_ANOTACION, {
    variables: { runId },
    skip: !runId,
    pollInterval: runId ? 5000 : 0,
  });
  const [reviewMutation, reviewState] = useMutation(REVISAR_CASO_ANOTACION);

  return {
    cases: query.data?.annotationCases ?? [],
    loading: query.loading,
    error: query.error,
    reviewing: reviewState.loading,
    reviewCase: async (input: {
      caseId: string;
      decision: string;
      label?: string;
      actorRole?: string;
      startSeconds?: number;
      endSeconds?: number;
      comment?: string;
    }) => {
      await reviewMutation({ variables: input });
      await query.refetch();
    },
  };
}
