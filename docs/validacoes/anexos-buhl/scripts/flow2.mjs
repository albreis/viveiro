const root = process.cwd();
const { lessonWorld } = await import(root + "/src/modules/lessons/world.ts");
const { projectSupport } = await import(root + "/src/modules/terrain/terrain.js");
const { moveInNest } = await import(root + "/src/modules/navigation/tunnel-motion.ts");
const N = +process.argv[2], T = +(process.argv[3] || 400), WARM = 100;
const w = lessonWorld("FLUXO-1", false, false);
const LINK = +(process.argv[4] ?? 8), [A, B] = w.nest.links[LINK];
w.ants = [];
const nodes = w.nest.nodes;
for (let i = 0; i < N; i++) {
  const home = i % 2 ? A : B, room = nodes[home];
  const ant = w.makeAnt("worker", room.x, room.z);
  const angle = i * 2.39996, reach = room.r * 0.6 * ((i % 5) + 1) / 5;
  const s = projectSupport(w.nest, { x: room.x + Math.cos(angle) * reach, y: room.y - room.r * 0.85, z: room.z + Math.sin(angle) * reach });
  Object.assign(ant, s.point, { normal: s.normal, node: home, tunnelY: room.y, angle, age: 20, route: [home === A ? B : A] });
  w.ants.push(ant);
}
w.onNestArrival = (ant, id) => { ant.route = [id === A ? B : A]; return true; };
const Z={},ST={};let ZN=0;
let widen = 0; w.recordSoilRemoval = () => { widen++; };
const a = nodes[A], b = nodes[B], len = Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const dir = { x: (b.x-a.x)/len, y: (b.y-a.y)/len, z: (b.z-a.z)/len };
const proj = (p) => ((p.x-a.x)*dir.x + ((p.y||0)-a.y)*dir.y + (p.z-a.z)*dir.z) / len;
const side = new Map(); let crossings = 0, onLink = 0, samples = 0, speedSum = 0, speedN = 0;
const last = new Map();
for (let t = 0; t < T; t++) {
  w.tick++;
  for (const ant of w.ants) {
    if (ant.node != null && !ant.route?.length && !ant.supportMotion) ant.route = [ant.node === A ? B : A];
    const before = { x: ant.x, y: ant.y, z: ant.z };
    moveInNest(w, ant);
    const s = proj(ant) > 0.5;
    if (t>=WARM){const f=proj(ant);const z=ant.node==null?"fora":(f<0.05||f>0.95)?"camara":(f<0.15||f>0.85)?"boca":"meio";const mv=Math.hypot(ant.x-before.x,(ant.y||0)-(before.y||0),ant.z-before.z)<0.005?"parada":"andando";Z[z+"-"+mv]=(Z[z+"-"+mv]||0)+1;ST[ant.state]=(ST[ant.state]||0)+1;ZN++;}
    if (t >= WARM && side.has(ant.id) && side.get(ant.id) !== s) crossings++;
    side.set(ant.id, s);
    if (t >= WARM) { const f = proj(ant); if (f > 0.15 && f < 0.85) { onLink++; speedSum += Math.hypot(ant.x-before.x, ant.y-before.y, ant.z-before.z); speedN++; } }
  }
  if (t >= WARM) samples++;
}
const span = 0.7 * len;
const zone={};for(const k in Z)zone[k]=(100*Z[k]/ZN).toFixed(0)+"%";const st={};for(const k in ST)st[k]=(100*ST[k]/ZN).toFixed(0)+"%";console.log(JSON.stringify({zone,st, N, densidade: +(onLink / samples / span).toFixed(3), fluxo: +(crossings / samples).toFixed(4), velocidade: +(speedSum / Math.max(1, speedN)).toFixed(4), velLivre: +(w.ants[0].speed*0.85).toFixed(4), alargou: widen, largura: w.nest.linkWidths?.[LINK] ?? 0.38 }));
