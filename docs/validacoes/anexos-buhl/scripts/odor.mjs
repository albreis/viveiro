const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [n, days, seed] = [+process.argv[2], +process.argv[3], process.argv[4]];
const w = prepareDiggingWorld(seed, n, { mode: "estigmergia", workersOnly: true, insideNest: true });
while (w.tick < days*100) w.step();
const nodes = w.nest.nodes, links = w.nest.links;
const nb = i => [...new Set(links.flatMap(([a,b]) => a===i?[b]:b===i?[a]:[]))];
// hop distance to nearest front
const fronts = nodes.map((n,i)=>[n,i]).filter(([n])=>n.type==="front").map(([,i])=>i);
const dist = nodes.map(()=>Infinity); const q=[...fronts]; fronts.forEach(f=>dist[f]=0);
while (q.length) { const u=q.shift(); for (const v of nb(u)) if (dist[v]===Infinity) { dist[v]=dist[u]+1; q.push(v);} }
const vol = nodes.map(n=>Math.max(0.03,(4/3)*Math.PI*n.r**3));
const field = w.nestOdors.fields["1:front"] || [];
console.log("frentes", fronts.length, "nós", nodes.length);
for (let i=0;i<nodes.length;i++) {
  if (dist[i]===0 || dist[i]===Infinity) continue;
  const opts = nb(i).map(j => ({ j, s: w.routeSignal(i, j, "front", 1), good: dist[j] < dist[i] }));
  const wts = opts.map(o => Math.exp(Math.max(-6,Math.min(6,o.s*60))*1.4 > 0 ? 1.4*Math.max(-6,Math.min(6,o.s*60)) : 0));
  const tot = wts.reduce((a,b)=>a+b,0);
  const pGood = opts.reduce((s,o,k)=>s+(o.good? (0.975*wts[k]/tot + 0.025/opts.length):0),0);
  console.log(`${nodes[i].type.padEnd(9)} r=${nodes[i].r.toFixed(2)} saltos=${dist[i]} conc=${((field[i]||0)/vol[i]).toExponential(2)} saídas=${opts.length} sinais=[${opts.map(o=>(o.good?"*":"")+o.s.toExponential(1)).join(", ")}] P(caminho certo)=${pGood.toFixed(2)}`);
}
