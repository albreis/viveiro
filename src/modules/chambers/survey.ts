import type { FoundingWorld } from "../founding/types.ts";
import type { Vec3 } from "../navigation/types.ts";
import { founder, changePhase, spendReserve } from "../founding/types.ts";
import { walkFoundress } from "../founding/motion.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { sampleSoil } from "../terrain/field.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { CHAMBER_PARAMETERS as p } from "./types.ts";
import { chamberQuality } from "./score.ts";
function probe(w: FoundingWorld, point: Vec3) {
  const ground = surfaceHeight(w.nest.relief, point.x, point.z),
    soil = { x: point.x, y: ground - p.probeDepth, z: point.z };
  const reading = sampleClimate(w.microclimate, soil) ?? {
    water: 0.5,
    temperature: w.params.temperatureC ?? 24,
  };
  const valid =
    !w.inPond(point.x, point.z) &&
    sampleSoil(w.nest, soil).distance < 0 &&
    Math.abs(point.y - ground) < 0.12;
  return {
    point: { ...point },
    water: reading.water,
    temperature: reading.temperature,
    quality: valid ? chamberQuality(reading, "queen") : -1,
  };
}
export function beginSiteSurvey(w: FoundingWorld): boolean {
  if (
    resolveBiologicalProfile(w.biologicalProfile).chamberModel !== "local-demo"
  )
    return false;
  const q = founder(w)!,
    point = { x: q.x, y: q.y ?? 0, z: q.z },
    best = probe(w, point);
  w.founding!.survey = {
    version: 1,
    mode: "explore",
    steps: 0,
    since: w.tick,
    heading: q.angle,
    samples: 1,
    origin: { ...point },
    best,
    last: { water: best.water, temperature: best.temperature },
  };
  changePhase(
    w,
    "surveying",
    "A rainha percorre o solo, comparando água e calor que sente perto de si.",
  );
  return true;
}
export function updateSiteSurvey(w: FoundingWorld): void {
  const q = founder(w)!,
    f = w.founding!,
    s = f.survey!,
    here = { x: q.x, y: q.y ?? 0, z: q.z },
    local = probe(w, here);
  s.steps++;
  s.samples++;
  s.last = { water: local.water, temperature: local.temperature };
  if (local.quality > s.best.quality + 1e-6) s.best = local;
  spendReserve(w, "maintenance", p.extraCost);
  if (s.mode === "explore" && s.steps >= p.exploreTicks) s.mode = "return";
  if (s.mode === "explore") {
    let heading = s.heading;
    if (Math.hypot(q.x - s.origin.x, q.z - s.origin.z) > p.roamRadius)
      heading = Math.atan2(s.origin.z - q.z, s.origin.x - q.x);
    const choices = [-0.65, 0, 0.65].map((turn) => {
      const a = heading + turn,
        point = {
          x: q.x + Math.cos(a) * p.sensorRadius,
          y: 0,
          z: q.z + Math.sin(a) * p.sensorRadius,
        };
      point.y = surfaceHeight(w.nest.relief, point.x, point.z) + 0.008;
      const withinReach =
        Math.hypot(
          point.x - here.x,
          point.y - p.probeDepth - here.y,
          point.z - here.z,
        ) <=
        p.sensorRadius + p.probeDepth + 0.02;
      if (!withinReach) return { heading: a, weight: 0 };
      const r = probe(w, point);
      return {
        heading: a,
        weight:
          r.quality < 0 ? 0 : Math.exp(3 * r.quality + (turn === 0 ? 0.15 : 0)),
      };
    });
    const sum = choices.reduce((n, c) => n + c.weight, 0);
    let draw = w.random() * sum;
    const selected = choices.find(
      (c) => (draw -= c.weight) <= 0 && c.weight > 0,
    );
    s.heading = selected?.heading ?? heading + Math.PI / 2;
    w.moveSurface(q, s.heading, q.speed * 0.6);
    q.state = "Sentindo água e calor perto do solo";
    return;
  }
  q.state = "Voltando ao ponto de abrigo que visitou";
  const reached = walkFoundress(w, q, s.best.point);
  if (!reached && s.steps < p.exploreTicks + p.returnLimit) return;
  if (!reached && local.quality < 0) {
    q.state = "Procurando solo firme para iniciar o abrigo";
    return;
  }
  // Keep the original shaft offset, but move its planned origin to a physically reached site.
  const old = f.site,
    point = { x: q.x, y: surfaceHeight(w.nest.relief, q.x, q.z), z: q.z };
  f.chamber = {
    x: Math.max(-9.1, Math.min(9.1, point.x + f.chamber.x - old.x)),
    y: Math.max(-3.8, point.y + f.chamber.y - old.y),
    z: Math.max(-5.6, Math.min(5.6, point.z + f.chamber.z - old.z)),
  };
  f.site = point;
  s.mode = "done";
  changePhase(
    w,
    "digging",
    "A rainha escolheu um ponto visitado e começa a escavar. A leitura superficial não garante o clima futuro da câmara.",
  );
}
