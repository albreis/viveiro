import { beginSealing } from "../sealing/queen.ts";
import { accessibleReserve } from "../maternal/pools.ts";
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
  if (f.front === undefined) {
    if (f.maternal) {
      const seedMass = sphere(0.02) * 0.5,
        cost = seedMass * 0.15;
      if (accessibleReserve(f.maternal, "excavation") + 1e-10 < cost) {
        q.state = "Sem reservas disponíveis para iniciar o abrigo";
        f.maternal.unmet.excavation += cost;
        return;
      }
      spendReserve(world, "excavation", cost);
      removedSoil(world, q, seedMass);
    }
    f.entry = world.nest.nodes.length;
    f.front = f.entry + 1;
    world.nest.nodes.push(
      {
        ...f.site,
        r: 0.02,
        type: "entrance",
        name: "Primeiro buraco",
        colonyId: world.colonyId || 1,
      },
      {
        ...f.site,
        r: 0.02,
        type: "front",
        name: "Abrigo em escavação",
        colonyId: world.colonyId || 1,
      },
    );
    world.nest.linkWidths ??= world.nest.links.map(() => 0.38);
    world.nest.links.push([f.entry, f.front]);
    world.nest.linkWidths.push(0.02);
    world.nest.revision++;
  }
  const front = world.nest.nodes[f.front],
    mouth = world.nest.nodes[f.entry!];
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
  q.node = f.front;
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
    world.nest.revision++;
    delete q.supportMotion;
    if (f.foraging) {
      changePhase(
        world,
        "semiclaustral",
        "O abrigo está pronto. A rainha precisa buscar alimento fora para criar a primeira prole.",
      );
      return;
    }
    if (beginSealing(world)) return;
    changePhase(
      world,
      "claustral",
      "O abrigo ficou pronto. A rainha cria a primeira prole com suas reservas maternas.",
    );
    return;
  }
  if (world.tick % 2) return;
  let mass = 0;
  let excavate = () => {};
  if (front.r < WIDTH - 0.0001) {
    const r = Math.min(WIDTH, front.r + 0.008);
    mass = (sphere(r) - sphere(front.r)) * 0.5;
    excavate = () => {
      front.r = mouth.r = r;
      world.nest.linkWidths![
        world.nest.links.findIndex(([a, b]) => a === f.entry && b === f.front)
      ] = r;
    };
  } else if (remaining > 0.001) {
    const step = Math.min(0.012, remaining);
    excavate = () => {
      front.x += ((f.chamber.x - front.x) * step) / remaining;
      front.y += ((f.chamber.y - front.y) * step) / remaining;
      front.z += ((f.chamber.z - front.z) * step) / remaining;
    };
    mass = Math.PI * WIDTH ** 2 * step;
  } else {
    const r = Math.min(CHAMBER, front.r + 0.004);
    mass = sphere(r) - sphere(front.r);
    excavate = () => {
      front.r = r;
    };
  }
  if (f.maternal) {
    if (accessibleReserve(f.maternal, "excavation") + 1e-10 < mass * 0.15) {
      q.state = "Sem reservas disponíveis para escavar";
      f.maternal.unmet.excavation += mass * 0.15;
      return;
    }
    spendReserve(world, "excavation", mass * 0.15);
  }
  excavate();
  removedSoil(world, q, mass);
  if (!f.maternal) spendReserve(world, "excavation", mass * 0.15);
  world.nest.revision++;
  if ((q.carryingSoil || 0) >= CAPACITY) {
    f.digMode = "haul";
    delete q.supportMotion;
  }
}
