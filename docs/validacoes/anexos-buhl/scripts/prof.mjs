const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const w = prepareDiggingWorld("BUHL-1", 200, { mode: "estigmergia", workersOnly: true, insideNest: true });
for (let i=0;i<300;i++) w.step();
