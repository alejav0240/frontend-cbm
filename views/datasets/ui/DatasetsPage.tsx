"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Download, FilePlus2, Loader2, Plus, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { PermissionGuard } from "@/shared/ui/components/PermissionGuard";
import { DATASETS_PERMISSION } from "@/shared/data/permissions";
import {
  actualizarMuestra,
  autorizarDataset,
  crearDataset,
  crearMuestra,
  exportarDataset,
  listarDatasets,
  obtenerDataset,
  type Dataset,
  type DatasetDetail,
  type DatasetSample,
} from "@/shared/lib/datasets/api";

const FEATURE_FIELDS = [
  { key: "audio_rms_mean", label: "RMS medio del audio" },
  { key: "audio_zcr_mean", label: "Cruces por cero del audio" },
  { key: "visual_motion_mean", label: "Movimiento visual medio" },
  { key: "visual_motion_max", label: "Movimiento visual máximo" },
] as const;

const LABEL_GROUPS = [
  { name: "Audio", keys: ["audio__HABLA", "audio__LLANTO", "audio__RISA", "audio__GRITO", "audio__SILENCIO", "audio__ACTIVIDAD_MUSICAL"] },
  { name: "Visual", keys: ["visual__MOVIMIENTO", "visual__MOVIMIENTO_REPETITIVO", "visual__CONTACTO_VISUAL", "visual__INTERACCION_OBJETO", "visual__ORIENTACION_CORPORAL"] },
  { name: "Interacción", keys: ["interaction__MIRADA", "interaction__GESTO", "interaction__TACTO", "interaction__IMITACION", "interaction__RESPUESTA", "interaction__ACTIVIDAD_CONJUNTA", "interaction__INTERACCION_MUSICAL", "interaction__INTERACCION_VERBAL"] },
] as const;
const LABEL_FIELDS = LABEL_GROUPS.flatMap(({ keys }) => keys);

type SampleDraft = {
  session_id: string;
  window_id: string;
  features: Record<string, string>;
  labels: Record<string, number>;
  reviewed: boolean;
};

const emptyDraft = (): SampleDraft => ({
  session_id: "",
  window_id: "",
  features: Object.fromEntries(FEATURE_FIELDS.map(({ key }) => [key, ""])),
  labels: Object.fromEntries(LABEL_FIELDS.map((key) => [key, 0])),
  reviewed: false,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-BO", { dateStyle: "medium" }).format(new Date(value));
}

function normalizeDraft(sample: DatasetSample): SampleDraft {
  return {
    session_id: sample.session_id,
    window_id: sample.window_id,
    features: Object.fromEntries(FEATURE_FIELDS.map(({ key }) => [key, String(sample.features[key] ?? "")])),
    labels: Object.fromEntries(LABEL_FIELDS.map((key) => [key, sample.labels[key] ? 1 : 0])),
    reviewed: sample.reviewed,
  };
}

export function DatasetsPage() {
  return (
    <PermissionGuard
      permission={DATASETS_PERMISSION}
      fallback={<AccessDenied />}
    >
      <DatasetBuilder />
    </PermissionGuard>
  );
}

function AccessDenied() {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900/60 dark:bg-amber-950/20">
      <ShieldCheck className="mx-auto mb-3 text-amber-600" size={34} />
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Acceso restringido</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Necesitás el permiso ml:view para administrar datasets.</p>
    </section>
  );
}

function DatasetBuilder() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DatasetDetail | null>(null);
  const [draft, setDraft] = useState<SampleDraft>(emptyDraft);
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<Awaited<ReturnType<typeof exportarDataset>> | null>(null);

  const loadDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listarDatasets();
      setDatasets(response.datasets);
      setSelectedId((current) => current && response.datasets.some((dataset) => dataset.id === current) ? current : response.datasets[0]?.id ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar tus datasets.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    setError(null);
    try {
      setDetail(await obtenerDataset(id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el dataset.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadDatasets(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadDatasets]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (selectedId) void loadDetail(selectedId);
      else setDetail(null);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadDetail, selectedId]);

  const reviewedCount = useMemo(() => detail?.samples.filter((sample) => sample.reviewed).length ?? 0, [detail]);

  async function handleCreateDataset(event: FormEvent) {
    event.preventDefault();
    if (!datasetName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const created = await crearDataset({ name: datasetName.trim(), description: datasetDescription.trim() || undefined });
      setDatasetName("");
      setDatasetDescription("");
      await loadDatasets();
      setSelectedId(created.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el dataset.");
    } finally { setSaving(false); }
  }

  function updateFeature(key: string, value: string) {
    setDraft((current) => ({ ...current, features: { ...current.features, [key]: value } }));
  }

  function updateLabel(key: string, checked: boolean) {
    setDraft((current) => ({ ...current, labels: { ...current.labels, [key]: checked ? 1 : 0 } }));
  }

  async function handleSampleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !draft.session_id.trim() || !draft.window_id.trim()) return;
    const features = Object.fromEntries(FEATURE_FIELDS.map(({ key }) => [key, Number(draft.features[key])])) as Record<string, number>;
    if (Object.values(features).some((value) => !Number.isFinite(value))) {
      setError("Las cuatro features deben ser números finitos.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { features, labels: draft.labels };
      if (editingId) await actualizarMuestra(selectedId, editingId, { ...payload, reviewed: draft.reviewed });
      else await crearMuestra(selectedId, { session_id: draft.session_id.trim(), window_id: draft.window_id.trim(), ...payload });
      setDraft(emptyDraft());
      setEditingId(null);
      await Promise.all([loadDetail(selectedId), loadDatasets()]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar la muestra.");
    } finally { setSaving(false); }
  }

  async function handleExport() {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    try { setExportResult(await exportarDataset(selectedId)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo exportar el dataset."); }
    finally { setSaving(false); }
  }

  async function handleAuthorize() {
    if (!selectedId || !detail?.can_authorize) return;
    setSaving(true);
    setError(null);
    try {
      const authorized = await autorizarDataset(selectedId);
      setDetail((current) => current ? { ...current, dataset: authorized } : current);
      await loadDatasets();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo autorizar el dataset.");
    } finally { setSaving(false); }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">Herramientas ML</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Mis datasets</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Armá, revisá y exportá muestras para el pipeline multimodal.</p>
        </div>
        <button type="button" onClick={() => void loadDatasets()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          <RefreshCw size={16} /> Actualizar
        </button>
      </header>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,2fr)]">
        <aside className="space-y-4">
          <form onSubmit={handleCreateDataset} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><FilePlus2 size={18} className="text-teal-600" /> Nuevo dataset</h2>
            <input value={datasetName} onChange={(event) => setDatasetName(event.target.value)} placeholder="Nombre del dataset" aria-label="Nombre del dataset" className="mt-4 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2 dark:border-slate-700" />
            <textarea value={datasetDescription} onChange={(event) => setDatasetDescription(event.target.value)} placeholder="Descripción (opcional)" aria-label="Descripción del dataset" rows={3} className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2 dark:border-slate-700" />
            <button disabled={saving || !datasetName.trim()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} /> Crear dataset</button>
          </form>
          <div className="space-y-2">
            {datasets.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">Todavía no creaste datasets.</div> : datasets.map((dataset) => (
              <button key={dataset.id} type="button" onClick={() => { setSelectedId(dataset.id); setEditingId(null); setDraft(emptyDraft()); setExportResult(null); }} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === dataset.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30" : "border-slate-200 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900"}`}>
                <div className="flex items-start justify-between gap-2"><span className="font-semibold text-slate-900 dark:text-white">{dataset.name}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">{dataset.status}</span></div>
                <p className="mt-2 text-xs text-slate-500">{dataset.sample_count} muestras · {dataset.reviewed_count} revisadas</p>
              </button>
            ))}
          </div>
        </aside>

        {!detail ? <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"><div><p className="font-semibold text-slate-800 dark:text-white">Elegí un dataset para comenzar</p><p className="mt-2 text-sm text-slate-500">Tus datasets son privados y solo vos podés editarlos.</p></div></div> : <main className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{detail.dataset.name}</h2><p className="mt-1 text-sm text-slate-500">{detail.dataset.description || "Sin descripción"} · Actualizado {formatDate(detail.dataset.updated_at)}</p><p className="mt-3 text-xs font-semibold text-teal-700 dark:text-teal-300">{reviewedCount} de {detail.samples.length} muestras revisadas</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={saving} onClick={() => void handleExport()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 disabled:opacity-50 dark:border-teal-800 dark:text-teal-200 dark:hover:bg-teal-950/30"><Download size={16} /> Exportar</button>{detail.can_authorize && !detail.dataset.training_authorized && <button type="button" disabled={saving || detail.samples.length === 0 || reviewedCount !== detail.samples.length} onClick={() => void handleAuthorize()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"><ShieldCheck size={16} /> Autorizar entrenamiento</button>}</div></div>{exportResult && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">Exportación lista: {exportResult.rows} filas · SHA-256 <code>{exportResult.sha256}</code>{exportResult.mlflow.status === "tracked" ? <span className="ml-2">· MLflow run <code>{exportResult.mlflow.run_id}</code></span> : <span className="ml-2">· MLflow no disponible</span>}{exportResult.download_url && <a className="ml-2 font-semibold underline" href={exportResult.download_url} target="_blank" rel="noreferrer">Descargar CSV</a>}</div>}</section>
          <SampleForm draft={draft} editingId={editingId} saving={saving} onSubmit={handleSampleSubmit} onChange={setDraft} onFeatureChange={updateFeature} onLabelChange={updateLabel} onCancel={() => { setDraft(emptyDraft()); setEditingId(null); }} />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="font-semibold text-slate-900 dark:text-white">Muestras del dataset</h2>{detail.samples.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">Este dataset todavía no tiene muestras.</p> : <div className="mt-4 space-y-3">{detail.samples.map((sample) => <button key={sample.id} type="button" onClick={() => { setEditingId(sample.id); setDraft(normalizeDraft(sample)); }} className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-teal-400 dark:border-slate-700"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium text-slate-900 dark:text-white">Sesión {sample.session_id} · Ventana {sample.window_id}</span><span className={`rounded-full px-2 py-1 text-xs font-semibold ${sample.reviewed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{sample.reviewed ? "Revisada" : "Pendiente"}</span></div><div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">{FEATURE_FIELDS.map(({ key, label }) => <span key={key} className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">{label}: {sample.features[key] ?? "—"}</span>)}</div><p className="mt-2 text-xs text-slate-500">Etiquetas: {Object.entries(sample.labels).filter(([, value]) => value === 1).map(([key]) => key.replace(/^(audio|visual|interaction)__/, "")).join(", ") || "—"}</p></button>)}</div>}</section>
        </main>}
      </div>
    </div>
  );
}

function SampleForm({ draft, editingId, saving, onSubmit, onChange, onFeatureChange, onLabelChange, onCancel }: { draft: SampleDraft; editingId: string | null; saving: boolean; onSubmit: (event: FormEvent) => void; onChange: (draft: SampleDraft) => void; onFeatureChange: (key: string, value: string) => void; onLabelChange: (key: string, checked: boolean) => void; onCancel: () => void }) {
  return <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-900 dark:text-white">{editingId ? "Editar muestra" : "Agregar muestra"}</h2><p className="mt-1 text-xs text-slate-500">Completá las features numéricas y marcá las etiquetas observadas.</p></div>{editingId && <button type="button" onClick={onCancel} className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">Cancelar edición</button>}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><input required value={draft.session_id} onChange={(event) => onChange({ ...draft, session_id: event.target.value })} placeholder="ID de sesión" aria-label="ID de sesión" className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700" /><input required value={draft.window_id} onChange={(event) => onChange({ ...draft, window_id: event.target.value })} placeholder="ID de ventana" aria-label="ID de ventana" className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700" /></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{FEATURE_FIELDS.map(({ key, label }) => <label key={key} className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}<input required type="number" step="any" value={draft.features[key]} onChange={(event) => onFeatureChange(key, event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm font-normal dark:border-slate-700" /></label>)}</div><div className="mt-4 grid gap-4 md:grid-cols-3">{LABEL_GROUPS.map(({ name, keys }) => <fieldset key={name} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><legend className="px-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{name}</legend>{keys.map((key) => <label key={key} className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><input type="checkbox" checked={draft.labels[key] === 1} onChange={(event) => onLabelChange(key, event.target.checked)} className="size-4 accent-teal-700" /> {key.split("__")[1].replaceAll("_", " ")}</label>)}</fieldset>)}</div><label className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"><input type="checkbox" checked={draft.reviewed} onChange={(event) => onChange({ ...draft, reviewed: event.target.checked })} className="size-4 accent-teal-700" /> Marcar como revisada</label><button disabled={saving} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-teal-700 dark:hover:bg-teal-800"><Save size={16} /> {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Agregar muestra"}</button></form>;
}

function LoadingState() { return <div className="flex min-h-[420px] items-center justify-center"><div className="text-center"><Loader2 className="mx-auto animate-spin text-teal-700" size={30} /><p className="mt-3 text-sm text-slate-500">Cargando tus datasets…</p></div></div>; }
