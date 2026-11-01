import { loseFoundressLoad } from "../semiclaustral/budget.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { roomNode } from "./rooms.ts";
import type { ColonyAgent, ColonyWorld, Waste } from "./types.ts";

export function addWaste(world: ColonyWorld, item: Omit<Waste, "id">) {
  if (world.colony.waste.length >= 128) {
    const existing = world.colony.waste.find(
      (w) => w.stored === item.stored && w.kind === item.kind && !w.carrier,
    );
    if (existing) {
      existing.mass += item.mass;
      return;
    }
  }
  world.colony.waste.push({ ...item, id: world.nextId++ });
}
export function leaveCorpse(world: ColonyWorld, ant: ColonyAgent) {
  loseFoundressLoad(world, ant);
  for (const item of world.colony.waste)
    if (item.carrier === ant.id) {
      delete item.carrier;
      item.x = ant.x;
      item.y = (ant.y || 0) + 0.02;
      item.z = ant.z;
    }
  for (const b of world.brood)
    if (b.carrier === ant.id) {
      delete b.carrier;
      b.x = ant.x;
      b.y = (ant.y || 0) + 0.02;
      b.z = ant.z;
      b.node =
        ant.node ?? roomNode(world.nest, "royal", 0, world.colonyId || 1);
    }
  if (ant.deathCause === "predation") return;
  addWaste(world, {
    x: ant.x,
    y: (ant.y || 0) + 0.03,
    z: ant.z,
    mass: ant.kind === "queen" ? 0.16 : 0.04,
    kind: "corpse",
    stored: false,
  });
}
export function spoilStocks(world: ColonyWorld) {
  if (world.tick % 100 || world.food <= 0) return;
  const storage =
    world.nest.nodes[roomNode(world.nest, "storage", 0, world.colonyId || 1)];
  if (!storage) return;
  const local = sampleClimate(world.microclimate, storage),
    water = local?.water ?? 0.55;
  const thermal = Math.max(
    0.25,
    Math.min(2, 1 + ((local?.temperature ?? 24) - 24) / 20),
  );
  const amount = Math.min(
    world.food,
    world.food * Math.max(0, water - 0.75) * 0.005 * thermal,
  );
  if (amount <= 0) return;
  world.food -= amount;
  world.colony.spoiled += amount;
  addWaste(world, {
    x: storage.x,
    y: storage.y - storage.r + 0.04,
    z: storage.z,
    mass: amount,
    kind: "food",
    stored: false,
  });
}
