const root=process.cwd();
const m = await import(root+"/src/modules/benchmarks/tunnel-flow.ts");
const { moveInNest } = await import(root + "/src/modules/navigation/tunnel-motion.ts");
// monkeypatch: wrap via re-running with instrumentation is complex; reuse flow.mjs approach
