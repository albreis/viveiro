import { motionWork } from "../../fatigue/motion-work.ts";
import type { BuhlArena } from "./geometry.ts";
import type { BuhlSoilLedger } from "./soil.ts";
import type { BuhlLabPlan } from "./settings.ts";
import { BUHL_INDIVIDUAL } from "./settings.ts";
import type { BuhlEdgeContact, EdgeContact } from "./edge.ts";
import type { BuhlActivity } from "./activity.ts";
import type { BuhlBodyContacts } from "./body-contacts.ts";
export interface MovingWorker extends EdgeContact {
  id: number;
  load: number;
}
export interface BuhlMotionContext {
  arena: BuhlArena;
  soil: BuhlSoilLedger;
  plan: BuhlLabPlan;
  random: () => number;
  occupied: Uint16Array;
  edge: BuhlEdgeContact | null;
  activity?: BuhlActivity;
  walkingEffortPerStep: number;
  contacts?: BuhlBodyContacts;
}
export function moveBuhlWorker(
  ctx: BuhlMotionContext,
  worker: MovingWorker,
  tick: number,
): boolean {
  const draw = ctx.random();
  const turn = draw < 0.04 ? 1 : draw < 0.08 ? 3 : draw < 0.085 ? 2 : 0;
  const side = draw < 0.5 ? 1 : 3;
  const facing = (worker.heading + turn) & 3;
  let target = -1;
  let direction = facing;
  let occupiedNeighbor = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    const offset =
      attempt === 0 ? 0 : attempt === 1 ? side : attempt === 2 ? 4 - side : 2;
    const heading = (facing + offset) & 3;
    const cell = ctx.arena.neighbor(worker.cell, heading);
    if (ctx.occupied[cell]) {
      occupiedNeighbor = true;
      continue;
    }
    if (!ctx.arena.walkable(cell)) continue;
    if (ctx.contacts && !ctx.contacts.clear(worker.id - 1, cell, heading)) {
      occupiedNeighbor = true;
      continue;
    }
    if (target < 0) {
      target = cell;
      direction = heading;
    }
    if (!worker.following || ctx.edge!.firstFace(cell, heading) >= 0) {
      target = cell;
      direction = heading;
      break;
    }
  }
  if (target < 0) {
    if (occupiedNeighbor) ctx.activity?.blocked(worker.id, tick);
    return false;
  }
  ctx.activity?.moved(worker.id, tick);
  if (ctx.walkingEffortPerStep)
    worker.digFatigue?.recordEffort(
      tick,
      motionWork(
        ctx.walkingEffortPerStep,
        worker.load / BUHL_INDIVIDUAL.pelletMicrograms,
      ),
    );
  ctx.occupied[worker.cell] = 0;
  ctx.occupied[target] = worker.id;
  worker.cell = target;
  worker.heading = direction;
  ctx.contacts?.moved(worker.id - 1);
  if (
    !worker.load &&
    ctx.soil.hasDeposit(target) &&
    ctx.random() < ctx.plan.pickupPerContact
  )
    worker.load = ctx.soil.pickUp(target);

  return true;
}
