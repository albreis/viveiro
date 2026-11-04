const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days, seed] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5] || "BUHL-2"];
const w = prepareDiggingWorld(seed, n, { mode, workersOnly: true, insideNest: true });
// who widens
const widenBy = {}; let widenVol = 0;
const rec = w.recordSoilRemoval.bind(w);
w.recordSoilRemoval = (ant, mass) => { const k = (ant.soilTask ? "tarefa:" + ant.soilTask.phase : "ociosa") + " | " + (ant.node!=null && ant.route?.[0]!=null ? w.nest.nodes[ant.node].type + "→" + w.nest.nodes[ant.route[0]].type : "?"); widenBy[k]=(widenBy[k]||0)+mass; widenVol+=mass; rec(ant, mass); };
// return-to-front time, bites, crews
const back = new Map(), backT = []; let bites=0, crewAtFront=0, frontSamples=0, idleNearFront=0, crewTotal=0;
const prevPh = new Map();
while (w.tick < days*100) {
  const before = w.soil.removed;
  w.step();
  for (const a of w.ants) {
    if (a.kind!=="worker") continue;
    const ph = a.soilTask?.phase, pp = prevPh.get(a.id); prevPh.set(a.id, ph);
    if (ph==="return" && pp!=="return") back.set(a.id, w.tick);
    if (ph==="dig" && pp!=="dig" && back.has(a.id)) { backT.push(w.tick - back.get(a.id)); back.delete(a.id); }
    if (!a.soilTask) back.delete(a.id);
  }
  if (w.tick % 5) continue;
  for (const p of w.soil.projects.filter(p=>!p.completed)) {
    frontSamples++;
    const f = w.nest.nodes[p.front];
    for (const a of w.ants) {
      if (a.kind!=="worker") continue;
      const d = Math.hypot(a.x-f.x,(a.y||0)-f.y,a.z-f.z);
      if (a.soilTask?.projectId===p.id) { crewTotal++; if (a.soilTask.phase==="dig") crewAtFront++; }
      else if (!a.soilTask && d < 1.0) idleNearFront++;
    }
  }
}
const med = xs => { const s=[...xs].sort((a,b)=>a-b); return s.length? s[s.length>>1] : null; };
const top = Object.fromEntries(Object.entries(widenBy).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>[k,(100*v/widenVol).toFixed(0)+"%"]));
console.log(JSON.stringify({mode,n,seed, alargamento:+widenVol.toFixed(2), quemAlarga: top, voltaAteFrenteMediana: med(backT), voltas: backT.length, equipePorFrente:+(crewTotal/Math.max(1,frontSamples)).toFixed(2), cavandoPorFrente:+(crewAtFront/Math.max(1,frontSamples)).toFixed(2), ociosasPertoDaFrente:+(idleNearFront/Math.max(1,frontSamples)).toFixed(2), frentesMedia:+(frontSamples/(days*20)).toFixed(2)}));
