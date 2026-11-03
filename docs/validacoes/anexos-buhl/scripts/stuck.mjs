const { prepareDiggingWorld } = await import(process.cwd() + "/src/modules/benchmarks/digging-run.ts");
const [mode, n, days] = [process.argv[2], +process.argv[3], +process.argv[4]];
const w = prepareDiggingWorld("BUHL-2", n, { mode, workersOnly: true, insideNest: true });
const tally = {}, phase = {}, where = {}, states = {};
let samples = 0, stuckSum = 0, maxRun = 0, taskSum = 0;
while (w.tick < days * 100) {
  w.step();
  if (w.tick % 10) continue;
  samples++;
  for (const a of w.ants) {
    if (a.kind !== "worker") continue;
    if (a.soilTask) taskSum++;
    const st = a.navigation?.stagnantTicks || 0;
    maxRun = Math.max(maxRun, st);
    if (st <= 30) continue;
    const nd = a.node == null ? null : w.nest.nodes[a.node];
    const resting = nd && ["royal","nursery","storage","chamber"].includes(nd.type) && !a.soilTask;
    if (resting) { tally.repouso = (tally.repouso||0)+1; continue; }
    stuckSum++;
    const p = a.soilTask ? a.soilTask.phase : "sem tarefa";
    phase[p] = (phase[p]||0)+1;
    const k = nd ? nd.type : "fora";
    where[k] = (where[k]||0)+1;
    states[a.state] = (states[a.state]||0)+1;
  }
}
const pct = (o) => Object.fromEntries(Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>[k,(100*v/stuckSum).toFixed(0)+"%"]));
console.log(JSON.stringify({ mode, n, presasMedia: +(stuckSum/samples).toFixed(1), pctDasOperarias: +(100*stuckSum/samples/n).toFixed(1), comTarefaSoloMedia: +(taskSum/samples).toFixed(1), repousoMedia: +((tally.repouso||0)/samples).toFixed(1), maiorParadaTicks: maxRun, fase: pct(phase), local: pct(where), estado: pct(states) }));
