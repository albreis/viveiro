import { allAnts, colonyWorlds, type FamilyWorld } from "./types.ts";
const owners = new WeakMap<object, Map<number, FamilyWorld>>();
export const ownerWorld = (world: object, id: number) =>
  owners.get(world)?.get(id);
/** Shared habitat; food, brood, genome, RNG and health remain in each colony's own state. */
export function bindHabitat(root: FamilyWorld, child: FamilyWorld) {
  if (root.decisionExtension) {
    child.decisionExtension = { ...root.decisionExtension };
    child.extensionDecisions ??= 0;
  }
  child.microclimate = root.microclimate;
  child.gases = root.gases;
  child.ecology = root.ecology;
  child.socialChemistry = root.socialChemistry;
  child.nest = root.nest;
  child.landscape = root.landscape;
  child.soil = root.soil;
  child.nestOdors = root.nestOdors;
  child.pheromones = root.pheromones;
  child.plants = root.plants;
  child.patches = root.patches;
  child.predators = root.predators;
  child.params = root.params;
  child.tick = root.tick;
}
export function bindNeighbors(root: FamilyWorld) {
  const agents = allAnts(root),
    registry = new Map(colonyWorlds(root).map((w) => [w.colonyId || 1, w]));
  for (const w of colonyWorlds(root)) owners.set(w, registry);
  for (const w of colonyWorlds(root))
    Object.defineProperty(w, "neighborAgents", {
      value: agents,
      writable: true,
      configurable: true,
      enumerable: false,
    });
}
export function restoreColonies(
  root: FamilyWorld,
  prototype: object,
  restore: (snapshot: unknown, prototype: object) => FamilyWorld,
) {
  root.colonyId ??= 1;
  root.colonies = (root.colonies || []).map((raw) => restore(raw, prototype));
  for (const w of colonyWorlds(root)) {
    for (const a of w.ants) a.colonyId ??= w.colonyId || 1;
    if (
      w.founding &&
      w.founding.front === undefined &&
      w.nest.nodes[0]?.name === "Primeiro buraco"
    ) {
      w.founding.entry = 0;
      w.founding.front = 1;
    }
    if (w !== root) bindHabitat(root, w);
  }
  bindNeighbors(root);
}
