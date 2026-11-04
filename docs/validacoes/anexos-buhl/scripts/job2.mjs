// args: root out seed workers hours exponent crowding ; writes partial results every hour
const [root, out, seed, workers, hours, n, c] = process.argv.slice(2);
const { prepareDiggingWorld, holdDaily } = await import(root + "/src/modules/benchmarks/digging-run.ts");
const { writeFileSync } = await import("node:fs");
const w = prepareDiggingWorld(seed, +workers, { mode: "estigmergia", workersOnly: true, insideNest: true, freezeDaily: true, noPredators: true, stigmergy: { crowdingExponent: +n, crowding: +c } });
const held = new Map(w.ants.map(a => [a.id, { age: a.age, energy: a.energy }]));
const start = w.soil.removed, total = +hours * 3600, samples = [];
const t0 = Date.now();
while (w.tick < total) {
  w.step(); holdDaily(w, held); w.predators.length = 0;
  if (w.tick % 600 === 0) samples.push({ tick: w.tick, removed: w.soil.removed - start, workers: w.ants.length, nodes: w.nest.nodes.length });
  if (w.tick % 3600 === 0) writeFileSync(out, JSON.stringify({ seed, workers: +workers, n: +n, c: +c, done: w.tick >= total, secs: (Date.now()-t0)/1000, samples }));
}
