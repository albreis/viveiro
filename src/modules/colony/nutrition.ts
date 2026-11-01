import { contactAcrossAir } from "./contact.ts";
import { neighborsOf } from "../navigation/sensors.ts";
import type { ColonyAgent, ColonyWorld } from "./types.ts";
import { ensureIndividual } from "./individual.ts";

export function shareCrop(donor: ColonyAgent, receiver: ColonyAgent) {
  const amount = Math.min(
    Math.max(0, (donor.crop - receiver.crop) / 2),
    0.6 - receiver.crop,
    donor.crop,
  );
  if (amount <= 0) return 0;
  donor.crop -= amount;
  receiver.crop += amount;
  return amount;
}
export function feedFromStock(world: ColonyWorld, ant: ColonyAgent) {
  ensureIndividual(world.seed, ant);
  const amount = Math.max(0, Math.min(0.3, 0.6 - ant.crop, world.food));
  ant.stockEmptyUntil = amount > 0 ? 0 : world.tick + 150;
  ant.crop += amount;
  world.food -= amount;
}
export function updateNutrition(world: ColonyWorld) {
  for (const ant of world.ants) {
    ensureIndividual(world.seed, ant);
    const queen = ant.kind === "queen";
    if (queen) {
      const fed = ant.crop >= 0.0006,
        amount = Math.min(ant.crop, 0.0006);
      ant.crop -= amount;
      world.queenHealth = Math.max(
        0,
        Math.min(100, world.queenHealth + (fed ? 0.018 : -0.09)),
      );
      ant.energy = world.queenHealth;
    } else if (ant.energy < 100 && ant.crop > 0) {
      const amount = Math.min(ant.crop, 0.0003, (100 - ant.energy) / 500);
      ant.crop -= amount;
      ant.energy = Math.min(100, ant.energy + amount * 500);
    }
    if (ant.crop < 0.04 || (ant.socialUntil || 0) > world.tick) continue;
    const partner = neighborsOf(world, ant, 0.5).find(
      (p) =>
        ((p as ColonyAgent).crop ?? 0) < ant.crop - 0.04 &&
        ((p as ColonyAgent).socialUntil || 0) <= world.tick &&
        contactAcrossAir(world.nest, ant, p),
    ) as ColonyAgent | undefined;
    if (!partner) continue;
    ensureIndividual(world.seed, partner);
    const shared = shareCrop(ant, partner);
    if (shared <= 0) continue;
    ant.socialUntil = partner.socialUntil = world.tick + 12;
    ant.socialPartner = partner.id;
    partner.socialPartner = ant.id;
    world.colony.shared += shared;
    world.colony.exchanges++;
  }
}
