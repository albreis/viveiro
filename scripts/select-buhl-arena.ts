import { createHash } from "node:crypto";
import { join } from "node:path";
import { BUHL_GROUPS } from "../src/modules/benchmarks/buhl-2005-data.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
import { plansForBuhlLab } from "./lib/buhl-lab-plans.ts";
import { readSweepFile, readSweepJson } from "./lib/sweep-files.ts";

const ids = ["follow-035", "follow-060", "recruit-020"] as const;
const horizon = 43200;
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

interface Measurement {
  seed: string;
  workers: number;
  samples: { timeSeconds: number; voidVolumeCm3: number }[];
}

function evaluate(root: string, id: (typeof ids)[number]) {
  const config = readSweepJson(
    join("docs/validacoes", "buhl-ajuste-" + id + ".json"),
  ) as {
    groups: number[];
    settings: Record<string, unknown>;
  };
  const plans = plansForBuhlLab(config);
  const folder = join(root, "buhl-ajuste-" + id);
  const manifest = readSweepJson(join(folder, "plano.json")) as {
    sourceFingerprint: string;
    plans: unknown;
  };
  const raw = readSweepFile(join(folder, "series.json"), 8 * 1024 * 1024);
  const series = JSON.parse(raw) as {
    sourceFingerprint: string;
    mechanism: string;
    contactAccess: number;
    schema: string;
    secondsPerTick: number;
    timeUnit: string;
    volumeUnit: string;
    runs: Measurement[];
  };
  if (
    JSON.stringify(manifest.plans) !== JSON.stringify(plans) ||
    manifest.sourceFingerprint !== series.sourceFingerprint ||
    series.mechanism !== plans[0].mechanism ||
    series.contactAccess !== plans[0].contactAccess ||
    series.schema !== "viveiro-buhl-arena-series-v1" ||
    series.secondsPerTick !== plans[0].tickMilliseconds / 1000 ||
    series.timeUnit !== "s" ||
    series.volumeUnit !== "cm3" ||
    !Array.isArray(series.runs) ||
    series.runs.length !== plans.length
  )
    throw Error("Série incompatível com o plano fixado: " + id);
  const readings = series.runs.map((run, i) => {
    const expected = plans[i];
    const last = run.samples?.at(-1);
    if (
      run.seed !== expected.seed ||
      run.workers !== expected.workers ||
      last?.timeSeconds !== horizon ||
      !Number.isFinite(last.voidVolumeCm3) ||
      last.voidVolumeCm3 < 0
    )
      throw Error("Amostra de 12 horas inválida: " + id);
    return { seed: run.seed, workers: run.workers, cm3: last.voidVolumeCm3 };
  });
  const groups = BUHL_GROUPS.map((reference) => {
    const runs = readings.filter((x) => x.workers === reference.workers);
    if (runs.length !== 5) throw Error("Esperadas cinco seeds por grupo.");
    const mean = runs.reduce((a, x) => a + x.cm3, 0) / runs.length;
    return {
      workers: reference.workers,
      simulatedMeanCm3: mean,
      readCm3: reference.curveCm3[1],
      relativeError:
        Math.abs(mean - reference.curveCm3[1]) / reference.curveCm3[1],
      runs,
    };
  });
  return {
    id,
    config,
    sourceFingerprint: series.sourceFingerprint,
    seriesSha256: sha(raw),
    groups,
    score:
      groups.reduce((a, group) => a + group.relativeError, 0) / groups.length,
  };
}

try {
  const [root, ...extra] = process.argv.slice(2);
  if (!root || extra.length)
    throw Error("Uso: node scripts/select-buhl-arena.ts PASTA-DOS-LOTES");
  const candidates = ids.map((id) => evaluate(root, id));
  if (new Set(candidates.map((x) => x.sourceFingerprint)).size !== 1)
    throw Error("Os candidatos usaram fontes diferentes.");
  if (candidates[0].sourceFingerprint !== modelSourceFingerprint(process.cwd()))
    throw Error("Use a fonte das rodadas para congelar o plano reservado.");
  const selected = candidates.reduce((best, next) =>
    next.score < best.score ? next : best,
  );
  const partitions = readSweepJson(
    "docs/validacoes/buhl-arena-particoes.json",
  ) as {
    checagemReservadaDoSimulador: string[];
  };
  const reservedPlan = {
    groups: selected.config.groups,
    seeds: partitions.checagemReservadaDoSimulador,
    settings: { ...selected.config.settings, durationSeconds: 259200 },
  };
  const selectedSeeds = new Set(
    selected.groups.flatMap((g) => g.runs.map((r) => r.seed)),
  );
  if (
    reservedPlan.seeds.length !== 5 ||
    reservedPlan.seeds.some((seed) => selectedSeeds.has(seed))
  )
    throw Error(
      "Seeds reservadas devem ser cinco e distintas das seeds de ajuste.",
    );
  plansForBuhlLab(reservedPlan);
  process.stdout.write(
    JSON.stringify(
      {
        schema: "viveiro-buhl-selecao-12h-v1",
        timeSeconds: horizon,
        calibrated: false,
        candidates,
        selected: selected.id,
        reservedPlan,
      },
      null,
      2,
    ) + "\n",
  );
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
