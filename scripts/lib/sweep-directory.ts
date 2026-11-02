import { mkdirSync, existsSync, renameSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { plainParents } from "./release-files.ts";
import {
  readSweepFile,
  immutableSweepFile,
  sweepLease,
} from "./sweep-files.ts";
import {
  emptyCheckpoint,
  checkpointJson,
  validateCheckpoint,
  type SweepCheckpoint,
  type SweepRecord,
} from "../../src/modules/sweeps/checkpoint.ts";
import { sweepJobs } from "../../src/modules/sweeps/jobs.ts";
import type { SweepPlan } from "../../src/modules/sweeps/plan.ts";
import { sweepSummary } from "../../src/modules/sweeps/summary.ts";
export class SweepDirectory {
  folder: string;
  close: () => void;
  private constructor(folder: string, close: () => void) {
    this.folder = folder;
    this.close = close;
  }
  static async open(
    path: string,
    plan: SweepPlan,
    resume: boolean,
  ): Promise<SweepDirectory> {
    const folder = resolve(path);
    plainParents(folder);
    if (existsSync(folder) !== resume)
      throw Error(
        resume
          ? "Pasta para retomar não existe."
          : "Pasta já existe; use --resume para retomá-la.",
      );
    if (!existsSync(dirname(folder))) throw Error("Pasta pai deve existir.");
    if (!resume) mkdirSync(folder);
    const close = sweepLease(folder),
      store = new SweepDirectory(folder, close);
    try {
      const meta = checkpointJson(await emptyCheckpoint(plan)),
        file = join(folder, "varredura.json");
      if (resume && readSweepFile(file, 65536) !== meta)
        throw Error("Plano/versão incompatível com a pasta existente.");
      if (!resume) immutableSweepFile(file, meta);
      return store;
    } catch (e) {
      close();
      throw e;
    }
  }
  async load(plan: SweepPlan): Promise<SweepCheckpoint> {
    const c = await emptyCheckpoint(plan),
      jobs = await sweepJobs(plan),
      allowed = new Set(jobs.map((j) => j.id));
    for (const name of readdirSync(this.folder))
      if (/^v\d+-r\d+$/.test(name) && !allowed.has(name))
        throw Error("Execução alheia ao plano: " + name);
    for (const job of jobs) {
      const dir = join(this.folder, job.id);
      if (!existsSync(dir)) continue;
      c.results.push({
        id: job.id,
        result: {
          csv: readSweepFile(join(dir, "dados.csv")),
          manifest: readSweepFile(join(dir, "manifesto.json"), 32768),
        },
      });
    }
    return validateCheckpoint(c, plan, jobs);
  }
  save(record: SweepRecord): void {
    if (!/^v\d{3}-r\d{3}$/.test(record.id))
      throw Error("Identificador inválido.");
    const destination = join(this.folder, record.id);
    plainParents(destination);
    if (existsSync(destination))
      throw Error("Execução existente não será sobrescrita.");
    const temp = join(
      this.folder,
      ".partial-" + record.id + "-" + randomUUID(),
    );
    mkdirSync(temp);
    immutableSweepFile(join(temp, "dados.csv"), record.result.csv);
    immutableSweepFile(join(temp, "manifesto.json"), record.result.manifest);
    renameSync(temp, destination);
  }
  async partial(c: SweepCheckpoint): Promise<void> {
    immutableSweepFile(
      join(this.folder, `retomada-${c.results.length}.json`),
      checkpointJson(c),
    );
  }
  async finish(c: SweepCheckpoint): Promise<void> {
    immutableSweepFile(join(this.folder, "resumo.csv"), await sweepSummary(c));
    immutableSweepFile(join(this.folder, "retomada.json"), checkpointJson(c));
    immutableSweepFile(
      join(this.folder, "concluido.json"),
      JSON.stringify(
        {
          schema: "viveiro-sweep-completed-v1",
          id: c.id,
          modelVersion: c.modelVersion,
          total: c.plan.values.length * c.plan.replicates,
          completed: c.results.length,
          runs: c.results.map((r) => ({
            id: r.id,
            csvSha256: JSON.parse(r.result.manifest).csv.sha256,
          })),
        },
        null,
        2,
      ) + "\n",
    );
  }
}
