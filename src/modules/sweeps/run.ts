import { normalizeSweep } from "./plan.ts";
import { sweepJobs, type SweepJob } from "./jobs.ts";
import {
  emptyCheckpoint,
  validateCheckpoint,
  validateRecord,
  type SweepCheckpoint,
  type SweepRecord,
} from "./checkpoint.ts";
import type { ExperimentResult } from "../experiments/result.ts";
export interface SweepOptions {
  concurrency: number;
  maxNewRuns?: number;
  signal?: AbortSignal;
  checkpoint?: unknown;
  execute(job: SweepJob, signal: AbortSignal): Promise<ExperimentResult>;
  completed?(record: SweepRecord): Promise<void> | void;
  progress?(checkpoint: SweepCheckpoint): void;
}
/** Completion is committed before progress. Scheduling never changes seeds or ticks. */
export async function runSweep(
  value: unknown,
  options: SweepOptions,
): Promise<SweepCheckpoint> {
  if (
    !Number.isInteger(options.concurrency) ||
    options.concurrency < 1 ||
    options.concurrency > 8
  )
    throw Error("Use 1–8 execuções paralelas.");
  if (
    options.maxNewRuns !== undefined &&
    (!Number.isInteger(options.maxNewRuns) ||
      options.maxNewRuns < 1 ||
      options.maxNewRuns > 1000)
  )
    throw Error("Limite deve ser de 1 a 1.000 execuções novas.");
  const plan = normalizeSweep(value),
    jobs = await sweepJobs(plan);
  const c =
    options.checkpoint === undefined
      ? await emptyCheckpoint(plan)
      : await validateCheckpoint(options.checkpoint, plan, jobs);
  const records = new Map(c.results.map((r) => [r.id, r])),
    pending = jobs
      .filter((j) => !records.has(j.id))
      .slice(0, options.maxNewRuns);
  const controller = new AbortController(),
    abort = () => controller.abort();
  if (options.signal?.aborted) abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  let next = 0,
    failure: unknown;
  const snapshot = () => ({
    ...c,
    results: jobs.flatMap((j) =>
      records.has(j.id) ? [records.get(j.id)!] : [],
    ),
  });
  options.progress?.(snapshot());
  async function slot() {
    while (!controller.signal.aborted && next < pending.length) {
      const job = pending[next++];
      try {
        const result = await options.execute(job, controller.signal);
        if (controller.signal.aborted) break;
        const record = await validateRecord({ id: job.id, result }, job);
        await options.completed?.(record);
        records.set(job.id, record);
        options.progress?.(snapshot());
      } catch (e) {
        if (!controller.signal.aborted) {
          failure = e;
          controller.abort();
        }
      }
    }
  }
  try {
    await Promise.all(
      Array.from(
        { length: Math.min(options.concurrency, pending.length) },
        slot,
      ),
    );
    if (failure) throw failure;
    if (controller.signal.aborted)
      throw new DOMException(
        "Varredura interrompida; execuções concluídas foram preservadas.",
        "AbortError",
      );
    return snapshot();
  } finally {
    options.signal?.removeEventListener("abort", abort);
  }
}
