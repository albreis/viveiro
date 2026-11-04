// args: root out seed workers hours exponent crowding
const [root, out, seed, workers, hours, n, c] = process.argv.slice(2);
const { runDigging } = await import(root + "/src/modules/benchmarks/digging-run.ts");
const { writeFileSync } = await import("node:fs");
const run = runDigging({ seed, workers: +workers, days: 1, ticks: +hours * 3600, sampleEvery: 600,
  setup: { mode: "estigmergia", workersOnly: true, insideNest: true, freezeDaily: true, noPredators: true,
    stigmergy: { crowdingExponent: +n, crowding: +c } } });
writeFileSync(out, JSON.stringify(run));
