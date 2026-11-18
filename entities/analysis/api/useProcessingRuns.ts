import { useQuery } from "@apollo/client/react";

import { OBTENER_PROCESAMIENTO_SESION } from "./consultas";

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
  artifacts: ProcessingArtifact[];
};

type ProcessingRunsResponse = {
  processingRuns: ProcessingRun[];
};

export function useProcessingRuns(sessionId: string | null) {
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
  };
}
