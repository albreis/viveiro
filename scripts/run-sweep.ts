import { sweepArgs } from "./lib/sweep-args.ts";
import { readSweepJson } from "./lib/sweep-files.ts";
import { SweepDirectory } from "./lib/sweep-directory.ts";
import { runExperimentProcess } from "./lib/experiment-process.ts";
import { exampleSweep, normalizeSweep } from "../src/modules/sweeps/plan.ts";
import { sweepJobs } from "../src/modules/sweeps/jobs.ts";
import {
  validateCheckpoint,
  type SweepCheckpoint,
} from "../src/modules/sweeps/checkpoint.ts";
import { runSweep } from "../src/modules/sweeps/run.ts";
const usage = `Viveiro · varreduras reproduzíveis (Node24)
Uso: npm run sweep -- --out resultado-novo --jobs 2
Ou: npm run sweep -- --plan varredura.json --out resultado-novo --jobs 4
Retomar: repita com --resume e a mesma configuração; execuções concluídas são verificadas.
Importar retomada do navegador: --checkpoint retomada.json --out resultado-novo
Sem --plan: umidade [40,50,60,70,80] × 10 réplicas, 1 dia, ninho estabelecido.
--limit N conclui só N execuções novas por chamada, para retomadas programadas.
Ctrl+C encerra os Workers e preserva os resultados concluídos. Modelo exploratório.
`;
let store: SweepDirectory | undefined;
const controller = new AbortController(),
  stop = () => controller.abort();
try {
  const a = sweepArgs(process.argv.slice(2));
  if (a.help) process.stdout.write(usage);
  else {
    const imported = (
      a.checkpoint ? readSweepJson(a.checkpoint, 64 * 1024 * 1024) : undefined
    ) as { plan?: unknown } | undefined;
    const plan = normalizeSweep(
      a.plan
        ? readSweepJson(a.plan, 65536)
        : (imported?.plan ?? exampleSweep()),
    );
    const jobs = await sweepJobs(plan);
    let initial: SweepCheckpoint | undefined;
    if (imported) initial = await validateCheckpoint(imported, plan, jobs);
    store = await SweepDirectory.open(a.out, plan, a.resume);
    if (initial) for (const r of initial.results) store.save(r);
    const saved = await store.load(plan);
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    const result = await runSweep(plan, {
      concurrency: a.jobs,
      maxNewRuns: a.limit,
      signal: controller.signal,
      checkpoint: saved,
      execute: (job, signal) => runExperimentProcess(job.plan, { signal }),
      completed: (r) => store!.save(r),
      progress: (c) =>
        process.stdout.write(
          JSON.stringify({ completed: c.results.length, total: jobs.length }) +
            "\n",
        ),
    });
    const completed = result.results.length === jobs.length;
    if (completed) await store.finish(result);
    else await store.partial(result);
    process.stdout.write(
      JSON.stringify({
        status: completed ? "completed" : "partial",
        runs: result.results.length,
        id: result.id,
        output: store.folder,
      }) + "\n",
    );
  }
} catch (e) {
  process.stderr.write((e instanceof Error ? e.message : String(e)) + "\n");
  process.exitCode = controller.signal.aborted ? 130 : 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
  store?.close();
}
