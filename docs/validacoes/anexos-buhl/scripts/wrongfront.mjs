const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [n, days, seed] = [+process.argv[2], +process.argv[3], process.argv[4]];
const w = prepareDiggingWorld(seed, n, { mode: "estigmergia", workersOnly: true, insideNest: true });
const visitedOther = new Set(), visitedOwn = new Set(), starts = new Map(); let returns = 0, reachedOwn=0, sameRoomAsFront=0, recruits=0;
const prevPh = new Map(), prevNode = new Map();
while (w.tick < days*100) {
  w.step();
  for (const a of w.ants) {
    const ph = a.soilTask?.phase, p0 = prevPh.get(a.id); prevPh.set(a.id, ph);
    const pid = a.soilTask?.projectId;
    if (ph==="return" && p0!=="return") { returns++; starts.set(a.id,{pid, other:false}); 
      const proj = w.soil.projects.find(q=>q.id===pid); if (proj && a.node===proj.from) sameRoomAsFront++; if (p0===undefined) recruits++; }
    const s = starts.get(a.id);
    if (s && ph==="return" && a.node!=null && prevNode.get(a.id)!==a.node) {
      const other = w.soil.projects.find(q=>!q.completed && q.front===a.node && q.id!==a.soilTask.projectId);
      if (other) s.other = true;
    }
    if (s && ph==="dig") { reachedOwn++; if (s.other) visitedOther.add(a.id+":"+w.tick); starts.delete(a.id); }
    if (s && !a.soilTask) starts.delete(a.id);
    prevNode.set(a.id, a.node);
  }
}
let passedOther = 0; for (const s of starts.values()) if (s.other) passedOther++;
console.log(JSON.stringify({n,seed,inicioDeRetorno:returns, recrutamentosNovos:recruits, comecouNaSalaDaPropriaFrente:sameRoomAsFront, chegouEcavou:reachedOwn, aindaEmRetornoNoFim:starts.size, dessesPassaramPorOutraFrente:passedOther}));
