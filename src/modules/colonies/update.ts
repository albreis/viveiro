import { coordinateFlights } from "./mating.ts";
import { MAX_COLONIES } from "./spawn.ts";
import type { FamilyWorld } from "./types.ts";
import { allAnts, colonyWorlds, allBrood } from "./types.ts";
import { bindHabitat, bindNeighbors } from "./shared.ts";
import { updateEnvironment } from "../simulation/environment-step.js";
import { updateWorkers } from "../simulation/worker-step.js";
import { updatePredators } from "../simulation/predator-step.js";
import { updateBroodLifecycle } from "../colony/lifecycle.ts";
import { updateNutrition } from "../colony/nutrition.ts";
import { leaveCorpse, spoilStocks } from "../colony/waste.ts";
import { dropSoil } from "../soil/ledger.ts";
import { updateErosion } from "../soil/erosion.ts";
import { updateNestOdors } from "../chemistry/nest-odors.ts";
import { invalidateNeighbors } from "../navigation/sensors.ts";
import { isClaustral } from "../founding/types.ts";
export function advanceFamily(root: FamilyWorld) {
  const suitability = updateEnvironment(root),
    colonies = colonyWorlds(root);
  for (const w of colonies) if (w !== root) bindHabitat(root, w);
  bindNeighbors(root);
  updateNestOdors(root.nest, root.nestOdors);
  updateErosion(root);
  const dead = new Set<number>();
  for (const w of colonies) {
    w.nextId = root.nextId;
    w.remainingFoundations = MAX_COLONIES - colonyWorlds(root).length;
    w.capacityOffset =
      allAnts(root).length +
      allBrood(root).length -
      w.ants.length -
      w.brood.length;
    updateBroodLifecycle(w, suitability);
    invalidateNeighbors(w);
    bindNeighbors(root);
    for (const id of updateWorkers(w, suitability)) dead.add(id);
    root.nextId = w.nextId;
  }
  const habitat = Object.create(root) as FamilyWorld;
  habitat.ants = allAnts(root);
  const beforePredation = new Set(dead);
  updatePredators(habitat, dead);
  root.predators = habitat.predators;
  for (const w of colonies)
    for (const a of w.ants)
      if (
        dead.has(a.id) &&
        !beforePredation.has(a.id) &&
        a.deathCause === "predation"
      )
        w.deaths++;
  for (const w of colonies) {
    for (const a of w.ants)
      if (dead.has(a.id)) {
        dropSoil(w, a);
        leaveCorpse(w, a);
      }
    w.ants = w.ants.filter((a) => !dead.has(a.id));
    w.predators = root.predators;
    invalidateNeighbors(w);
  }
  bindNeighbors(root);
  for (const w of colonies) {
    updateNutrition(w);
    spoilStocks(w);
    if (!isClaustral(w) && w.food < 1 && w.tick - w.lastWarning > 200) {
      w.lastWarning = w.tick;
      root.log(
        "Colônia " +
          (w.colonyId || 1) +
          ": reserva baixa. As operárias precisam coletar alimento.",
        "danger",
      );
    }
  }
  coordinateFlights(root);
  if (root.tick - root.lastRecord >= 25) root.record();
}
