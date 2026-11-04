const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days, seed] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5] || "BUHL-2"];
const w = prepareDiggingWorld(seed, n, { mode, workersOnly: true, insideNest: true, idleYield: !!process.env.IDLE });
const ROOMS = ["royal","nursery","storage","chamber","waste","junction","front"];
function shortest(from, to) {
  const N = w.nest.nodes.length, d = Array(N).fill(Infinity); d[from]=0; const done = Array(N).fill(false);
  for (;;) { let u=-1; for (let i=0;i<N;i++) if(!done[i]&&(u<0||d[i]<d[u])) u=i; if(u<0||d[u]===Infinity) break; done[u]=true;
    for (const [a,b] of w.nest.links) { const v = a===u?b:b===u?a:-1; if(v<0) continue; const A=w.nest.nodes[u],B=w.nest.nodes[v]; const L=Math.hypot(A.x-B.x,A.y-B.y,A.z-B.z); if(d[u]+L<d[v]) d[v]=d[u]+L; } }
  return d[to];
}
const hauls = new Map(), done = [];
const L=(u,v)=>{const A=w.nest.nodes[u],B=w.nest.nodes[v];return Math.hypot(A.x-B.x,A.y-B.y,A.z-B.z);};
let roomDist=0, tunDist=0, roomProg=0, roomSpin=0, roomPress=0, supT=0, supD=0, retT=0, retD=0, noRouteT=0; const stRoom={}; const prevAng=new Map();
let roomT=0, roomStop=0, tunT=0, tunStop=0, roomMove=0, tunMove=0;
const prevPos = new Map();
while (w.tick < days*100) {
  w.step();
  for (const a of w.ants) {
    if (a.kind!=="worker") continue;
    const ph = a.soilTask?.phase, h = hauls.get(a.id);
    const pp = prevPos.get(a.id); prevPos.set(a.id,{x:a.x,y:a.y||0,z:a.z});
    if (ph==="haul") {
      if (!h && a.node!=null) hauls.set(a.id,{start:w.tick, from:a.node, walked0:a.distanceWalked||0, best: shortest(a.node, a.soilTask.entrance ?? 0), nodes:[a.node]});
      else if (h && a.node!=null && h.nodes.at(-1)!==a.node) h.nodes.push(a.node);
      if (pp && a.node!=null) {
        const nd = w.nest.nodes[a.node], d = Math.hypot(a.x-nd.x,(a.y||0)-nd.y,a.z-nd.z), mv = Math.hypot(a.x-pp.x,(a.y||0)-pp.y,a.z-pp.z);
        const inRoom = ROOMS.includes(nd.type) && d < nd.r + 0.1 && !(a.route?.length && a.tunnelCenter && Math.hypot(a.tunnelCenter.x-nd.x,a.tunnelCenter.y-nd.y,a.tunnelCenter.z-nd.z) > nd.r);
        const pa=prevAng.get(a.id); const ang=a.navigation?.wallAngle??0; prevAng.set(a.id,ang);
        if (inRoom && a.route?.length) { const T=w.nest.nodes[a.route[0]]; const before=Math.hypot(pp.x-T.x,pp.y-T.y,pp.z-T.z), after=Math.hypot(a.x-T.x,(a.y||0)-T.y,a.z-T.z); roomProg+=before-after; if(pa!=null) roomSpin+=Math.abs(ang-pa); }
        if (inRoom) { if (a.supportMotion) { supT++; supD+=mv; } if (a.navigation?.retreating) { retT++; retD+=mv; } if (!a.route?.length) noRouteT++; stRoom[a.state]=(stRoom[a.state]||0)+1; }
        if (inRoom) { roomT++; roomMove+=mv; h&&(h.room=(h.room||0)+mv); if (mv<0.005) roomStop++; } else { tunT++; tunMove+=mv; h&&(h.tun=(h.tun||0)+mv); if (mv<0.005) tunStop++; }
      }
    } else if (h) {
      hauls.delete(a.id);
      if (ph==="dump" || a.node==null) done.push({room:h.room||0,tun:h.tun||0,graph:h.nodes.slice(1).reduce((s,v,i)=>s+L(h.nodes[i],v),0)+L(h.nodes.at(-1),a.soilTask?.entrance??h.nodes.at(-1)),ticks:w.tick-h.start, walked:(a.distanceWalked||0)-h.walked0, best:h.best, hops:h.nodes.length-1, revisits: h.nodes.length - new Set(h.nodes).size});
    }
  }
}
const med = xs => { const s=[...xs].sort((a,b)=>a-b); return s.length? s[s.length>>1] : null; };
const r = x => x==null?null:+x.toFixed(2);
console.log(JSON.stringify({mode,n,seed, viagens:done.length,
  ticksMediana: med(done.map(d=>d.ticks)),
  andadoMediana: r(med(done.map(d=>d.walked))), menorCaminhoMediana: r(med(done.map(d=>d.best))),
  andadoNaCamara: r(med(done.map(d=>d.room))), andadoNoTunel: r(med(done.map(d=>d.tun))), caminhoPelosNos: r(med(done.map(d=>d.graph))), desvio: r(med(done.map(d=>d.walked/d.best))), comRevisita: (100*done.filter(d=>d.revisits>0).length/Math.max(1,done.length)).toFixed(0)+"%",
  tempoNaCamara: (100*roomT/(roomT+tunT)).toFixed(0)+"%", paradoNaCamara:(100*roomStop/Math.max(1,roomT)).toFixed(0)+"%", paradoNoTunel:(100*tunStop/Math.max(1,tunT)).toFixed(0)+"%",
  progressoNaCamaraPorTick: r(roomProg/Math.max(1,roomT)*1000)/1000, giroNaCamaraRadPorTick: r(roomSpin/Math.max(1,roomT)*1000)/1000, naCamaraComApoio:(100*supT/Math.max(1,roomT)).toFixed(0)+'%', distanciaComApoio:(100*supD/Math.max(1e-9,roomMove)).toFixed(0)+'%', naCamaraRecuando:(100*retT/Math.max(1,roomT)).toFixed(0)+'%', distanciaRecuando:(100*retD/Math.max(1e-9,roomMove)).toFixed(0)+'%', semRota:(100*noRouteT/Math.max(1,roomT)).toFixed(0)+'%', estadosNaCamara:Object.fromEntries(Object.entries(stRoom).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>[k,(100*v/roomT).toFixed(0)+'%'])), velCamara: r(roomMove/Math.max(1,roomT)*100)/100, velTunel: r(tunMove/Math.max(1,tunT)*100)/100}));
