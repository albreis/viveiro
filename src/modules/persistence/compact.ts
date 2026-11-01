import type { WorldWire, SessionState } from "./types.ts";
/** Keep this contract in sync with colonies/shared.bindHabitat; personal/RNG state is never shared. */
export const HABITAT_KEYS = [
  "microclimate",
  "gases",
  "ecology",
  "socialChemistry",
  "nest",
  "landscape",
  "soil",
  "nestOdors",
  "pheromones",
  "plants",
  "patches",
  "predators",
  "params",
  "tick",
] as const;
function compactWorld(world: WorldWire) {
  for (const child of world.colonies || []) {
    const keys: string[] = [];
    for (const key of HABITAT_KEYS)
      if (
        Object.hasOwn(world, key) &&
        Object.hasOwn(child, key) &&
        JSON.stringify(world[key]) === JSON.stringify(child[key])
      ) {
        delete child[key];
        keys.push(key);
      }
    if (keys.length) child.habitatKeys = keys;
  }
}
function expandWorld(world: WorldWire) {
  for (const child of world.colonies || []) {
    const keys = child.habitatKeys;
    if (keys !== undefined) {
      if (!Array.isArray(keys) || keys.length > HABITAT_KEYS.length)
        throw new Error("Referência de habitat inválida.");
      for (const key of keys) {
        if (
          !(HABITAT_KEYS as readonly string[]).includes(key) ||
          !Object.hasOwn(world, key) ||
          Object.hasOwn(child, key)
        )
          throw new Error("Campo compartilhado inválido.");
        child[key] = world[key];
      }
      delete child.habitatKeys;
    }
  }
}
export function compactSession(session: SessionState) {
  const result = structuredClone(session);
  compactWorld(result.world);
  if (result.comparison) compactWorld(result.comparison);
  return result;
}
export function expandSession(session: SessionState) {
  const result = structuredClone(session);
  expandWorld(result.world);
  if (result.comparison) expandWorld(result.comparison);
  return result;
}
