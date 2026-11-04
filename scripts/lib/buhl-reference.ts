import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readCsv } from "../../src/libs/csv-reader.ts";
import type { DiggingRun } from "../../src/modules/benchmarks/digging-run.ts";
import { readSweepJson } from "./sweep-files.ts";

const archive = new URL(
  "../../docs/validacoes/anexos-buhl/resultados/rt24b/serie.csv",
  import.meta.url,
);
const groups = [50, 100, 200] as const;
const end = 86_400;
const step = 600;
const fields = {
  removed: "volume_removido_u3",
  traffic: "volume_transito_u3",
  workers: "operarias",
  activeProjects: "frentes_ativas",
  nestNodes: "nos_do_ninho",
} as const;
const sha256 = (text: string) =>
  createHash("sha256").update(text).digest("hex");

function verifyPlan(folder: string) {
  const plan = readSweepJson(join(folder, "plano.json")) as {
    schema?: string;
    sourceFingerprint?: string;
    config?: {
      days?: number;
      seeds?: number;
      groups?: number[];
      sampleEvery?: number;
      mode?: string;
      protocol?: string;
      idle?: string;
      realTime?: { hours: number; secondsPerTick: number; ticks: number };
      firstSeed?: number;
      brake?: object;
    };
  };
  const config = plan?.config;
  if (
    plan?.schema !== "viveiro-buhl-plano-v1" ||
    !/^[a-f0-9]{64}$/.test(plan.sourceFingerprint ?? "") ||
    !config ||
    config.days !== 3 ||
    config.seeds !== 1 ||
    JSON.stringify(config.groups) !== JSON.stringify(groups) ||
    config.sampleEvery !== step ||
    config.mode !== "estigmergia" ||
    config.protocol !== "grupo-fixo" ||
    config.idle !== "original" ||
    config.realTime?.hours !== 24 ||
    config.realTime?.secondsPerTick !== 1 ||
    config.realTime?.ticks !== end ||
    config.firstSeed !== 1 ||
    !config.brake ||
    typeof config.brake !== "object" ||
    Array.isArray(config.brake) ||
    Object.keys(config.brake).length !== 0
  )
    throw Error("O plano não corresponde à referência rt24b.");
  return plan.sourceFingerprint!;
}

export function compareBuhlReference(folder: string) {
  const sourceFingerprint = verifyPlan(folder);
  // The same archived CSV may be checked out as LF or CRLF.
  const archivedText = readFileSync(archive, "utf8").replaceAll("\r\n", "\n");
  const [header, ...rows] = readCsv(archivedText);
  const column = (name: string) => {
    const i = header.indexOf(name);
    if (i < 0) throw Error("Coluna ausente na referência: " + name);
    return i;
  };
  const groupColumn = column("operarias_iniciais");
  const tickColumn = column("tick");
  const seedColumn = column("semente");
  const columns = Object.entries(fields).map(
    ([field, name]) => [field as keyof typeof fields, column(name)] as const,
  );
  const results = groups.map((workers) => {
    const path = join(folder, "BUHL-1-" + workers + ".json");
    if (!existsSync(path)) return { workers, status: "pending" as const };
    const record = readSweepJson(path, 256 * 1024) as {
      run: DiggingRun;
      sha256: string;
    };
    const expected = rows.filter((row) => Number(row[groupColumn]) === workers);
    const { run } = record;
    if (
      run?.seed !== "BUHL-1" ||
      run.workers !== workers ||
      run.days !== 3 ||
      !Array.isArray(run.samples) ||
      run.samples.length !== end / step + 1 ||
      expected.length !== run.samples.length ||
      record.sha256 !== sha256(JSON.stringify(run))
    )
      throw Error("Registro inválido no grupo de " + workers);
    let differentSamples = 0;
    let firstDifference: { tick: number; fields: string[] } | null = null;
    for (const [index, actual] of run.samples.entries()) {
      const row = expected[index];
      if (
        actual.tick !== index * step ||
        row[seedColumn] !== run.seed ||
        Number(row[tickColumn]) !== actual.tick
      )
        throw Error("Ticks inesperados no grupo de " + workers);
      const differences = columns
        .filter(([field, i]) => {
          const historical = Number(row[i]);
          if (
            !row[i] ||
            !Number.isFinite(historical) ||
            !Number.isFinite(actual[field])
          )
            throw Error("Medição inválida no tick " + actual.tick);
          return historical !== actual[field];
        })
        .map(([field]) => field);
      if (differences.length) {
        differentSamples++;
        firstDifference ??= { tick: actual.tick, fields: differences };
      }
    }
    return {
      workers,
      status: differentSamples
        ? ("different" as const)
        : ("identical" as const),
      samples: run.samples.length,
      differentSamples,
      firstDifference,
      historicalFinalVolume: Number(expected.at(-1)![column(fields.removed)]),
      finalVolume: run.samples.at(-1)!.removed,
      runSha256: record.sha256,
    };
  });
  return {
    schema: "viveiro-buhl-rt24b-comparacao-v1",
    sourceFingerprint,
    archivedSeriesSha256: sha256(archivedText),
    results,
  };
}
