import type { FamilyWorld } from "./types.ts";
import { colonyWorlds } from "./types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import { createColonyState } from "../colony/individual.ts";
import { foundingPlan } from "../founding/plan.ts";
import { createNest } from "../simulation/nest.ts";
import { hashSeed } from "../simulation/seed.ts";
import { bindHabitat, bindNeighbors } from "./shared.ts";
export const MAX_COLONIES = 4;
/** Allocation moves existing alates; it never creates free founders or teleports a body. */
export function spawnDaughter(
  root: FamilyWorld,
  source: FamilyWorld,
  gyne: ColonyAgent,
  male: ColonyAgent,
) {
  if (
    gyne.kind !== "gyne" ||
    !gyne.sexual ||
    male.kind !== "male" ||
    !male.sexual ||
    !source.ants.includes(gyne) ||
    !source.ants.includes(male) ||
    colonyWorlds(root).length >= MAX_COLONIES ||
    gyne.node !== null ||
    male.node !== null ||
    !gyne.genome ||
    !male.genome ||
    !((gyne.foundressBudget || 0) >= 2)
  )
    return null;
  const id = root.nextColonyId ?? 2,
    seed = root.seed + ":colony:" + id;
  let plan: ReturnType<typeof foundingPlan> | undefined;
  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = foundingPlan(
      createNest(seed + ":site:" + attempt, root.landscape),
      root.params.humidity,
      root.tick,
      gyne.foundressBudget,
    );
    if (
      root.nest.nodes.every(
        (n) =>
          Math.hypot(n.x - candidate.site.x, n.z - candidate.site.z) > 2.5 &&
          Math.hypot(
            n.x - candidate.chamber.x,
            n.y - candidate.chamber.y,
            n.z - candidate.chamber.z,
          ) > 1.2,
      )
    ) {
      plan = candidate;
      break;
    }
  }
  if (!plan) return null;
  plan.phase = "flight";
  plan.since = root.tick;
  plan.lastRain = root.tick;
  const child = Object.assign(Object.create(Object.getPrototypeOf(root)), {
    seed,
    rng: hashSeed(seed),
    colonyId: id,
    parentColonyId: source.colonyId || 1,
    colonies: [],
    ...(source.biologicalProfile
      ? { biologicalProfile: { ...source.biologicalProfile } }
      : {}),
    capacityOffset: 0,
    tick: root.tick,
    nextId: root.nextId,
    food: 0,
    queenHealth: Math.min(100, gyne.energy),
    ants: [gyne, male],
    brood: [],
    colony: createColonyState(),
    genetics: {
      version: 1,
      queen: { id: gyne.id, genome: gyne.genome },
      sire: { id: male.id, genome: male.genome },
      embryos: 0,
      mutationEvents: 0,
    },
    founding: plan,
    events: [],
    history: [],
    deaths: 0,
    born: 0,
    lastLaying: root.tick - 65,
    lastRecord: root.tick,
    lastWarning: -1000,
    lastDiscovery: -1000,
    physicsVersion: 5,
    localRoutingVersion: 1,
  }) as FamilyWorld;
  bindHabitat(root, child);
  source.ants = source.ants.filter((a) => a.id !== gyne.id && a.id !== male.id);
  gyne.kind = "queen";
  male.kind = "male";
  for (const a of [gyne, male]) {
    a.colonyId = id;
    a.sexual = false;
    delete a.departure;
    a.route = [];
    delete a.bioTask;
    delete a.routeIntent;
    delete a.supportMotion;
    delete a.navigation;
    delete a.knownEdges;
    delete a.recentNodes;
    delete a.lastEntrance;
    delete a.avoidEntrance;
    delete a.avoidEntranceUntil;
    a.tunnelCenter = null;
    a.tunnelY = 0;
  }
  root.nextColonyId = id + 1;
  (root.colonies ??= []).push(child);
  bindNeighbors(root);
  root.log(
    "Colônia " +
      id +
      ": uma filha da colônia " +
      (source.colonyId || 1) +
      " decolou para fundar outro ninho.",
    "birth",
  );
  return child;
}
