import { writeFileSync, mkdirSync } from "node:fs";
import { World } from "../src/modules/simulation/world.js";
import { evaluateSnapshot } from "../src/modules/forecast/evaluate-snapshot.ts";
import { summarizeErrors } from "../src/modules/forecast/evaluation-metrics.ts";
const manifest = {
  version: 1,
  modelVersion: "0.17.0",
  seeds: ["EVAL-VIVEIRO-01", "EVAL-VIVEIRO-02", "EVAL-VIVEIRO-03"],
  origins: [300, 600],
  horizons: [1, 3, 7],
  runs: 6,
  startMode: "established",
  params: {
    humidity: 58,
    light: 72,
    randomness: 28,
    temperatureC: 24,
    reposeAngle: 36,
  },
  futureInterventions: [],
  notes:
    "Synthetic paired origins; same-seed origins are correlated. No biological calibration. Partial method sees only perfect adult census and previous counts.",
};
const start = performance.now(),
  rows = [];
for (const seed of manifest.seeds) {
  const world = new World(seed, manifest.params, { founding: false });
  for (const origin of manifest.origins) {
    world.step(origin - world.tick);
    console.log(seed + " origin " + origin);
    rows.push(
      ...(await evaluateSnapshot(
        world.snapshot(),
        { horizons: manifest.horizons, runs: manifest.runs, budgetMs: 120000 },
        {
          cancelled: () => false,
          progress: () => {},
          pause: () => new Promise((resolve) => setTimeout(resolve, 0)),
        },
      )),
    );
  }
}
const report = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  runtime: {
    node: process.version,
    platform: process.platform,
    elapsedMs: performance.now() - start,
  },
  summary: summarizeErrors(rows),
  rows,
};
mkdirSync("public/benchmarks", { recursive: true });
writeFileSync(
  "public/benchmarks/previsoes-v1.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    elapsedMs: report.runtime.elapsedMs,
    summary: report.summary,
  }),
);
