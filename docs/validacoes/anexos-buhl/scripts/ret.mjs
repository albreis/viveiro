const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days, seed] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const w = prepareDiggingWorld(seed, n, { mode, workersOnly: true, insideNest: true });
const T = {}; let N = 0; const prev = new Map(); const st = {}; const age = []; const since = new Map();
while (w.tick < days*100) {
  w.step();
  for (const a of w.ants) {
    const p = prev.get(a.id); prev.set(a.id,{x:a.x,y:a.y||0,z:a.z});
    if (a.soilTask?.phase !== "return") { since.delete(a.id); continue; }
    if (!since.has(a.id)) since.set(a.id, w.tick);
    if (w.tick % 10) continue;
    N++;
    const proj = w.soil.projects.find(q=>q.id===a.soilTask.projectId);
    const here = a.node==null ? "fora" : w.nest.nodes[a.node].type;
    const head = a.route?.[0]==null ? "sem rota" : w.nest.nodes[a.route[0]].type;
    const atFront = proj && a.node===proj.front ? "na frente dela" : "";
    const mv = p && Math.hypot(a.x-p.x,(a.y||0)-p.y,a.z-p.z) < 0.005 ? "parada" : "andando";
    const k = `${here}→${head} ${atFront} ${mv} ${proj?.completed?"(projeto concluído)":""} ${a.carryingSoil>0?"(com terra)":""}`.replace(/\s+/g," ").trim();
    T[k]=(T[k]||0)+1; st[a.state]=(st[a.state]||0)+1;
    age.push(w.tick - since.get(a.id));
  }
}
age.sort((a,b)=>a-b);
const top=(o)=>Object.fromEntries(Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>[k,(100*v/N).toFixed(0)+"%"]));
console.log(JSON.stringify({n,seed,amostras:N, ondeEstao:top(T), estados:top(st), tempoEmReturnMediana:age[age.length>>1], p90:age[Math.floor(age.length*0.9)]},null,1));
