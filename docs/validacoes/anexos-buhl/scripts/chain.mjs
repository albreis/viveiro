const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const { frontLimit, crewLimit, joinProbability, crowdingFactor } = await import(process.cwd() + "/src/modules/soil/stigmergy.ts");
const [mode, n, days, seed] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const w = prepareDiggingWorld(seed, n, { mode, workersOnly: true, insideNest: true });
const ORIG = ["royal","nursery","storage","chamber","junction"];
const acc = { fronts:0, origins:0, originsFree:0, frontCap:0, crewFull:0, crewSum:0, idle:0, phase:{}, joinP:0, joinN:0, crowd:0 };
let S_=0, bites=0, removedFront=0, completed=0;
const tripStart = new Map(), cycles=[]; const prevPh=new Map(); let bitesPerTrip=[]; const carriedBites=new Map();
let lastRemoved = w.soil.removed;
const removedBy = {front:0};
const projBefore = new Set();
while (w.tick < days*100) {
  const before = w.ants.map(a=>[a, a.carryingSoil||0, a.soilTask?.phase]);
  w.step();
  for (const [a, c0, p0] of before) {
    const p = a.soilTask?.phase;
    if ((a.carryingSoil||0) > c0 + 1e-9 && p0==="dig") { bites++; carriedBites.set(a.id,(carriedBites.get(a.id)||0)+1); }
    if (p0==="dig" && p!=="dig" && !tripStart.has(a.id)) tripStart.set(a.id, w.tick);
    if (p==="dig" && p0!=="dig" && tripStart.has(a.id)) { cycles.push(w.tick - tripStart.get(a.id)); tripStart.delete(a.id); bitesPerTrip.push(carriedBites.get(a.id)||0); carriedBites.set(a.id,0); }
    if (!a.soilTask) tripStart.delete(a.id);
  }
  if (w.tick % 10) continue;
  S_++;
  const open = w.soil.projects.filter(p=>!p.completed);
  acc.fronts += open.length;
  const origins = w.nest.nodes.map((nd,i)=>[nd,i]).filter(([nd])=>ORIG.includes(nd.type));
  acc.origins += origins.length;
  acc.originsFree += origins.filter(([,i])=>!open.some(p=>p.from===i)).length;
  if (open.length >= frontLimit(w)) acc.frontCap++;
  for (const p of open) { const c = w.ants.filter(a=>a.soilTask?.projectId===p.id).length; acc.crewSum += c; if (c >= crewLimit(w)) acc.crewFull++; if (w.soil.stigmergy) { acc.joinP += joinProbability(w,p); acc.joinN++; } }
  for (const a of w.ants) { if (a.kind!=="worker") continue; const ph = a.soilTask ? a.soilTask.phase : "ociosa"; acc.phase[ph]=(acc.phase[ph]||0)+1; }
  acc.crowd += crowdingFactor(w);
}
completed = w.soil.projects.filter(p=>p.completed).length;
const med = xs => { const s=[...xs].sort((a,b)=>a-b); return s.length? s[s.length>>1] : null; };
const per = x => +(x/S_).toFixed(2);
console.log(JSON.stringify({mode,n,seed, removido:+(w.soil.removed).toFixed(2), mordidas:bites, mordidasPorDia:+(bites/days).toFixed(1), projetosConcluidos:completed, projetosTotal:w.soil.projects.length, nos:w.nest.nodes.length,
 frentesAbertas:per(acc.fronts), origensPossiveis:per(acc.origins), origensSemFrente:per(acc.originsFree), noTetoDeFrentes:(100*acc.frontCap/S_).toFixed(0)+"%",
 equipeMedia:+(acc.crewSum/Math.max(1,acc.fronts)).toFixed(2), equipeCheia:(100*acc.crewFull/Math.max(1,acc.fronts)).toFixed(0)+"%",
 probEntrar:+(acc.joinP/Math.max(1,acc.joinN)).toFixed(3), freioDensidade:per(acc.crowd),
 fases:Object.fromEntries(Object.entries(acc.phase).map(([k,v])=>[k,per(v)])),
 cicloMediana:med(cycles), mordidasPorViagem:med(bitesPerTrip), ciclos:cycles.length}));
