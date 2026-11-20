import { useMutation, useQuery } from "@apollo/client/react";

import { CREAR_PROCESAMIENTO_SESION, OBTENER_PROCESAMIENTO_SESION } from "./consultas";
import type { PipelineStage } from "../ui/ProcessingPipeline";

export type ProcessingArtifact = {
  id: string;
  kind: string;
  uri: string;
  sha256?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  trainingAuthorized: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | null;
};

export type ProcessingRun = {
  id: string;
  externalRunId: string;
  pipelineVersion: string;
  status: string;
  sourceUri?: string | null;
  sourceSha256?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  requestedAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  updatedAt?: string | null;
  result?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  semanticStatus: string;
  reviewRequired: boolean;
  pipelineStages: PipelineStage[];
  artifacts: ProcessingArtifact[];
};

type ProcessingRunsResponse = {
  processingRuns: ProcessingRun[];
};

export function useProcessingRuns(sessionId: string | null) {
  const [createProcessingRun, createState] = useMutation(CREAR_PROCESAMIENTO_SESION);
  const query = useQuery<ProcessingRunsResponse>(OBTENER_PROCESAMIENTO_SESION, {
    variables: { sessionId },
    skip: !sessionId,
    pollInterval: sessionId ? 5000 : 0,
    notifyOnNetworkStatusChange: true,
  });

  return {
    runs: query.data?.processingRuns ?? [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
    starting: createState.loading,
    startRun: async (sourceUri?: string) => {
      await createProcessingRun({
        variables: {
          sessionId,
          pipelineVersion: "0.3.0",
          sourceUri,
        },
      });
      await query.refetch();
    },
  };
}
