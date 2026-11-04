import { lessonWorld, finishLessonWorld } from "/home/user/viveiro/src/modules/lessons/world.ts";
import { surfaceHeight } from "/home/user/viveiro/src/modules/landscape/queries.ts";
const [N, days, seed] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4] || "BUHL-1"];
const w = lessonWorld(seed, false, false);
w.ants = w.ants.filter(a => a.kind === "queen");
const entry = w.nest.nodes.find(n => n.type === "entrance");
let placed = 0;
for (let i = 0; i < N; i++) {
  const ant = w.makeAnt("worker", entry.x, entry.z);
  for (let attempt = 0; attempt < 400; attempt++) {
    const angle = i * 1.8 + attempt * 2.4, radius = 0.8 + attempt * 0.03;
    const x = Math.max(-9.4, Math.min(9.4, entry.x + Math.cos(angle) * radius));
    const z = Math.max(-5.9, Math.min(5.9, entry.z + Math.sin(angle) * radius));
    const point = { x, y: surfaceHeight(w.nest.relief, x, z) + 0.008, z };
    if (!w.inPond(x, z) && w.positionClear(ant, point, angle, 0, { x: 0, y: 1, z: 0 })) {
      Object.assign(ant, point, { angle, age: 20 }); w.ants.push(ant); placed++; break;
    }
  }
}
w.food = 1e3;
finishLessonWorld(w, true);
const t0 = Date.now(); const out = [];
const r0 = w.soil.removed;
while (w.tick < days * 100) { w.step(); if (w.tick % 25 === 0) out.push([w.tick, +(w.soil.removed - r0).toFixed(4), w.soil.projects.length, w.nest.nodes.length, w.workers.length]); }
console.log(JSON.stringify({ N, placed, ms: Date.now() - t0, out: out.filter((_, i) => i % 40 === 39) }));
