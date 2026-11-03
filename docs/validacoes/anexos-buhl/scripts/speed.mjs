const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
for (const n of [50, 200]) {
  const w = prepareDiggingWorld("BUHL-1", n, { mode: "estigmergia", workersOnly: true, insideNest: true });
  for (let i=0;i<100;i++) w.step();
  const t = performance.now(); for (let i=0;i<500;i++) w.step(); const s=(performance.now()-t)/1000;
  console.log(n, "formigas:", (500/s).toFixed(0), "ticks/s");
}
