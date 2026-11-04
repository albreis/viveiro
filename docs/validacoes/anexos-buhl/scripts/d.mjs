import { prepareDiggingWorld } from "/home/user/viveiro/src/modules/benchmarks/digging-run.ts";
import { markAt } from "/home/user/viveiro/src/modules/soil/stigmergy.ts";
const w = prepareDiggingWorld("BUHL-1", Number(process.argv[2]||100), { mode: "estigmergia", workersOnly: true, insideNest: true });
const r0 = w.soil.removed;
for (let t = 1; t <= 300; t++) {
  w.step();
  if (t % 20 === 0) {
    const ph = {}; let inNest = 0;
    for (const a of w.ants) { if (a.node != null) inNest++; if (a.soilTask) ph[a.soilTask.phase] = (ph[a.soilTask.phase]||0)+1; }
    const pr = w.soil.projects.filter(p=>!p.completed).map(p => `${p.id}:${markAt(w,p).toFixed(2)}:${p.excavated.toFixed(3)}`);
    console.log(t, (w.soil.removed-r0).toFixed(3), "nest", inNest, JSON.stringify(ph), pr.join(" "), "done", w.soil.projects.filter(p=>p.completed).length);
  }
}
for (const a of w.ants.filter(a => a.soilTask)) {
  const p = w.soil.projects.find(p => p.id === a.soilTask.projectId);
  console.log(a.id, a.soilTask.phase, "node", a.node, "route", JSON.stringify(a.route), "proj", p?.id, "from", p?.from, "front", p?.front, "carry", (a.carryingSoil||0).toFixed(3), "state", a.state, "y", (a.y||0).toFixed(2));
}
