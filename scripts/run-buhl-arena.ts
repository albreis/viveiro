import { normalizeBuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";
import {
  describeBuhlLab,
  runBuhlLab,
} from "../src/modules/benchmarks/buhl-arena/run.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
import { readSweepJson } from "./lib/sweep-files.ts";

const usage = "Uso: node scripts/run-buhl-arena.ts PLANO.json";
try {
  const [file, ...extra] = process.argv.slice(2);
  if (file === "--help" && !extra.length) process.stdout.write(usage + "\n");
  else {
    if (!file || extra.length) throw Error(usage);
    const plan = normalizeBuhlLabPlan(readSweepJson(file));
    const sourceFingerprint = modelSourceFingerprint(process.cwd());
    const run = runBuhlLab(plan);
    process.stdout.write(
      JSON.stringify(
        {
          schema: "viveiro-buhl-arena-series-v1",
          ...describeBuhlLab(plan),
          sourceFingerprint,
          plan,
          runs: [run],
        },
        null,
        2,
      ) + "\n",
    );
  }
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
