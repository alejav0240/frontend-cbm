import { ensureCsrfToken, getCookie } from "@/shared/lib/apollo/utils/csrf";
import { secureFetch } from "@/shared/lib/crypto/applicationEncryption";

export type Dataset = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  sample_count: number;
  reviewed_count: number;
  created_at: string;
  updated_at: string;
  training_authorized?: boolean;
  authorized_at?: string | null;
};

export type DatasetSample = {
  id: string;
  session_id: string;
  window_id: string;
  features: Record<string, number>;
  labels: Record<string, number>;
  reviewed: boolean;
  updated_at: string;
};

export type DatasetDetail = {
  dataset: Dataset;
  samples: DatasetSample[];
  can_authorize?: boolean;
};

export type ExportResult = {
  dataset_id: string;
  download_url: string;
  rows: number;
  sha256: string;
  status: string;
  mlflow: {
    status: string;
    run_id?: string;
    experiment?: string;
    reason?: string;
  };
};

export type AnnotationWindow = {
  id: string;
  session_id: string;
  start_time: number;
  end_time: number;
  demuca_phase: string;
  tags: Record<string, string[]>;
  landmarks: unknown;
  features: Record<string, number>;
  created_at?: string;
};

export type MlopsLineage = {
  session_id: string;
  estado: string;
  mlflow_run_id: string;
  mlflow_experiment: string;
  mlflow_model_name: string;
  mlflow_model_version: string;
  model_sha256: string;
  dataset_hash: string;
  created_at: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = init.method ?? "GET";
  if (method !== "GET") await ensureCsrfToken();

  const csrfToken = getCookie("csrftoken");
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (csrfToken) headers.set("X-CSRFToken", csrfToken);
  const response = await secureFetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as T & {
    detail?: string;
    error?: string;
  };
  if (!response.ok) {
    throw new Error(
      body.error || body.detail || `La solicitud falló (${response.status}).`,
    );
  }
  return body;
}

export function listarDatasets() {
  return request<{ datasets: Dataset[] }>("/api/pipeline-multimodal/datasets/");
}

export function crearDataset(payload: { name: string; description?: string }) {
  return request<Dataset>("/api/pipeline-multimodal/datasets/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function obtenerDataset(id: string) {
  return request<DatasetDetail>(
    `/api/pipeline-multimodal/datasets/${encodeURIComponent(id)}/`,
  );
}

export function crearMuestra(
  datasetId: string,
  payload: Omit<DatasetSample, "id" | "updated_at" | "reviewed">,
) {
  return request<DatasetSample>(
    `/api/pipeline-multimodal/datasets/${encodeURIComponent(datasetId)}/samples/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function actualizarMuestra(
  datasetId: string,
  sampleId: string,
  payload: Partial<Pick<DatasetSample, "features" | "labels" | "reviewed">>,
) {
  return request<DatasetSample>(
    `/api/pipeline-multimodal/datasets/${encodeURIComponent(datasetId)}/samples/${encodeURIComponent(sampleId)}/`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

export function exportarDataset(datasetId: string) {
  return request<ExportResult>(
    `/api/pipeline-multimodal/datasets/${encodeURIComponent(datasetId)}/export/`,
    {
      method: "POST",
    },
  );
}

export function autorizarDataset(datasetId: string) {
  return request<Dataset>(
    `/api/pipeline-multimodal/datasets/${encodeURIComponent(datasetId)}/authorize/`,
    {
      method: "POST",
    },
  );
}

export function listarVentanasAnotacion(sessionId: string) {
  return request<{ windows: AnnotationWindow[] }>(
    `/api/pipeline-multimodal/sessions/${encodeURIComponent(sessionId)}/annotation-windows/`,
  );
}

export function crearVentanaAnotacion(
  sessionId: string,
  payload: Omit<AnnotationWindow, "id" | "session_id" | "created_at">,
) {
  return request<AnnotationWindow>(
    `/api/pipeline-multimodal/sessions/${encodeURIComponent(sessionId)}/annotation-windows/`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function consultarArtefactosAnotacion(sessionId: string) {
  return request<{
    session_id: string;
    artifact_payload: Record<string, unknown>;
    pose_landmarks: unknown;
    training_authorized: boolean;
  }>(
    `/api/pipeline-multimodal/sessions/${encodeURIComponent(sessionId)}/artifacts/`,
  );
}

export function consultarLineageMlops(sessionId: string) {
  return request<MlopsLineage>(
    `/api/pipeline-multimodal/mlops/lineage/${encodeURIComponent(sessionId)}/`,
  );
}

export function listarModelosMlops() {
  return request<{
    models: Array<
      Omit<MlopsLineage, "estado"> & {
        run_id: string;
        name: string;
        version: string;
        experiment: string;
      }
    >;
  }>("/api/pipeline-multimodal/mlops/models/");
}
