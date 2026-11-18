import { gql } from "@apollo/client";

export const OBTENER_PROCESAMIENTO_SESION = gql`
  query ObtenerProcesamientoSesion($sessionId: ID!, $status: String) {
    processingRuns(sessionId: $sessionId, status: $status) {
      id
      session {
        id
      }
      externalRunId
      pipelineVersion
      status
      sourceUri
      sourceSha256
      errorCode
      errorMessage
      requestedAt
      startedAt
      finishedAt
      updatedAt
      result
      metadata
      artifacts {
        id
        kind
        uri
        sha256
        mimeType
        sizeBytes
        trainingAuthorized
        metadata
        createdAt
      }
    }
  }
`;

export const CREAR_PROCESAMIENTO_SESION = gql`
  mutation CrearProcesamientoSesion(
    $sessionId: ID!
    $pipelineVersion: String
    $sourceUri: String
  ) {
    createProcessingRun(
      sessionId: $sessionId
      pipelineVersion: $pipelineVersion
      sourceUri: $sourceUri
    ) {
      processingRun {
        id
        externalRunId
        pipelineVersion
        status
        requestedAt
      }
    }
  }
\`;
