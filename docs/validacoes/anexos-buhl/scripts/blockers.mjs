const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days] = [process.argv[2], +process.argv[3], +process.argv[4]];
const w = prepareDiggingWorld("BUHL-2", n, { mode, workersOnly: true, insideNest: true });
const prev = new Map(), still = new Map();
const kinds = {}; let total = 0, roomOcc = {}, occN = 0;
while (w.tick < days*100) {
  w.step();
  for (const a of w.ants) { const p = prev.get(a.id); const mv = p ? Math.hypot(a.x-p.x,(a.y||0)-p.y,a.z-p.z) : 1; prev.set(a.id,{x:a.x,y:a.y||0,z:a.z}); still.set(a.id, mv<0.005 ? (still.get(a.id)||0)+1 : 0); }
  if (w.tick % 5) continue;
  for (const a of w.ants) {
    if (a.soilTask?.phase !== "haul" || !a.supportMotion) continue;
    for (const o of w.ants) {
      if (o===a) continue;
      if (Math.hypot(o.x-a.x,(o.y||0)-(a.y||0),o.z-a.z) > 0.52) continue;
      const k = o.soilTask ? "com tarefa de solo" : (still.get(o.id)||0) > 20 ? "ociosa parada" : "ociosa andando";
      kinds[k]=(kinds[k]||0)+1; total++;
    }
  }
  // idle ants per room
  occN++;
  for (const a of w.ants) if (!a.soilTask && a.node!=null) { const t=w.nest.nodes[a.node].type; roomOcc[t]=(roomOcc[t]||0)+1; }
}
console.log(JSON.stringify({n, vizinhasDeQuemDesvia: Object.fromEntries(Object.entries(kinds).map(([k,v])=>[k,(100*v/total).toFixed(0)+"%"])), ociosasPorTipoDeNo: Object.fromEntries(Object.entries(roomOcc).map(([k,v])=>[k,+(v/occN).toFixed(1)])) }));
