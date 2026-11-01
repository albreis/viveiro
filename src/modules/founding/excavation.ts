import { outsideSite } from "./site.ts";
import { travelToFront, haulFoundingSoil } from "./travel.ts";
import type { FoundingWorld } from "./types.ts";
import { changePhase, founder, spendReserve } from "./types.ts";
import { removedSoil, depositSoil, distance3 } from "../soil/ledger.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { walkFoundress, settleFoundress } from "./motion.ts";
const WIDTH = 0.42,
  CHAMBER = 0.68,
  CAPACITY = 0.12;
const sphere = (r: number) => (4 * Math.PI * r ** 3) / 3;
/** A conservative material ledger with coarse capsule volumes, not grain physics. */
export function updateFoundingDig(world: FoundingWorld) {
  const f = world.founding!,
    q = founder(world);
  if (!q) return;
  if (!world.nest.nodes.length) {
    world.nest.nodes.push(
      { ...f.site, r: 0.02, type: "entrance", name: "Primeiro buraco" },
      { ...f.site, r: 0.02, type: "front", name: "Abrigo em escavação" },
    );
    world.nest.links.push([0, 1]);
    world.nest.linkWidths = [0.02];
    world.nest.revision++;
  }
  const front = world.nest.nodes[1],
    mouth = world.nest.nodes[0];
  const outside = outsideSite(f, 0.72);
  const dump = {
    ...outside,
    y: surfaceHeight(world.nest.relief, outside.x, outside.z) + 0.008,
  };
  const goal = { x: front.x - 0.12, y: front.y - front.r * 0.88, z: front.z };
  if (f.digMode === "haul") {
    const reached = haulFoundingSoil(world, q, dump);
    q.state = "Levando terra do primeiro abrigo";
    if (reached) {
      depositSoil(world, q);
      f.trips++;
      f.digMode = "return";
    }
    return;
  }
  if (settleFoundress(world, q)) return;
  if (
    !(front.r < WIDTH
      ? walkFoundress(world, q, goal)
      : travelToFront(world, q, goal))
  ) {
    q.state = "Caminhando até a frente do abrigo";
    return;
  }
  q.node = 1;
  q.tunnelCenter = { x: front.x, y: front.y, z: front.z };
  q.tunnelY = front.y;
  f.digMode = "bite";
  q.state = "Escavando o primeiro abrigo";
  const remaining = distance3(front, f.chamber);
  if (remaining < 0.001 && front.r >= CHAMBER - 0.0001) {
    if ((q.carryingSoil || 0) > 0.00001) {
      f.digMode = "haul";
      return;
    }
    front.type = "royal";
    front.name = "Primeira câmara da rainha";
    delete q.supportMotion;
    changePhase(
      world,
      "claustral",
      "O abrigo ficou pronto. A rainha cria a primeira prole com suas reservas maternas.",
    );
    return;
  }
  if (world.tick % 2) return;
  let mass = 0;
  if (front.r < WIDTH - 0.0001) {
    const r = Math.min(WIDTH, front.r + 0.008);
    mass = (sphere(r) - sphere(front.r)) * 0.5;
    front.r = mouth.r = r;
    world.nest.linkWidths![0] = r;
  } else if (remaining > 0.001) {
    const step = Math.min(0.012, remaining);
    front.x += ((f.chamber.x - front.x) * step) / remaining;
    front.y += ((f.chamber.y - front.y) * step) / remaining;
    front.z += ((f.chamber.z - front.z) * step) / remaining;
    mass = Math.PI * WIDTH ** 2 * step;
  } else {
    const r = Math.min(CHAMBER, front.r + 0.004);
    mass = sphere(r) - sphere(front.r);
    front.r = r;
  }
  removedSoil(world, q, mass);
  spendReserve(world, "excavation", mass * 0.15);
  world.nest.revision++;
  if ((q.carryingSoil || 0) >= CAPACITY) {
    f.digMode = "haul";
    delete q.supportMotion;
  }
}
