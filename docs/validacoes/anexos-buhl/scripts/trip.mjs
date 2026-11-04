const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days] = [process.argv[2], +process.argv[3], +process.argv[4]];
const w = prepareDiggingWorld("BUHL-2", n, { mode, workersOnly: true, insideNest: true });
const jam = new Set(["Contato Antenal","Recuando para liberar passagem","Cedendo passagem à carga"]);
let taskSamples=0, jamSamples=0, digSamples=0, projSum=0, s=0, crewFull=0;
const last = new Map(), trips = []; const prev = new Map();
const phaseTime = {};
while (w.tick < days*100) {
  w.step(); s++;
  for (const a of w.ants) {
    if (a.kind!=="worker") continue;
    const p = a.soilTask?.phase;
    if (prev.get(a.id)==="dump" && p!=="dump") { if (last.has(a.id)) trips.push(w.tick-last.get(a.id)); last.set(a.id,w.tick); }
    prev.set(a.id,p);
    if (!p) continue;
    taskSamples++; phaseTime[p]=(phaseTime[p]||0)+1;
    if (jam.has(a.state)) jamSamples++;
  }
  projSum += w.soil.projects.filter(p=>!p.completed).length;
}
trips.sort((a,b)=>a-b);
const pct=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,(100*v/taskSamples).toFixed(0)+"%"]));
console.log(JSON.stringify({mode,n, comTarefa: +(taskSamples/s).toFixed(1), frentesAtivas:+(projSum/s).toFixed(2), tempoEmEmpurraEmpurra: (100*jamSamples/taskSamples).toFixed(0)+"%", viagens: trips.length, viagemMediana: trips[trips.length>>1]??null, fases: pct(phaseTime)}));
