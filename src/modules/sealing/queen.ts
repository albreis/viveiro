import { resolveBiologicalProfile } from "../biology/catalog.ts";
import type { FoundingWorld } from "../founding/types.ts";
import { changePhase, founder, spendReserve } from "../founding/types.ts";
import { outsideSite } from "../founding/site.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { haulFoundingSoil, travelToFront } from "../founding/travel.ts";
import { walkFoundress } from "../founding/motion.ts";
import { accessibleReserve } from "../maternal/pools.ts";
import { planPlug, plugWorkPoint } from "./plan.ts";
import { reclaimSpoil, fillPlug } from "./material.ts";
import { SEAL_PARAMETERS } from "./types.ts";
export function beginSealing(w: FoundingWorld): boolean {
  if (resolveBiologicalProfile(w.biologicalProfile).entranceModel !== "plug")
    return false;
  const p = planPlug(w);
  if (!p) {
    founder(w)!.state = "Procurando uma seção adequada para o tampão";
    return true;
  }
  const queenPoint = plugWorkPoint(w, p, 0.85),
    workerPoint = plugWorkPoint(w, p, 0.28);
  if (!queenPoint || !workerPoint) {
    founder(w)!.state = "Procurando apoio junto à entrada";
    return true;
  }
  w.founding!.seal = {
    version: 1,
    plugId: p.id,
    phase: "collect",
    queenPoint,
    workerPoint,
    trips: 0,
  };
  (w.nest.plugs ??= []).push(p);
  changePhase(
    w,
    "sealing",
    "O abrigo está pronto. A rainha recolhe terra para fechar a entrada por dentro.",
  );
  return true;
}
export function sealDumpPoint(w: FoundingWorld) {
  const outside = outsideSite(w.founding!, 0.72);
  return {
    ...outside,
    y: surfaceHeight(w.nest.relief, outside.x, outside.z) + 0.008,
  };
}
export function updateQueenSealing(w: FoundingWorld): void {
  const f = w.founding!,
    task = f.seal!,
    q = founder(w)!,
    p = w.nest.plugs!.find((p) => p.id === task.plugId)!;
  if (task.phase === "collect") {
    q.state = "Recolhendo terra retirada para o tampão";
    if (!haulFoundingSoil(w, q, sealDumpPoint(w))) return;
    const needed = p.capacity - p.mass - (q.carryingSoil || 0);
    if (needed > 1e-9 && reclaimSpoil(w, q, needed) < needed - 1e-9) return;
    task.phase = "return";
    delete q.supportMotion;
  }
  if (task.phase === "return") {
    q.state = "Levando terra para fechar a entrada";
    if (!travelToFront(w, q, task.queenPoint)) return;
    task.phase = "build";
    q.route = [];
    delete q.routeIntent;
  }
  if (task.phase !== "build") return;
  q.state = "Escavando e acomodando o tampão por dentro";
  if (!walkFoundress(w, q, task.queenPoint)) return;
  if (
    (w.neighborAgents || w.ants).some((a) => {
      const d = { x: a.x - p.x, y: (a.y || 0) - p.y, z: a.z - p.z };
      const axial = d.x * p.axis.x + d.y * p.axis.y + d.z * p.axis.z;
      const radius = Math.hypot(
        d.x - axial * p.axis.x,
        d.y - axial * p.axis.y,
        d.z - axial * p.axis.z,
      );
      return (
        Math.abs(axial) <
          p.depth / 2 +
            (a.kind === "queen" ? 0.55 : 0.34) * (a.bodyScale || 1) &&
        radius < p.radius + 0.15
      );
    })
  ) {
    q.state = "Aguardando passagem livre para acomodar terra";
    return;
  }
  const amount = Math.min(
    SEAL_PARAMETERS.bite,
    p.capacity - p.mass,
    q.carryingSoil || 0,
  );
  if (
    f.maternal &&
    accessibleReserve(f.maternal, "excavation") + 1e-10 < amount * 0.15
  )
    return;
  spendReserve(w, "excavation", amount * 0.15);
  fillPlug(w, q, p, amount);
  if (p.mass < p.capacity - 1e-9) return;
  task.phase = "closed";
  task.closedTick = w.tick;
  changePhase(
    w,
    "claustral",
    "A entrada foi fechada com terra transportada. A rainha inicia o claustro; os poros ainda permitem difusão de gases.",
  );
}

export function parkSealedQueen(w: FoundingWorld): void {
  const f = w.founding!,
    q = founder(w)!,
    p = w.nest.plugs!.find((p) => p.id === f.seal!.plugId)!,
    front = w.nest.nodes[f.front!];
  walkFoundress(w, q, {
    x: front.x + p.axis.x * 0.3,
    y: front.y - front.r * 0.8,
    z: front.z + p.axis.z * 0.3,
  });
}
