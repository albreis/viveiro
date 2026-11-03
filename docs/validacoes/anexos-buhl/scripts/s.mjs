import { runDigging } from "/home/user/viveiro/src/modules/benchmarks/digging-run.ts";
import { compareWithBuhl } from "/home/user/viveiro/src/modules/benchmarks/digging-compare.ts";
const days = Number(process.argv[2]); const workersOnly = process.argv[3] === "1";
const st = JSON.parse(process.argv[4] || "{}");
const runs = []; const t0 = Date.now();
for (const n of [50, 100, 200]) {
  const r = runDigging({ seed: process.argv[6] || "BUHL-1", workers: n, days, sampleEvery: 5, setup: { mode: process.argv[5] || "estigmergia", workersOnly, insideNest: true, stigmergy: st } });
  runs.push(r);
  const pick = r.samples.filter((_, i, a) => i % Math.ceil(a.length / 6) === 0 || i === a.length - 1).map(s => [s.tick, +s.removed.toFixed(3), s.workers, s.activeProjects, s.nestNodes]);
  console.log(n, JSON.stringify(pick));
}
const c = compareWithBuhl(runs);
for (const x of c.criteria) console.log(x.passed ? "OK " : "FAIL", x.id, x.model);
console.log("ms", Date.now() - t0);
