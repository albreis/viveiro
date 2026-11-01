import type { SoilAgent, SoilState, SoilWorld } from "./types.ts";
import type { Vec3 } from "../navigation/types.ts";

export function createSoilState(ants: SoilAgent[] = []): SoilState {
  return {
    version: 1,
    removed: ants.reduce((n, a) => n + (a.carryingSoil || 0), 0),
    eroded: 0,
    deposited: 0,
    deposits: [],
    projects: [],
    integrity: [],
    lastProject: -500,
    nextId: 1,
  };
}
export function removedSoil(world: SoilWorld, ant: SoilAgent, mass: number) {
  if (!(mass > 0)) return;
  world.soil.removed += mass;
  ant.carryingSoil = (ant.carryingSoil || 0) + mass;
}
export function depositSoil(world: SoilWorld, ant: SoilAgent) {
  const mass = ant.carryingSoil || 0;
  if (!mass) return;
  const piles = world.soil.deposits;
  let pile = piles.find((p) => Math.hypot(p.x - ant.x, p.z - ant.z) < 0.45);
  if (!pile) {
    pile = {
      id: world.soil.nextId++,
      x: ant.x,
      y: ant.y || 0,
      z: ant.z,
      mass: 0,
    };
    piles.push(pile);
  }
  pile.mass += mass;
  world.soil.deposited += mass;
  ant.carryingSoil = 0;
}
export function dropSoil(world: SoilWorld, ant: SoilAgent) {
  const mass = ant.carryingSoil || 0;
  if (!mass) return;
  world.nest.rubble ??= [];
  world.nest.rubble.push({
    id: world.soil.nextId++,
    x: ant.x,
    y: (ant.y || 0) - 0.06,
    z: ant.z,
    mass,
  });
  ant.carryingSoil = 0;
  world.nest.revision++;
}
export function soilBalance(world: SoilWorld) {
  const carried = world.ants.reduce((n, a) => n + (a.carryingSoil || 0), 0);
  const loose = (world.nest.rubble || []).reduce((n, p) => n + p.mass, 0);
  const input = world.soil.removed + world.soil.eroded;
  return {
    removed: world.soil.removed,
    eroded: world.soil.eroded,
    carried,
    loose,
    deposited: world.soil.deposited,
    error: input - carried - loose - world.soil.deposited,
  };
}
export const pileRadius = (mass: number) =>
  Math.cbrt((Math.max(0, mass) * 3) / (4 * Math.PI));
export const distance3 = (a: Vec3, b: Vec3) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
