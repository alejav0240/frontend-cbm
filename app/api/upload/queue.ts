import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import { join } from "path";
import type { UploadMetadata } from "./lib";

export type JobStatus = "pending" | "processing" | "failed";

export type PendingJob = {
  id: string;
  file: string;
  sessionId: string;
  metadata: UploadMetadata;
  attempts: number;
  nextAttemptAt: number;
  status: JobStatus;
  createdAt: string;
  processingStartedAt?: number;
  lastError?: string;
};

const QUEUE_DIR = join(process.cwd(), "uploads", "pending");

export const getQueueDir = () => QUEUE_DIR;

const jobFilePath = (id: string) => join(QUEUE_DIR, `${id}.json`);

export const ensureQueueDir = async () => {
  await mkdir(QUEUE_DIR, { recursive: true });
};

export const enqueueJob = async (job: PendingJob) => {
  await ensureQueueDir();
  await writeFile(jobFilePath(job.id), JSON.stringify(job, null, 2), "utf8");
};

export const listJobs = async (): Promise<PendingJob[]> => {
  await ensureQueueDir();
  const entries = await readdir(QUEUE_DIR);
  const jobs: PendingJob[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    try {
      const raw = await readFile(join(QUEUE_DIR, entry), "utf8");
      jobs.push(JSON.parse(raw) as PendingJob);
    } catch (error) {
      console.error("Error leyendo job:", entry, error);
    }
  }
  return jobs;
};

export const getJob = async (id: string): Promise<PendingJob | null> => {
  try {
    const raw = await readFile(jobFilePath(id), "utf8");
    return JSON.parse(raw) as PendingJob;
  } catch {
    return null;
  }
};

export const deleteJob = async (id: string) => {
  try {
    await rm(jobFilePath(id), { force: true });
  } catch {}
};

export const deleteJobFile = async (job: PendingJob) => {
  try {
    await rm(job.file, { force: true });
  } catch {}
};
