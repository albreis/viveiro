const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days] = [process.argv[2], +process.argv[3], +process.argv[4]];
const w = prepareDiggingWorld("BUHL-2", n, { mode, workersOnly: true, insideNest: true });
const pos = new Map(); let moved = 0, ticks = 0, slow = 0; const slowWhere = {}, allWhere = {};
let nominal = 0;
while (w.tick < days*100) {
  w.step();
  for (const a of w.ants) {
    if (a.kind!=="worker") continue;
    const p = pos.get(a.id); pos.set(a.id, {x:a.x,y:a.y||0,z:a.z});
    if (a.soilTask?.phase !== "haul" || !p) continue;
    const d = Math.hypot(a.x-p.x,(a.y||0)-p.y,a.z-p.z);
    moved += d; ticks++; nominal += a.speed*0.85;
    const from = a.node==null?"fora":w.nest.nodes[a.node].type, to = a.route?.[0]==null?"-":w.nest.nodes[a.route[0]].type;
    const k = from+"→"+to + (a.supportMotion?" (apoio)":"") + (a.navigation?.retreating?" (recuando)":"");
    allWhere[k]=(allWhere[k]||0)+1;
    if (d < 0.01) { slow++; slowWhere[k]=(slowWhere[k]||0)+1; }
  }
}
const top=(o,t)=>Object.fromEntries(Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>[k,(100*v/t).toFixed(0)+"%"]));
console.log(JSON.stringify({mode,n,velMediaNoHaul:+(moved/ticks).toFixed(4),velNominal:+(nominal/ticks).toFixed(4),pctTicksQuaseParado:(100*slow/ticks).toFixed(0)+"%",ondeParado:top(slowWhere,slow),ondeNoHaul:top(allWhere,ticks), nos:w.nest.nodes.length}));
