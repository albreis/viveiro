const root = process.argv[2];
const { prepareDiggingWorld } = await import(root + "/src/modules/benchmarks/digging-run.ts");
const w = prepareDiggingWorld("BUHL-1", 200, { mode: "estigmergia", workersOnly: true, insideNest: true, freezeDaily: true, noPredators: true });
const ages = new Map(w.ants.map(a=>[a.id,a.age]));
const all = new Map(w.ants.map(a=>[a.id,a]));
const causes = {}; const when = [];
for (let t=0;t<5400;t++) {
  w.step(); w.food=1000; w.predators.length=0;
  for (const a of w.ants){ if(ages.has(a.id)) a.age=ages.get(a.id); if(a.life){a.life.diseaseHazard=0;a.life.infection=0;} }
  for (const [id,a] of all) if (!w.ants.includes(a)) { causes[a.deathCause]=(causes[a.deathCause]||0)+1; when.push([t,a.deathCause,+(a.energy??0).toFixed(1),a.health,a.state,a.node]); all.delete(id); }
}
console.log(causes); console.log(when.slice(0,12)); console.log("vivas", w.ants.length);
