export async function modelPool<T, R>(
  jobs: T[],
  concurrency: number,
  run: (job: T, signal: AbortSignal) => Promise<R>,
  signal?: AbortSignal,
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8)
    throw Error("Use de 1 a 8 Workers.");
  const controller = new AbortController(),
    abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const results: R[] = new Array(jobs.length);
  let cursor = 0,
    failure: unknown;
  async function slot() {
    while (cursor < jobs.length && !controller.signal.aborted) {
      const i = cursor++;
      try {
        results[i] = await run(jobs[i], controller.signal);
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
      Array.from({ length: Math.min(concurrency, jobs.length) }, slot),
    );
    if (failure) throw failure;
    if (controller.signal.aborted)
      throw new DOMException(
        "Cálculo interrompido; arquivos completos preservados.",
        "AbortError",
      );
    return results;
  } finally {
    signal?.removeEventListener("abort", abort);
  }
}
