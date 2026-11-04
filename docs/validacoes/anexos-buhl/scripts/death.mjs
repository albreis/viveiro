const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const w = prepareDiggingWorld("BUHL-1", 10, { mode: "estigmergia", workersOnly: true, insideNest: true, freezeDaily: true });
const ids = new Map(w.ants.map(a=>[a.id,a]));
for (let t=0;t<700;t++) { w.step(); w.food=1000; for (const a of w.ants) a.age=20; }
for (const [id,a] of ids) if (!w.ants.includes(a)) console.log("morreu", id, a.deathCause, "energia", a.energy, "saude", a.health, "estado", a.state, "y", a.y, "node", a.node);
console.log("vivas", w.ants.length, "deaths", w.deaths);
