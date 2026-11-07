import { runTerrariumStudyBaseline } from "../src/modules/benchmarks/terrarium-study/baseline.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
const [seed = "BUHL-WORLD-PILOTO", workers = "50", ticks = "100", ...extra] =
  process.argv.slice(2);
if (extra.length)
  throw Error("Uso: node scripts/run-terrarium-study.ts SEED OPERARIAS PASSOS");
const result = runTerrariumStudyBaseline(seed, Number(workers), Number(ticks));
process.stdout.write(
  JSON.stringify(
    { sourceFingerprint: modelSourceFingerprint(process.cwd()), ...result },
    null,
    2,
  ) + "\n",
);
