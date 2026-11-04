import { prepareDiggingWorld } from "/home/user/viveiro/src/modules/benchmarks/digging-run.ts";
const [n, seed] = [Number(process.argv[2]), process.argv[3]];
const w = prepareDiggingWorld(seed, n, { mode: "estigmergia", workersOnly: true, insideNest: true });
const r0 = w.soil.removed;
for (let t = 1; t <= 2000; t++) { w.step(); if (t % 400 === 0) { const fr = w.soil.projects.reduce((a,p)=>a+p.excavated,0); console.log(n, seed, t, "total", (w.soil.removed-r0).toFixed(3), "fronts", fr.toFixed(3), "widen", (w.soil.removed-r0-fr).toFixed(3)); } }
