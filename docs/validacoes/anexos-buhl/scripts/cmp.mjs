const { runDigging } = await import(process.argv[2] + "/src/modules/benchmarks/digging-run.ts");
for (const mode of ["projetos","estigmergia"]) {
  const r = runDigging({ seed: "BUHL-2", workers: 100, days: 3, sampleEvery: 50, setup: { mode, workersOnly: true, insideNest: true } });
  console.log(mode, r.samples.map(s => s.removed.toFixed(6)).join(","));
}
