const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days] = [process.argv[2], +process.argv[3], +process.argv[4]];
const w = prepareDiggingWorld("BUHL-2", n, { mode, workersOnly: true, insideNest: true });
const prev = new Map(), since = new Map(), dur = {haul:[],return:[],dig:[]}; let dumps=0; const open={};
const stateInHaul = {};
while (w.tick < days*100) {
  w.step();
  for (const a of w.ants) {
    if (a.kind!=="worker") continue;
    const p = a.soilTask?.phase ?? "none", q = prev.get(a.id) ?? "none";
    if (p!==q) { if (dur[q] && since.has(a.id)) dur[q].push(w.tick-since.get(a.id)); since.set(a.id,w.tick); if (p==="dump") dumps++; }
    prev.set(a.id,p);
    if (p==="haul") stateInHaul[a.state]=(stateInHaul[a.state]||0)+1;
  }
}
for (const a of w.ants) { const p=prev.get(a.id); if (dur[p]) open[p]=(open[p]||0)+1; }
const med = xs => { xs.sort((a,b)=>a-b); return xs.length? xs[xs.length>>1] : null; };
const tot = Object.values(stateInHaul).reduce((a,b)=>a+b,0)||1;
console.log(JSON.stringify({mode,n,despejos:dumps, haulConcluidos:dur.haul.length, haulMediana:med(dur.haul), haulMax:Math.max(0,...dur.haul), returnMediana:med(dur.return), aindaAbertasNoFim:open, estadoNoHaul:Object.fromEntries(Object.entries(stateInHaul).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>[k,(100*v/tot).toFixed(0)+"%"]))}));
