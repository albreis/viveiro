import type { FoundingWorld } from "../founding/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import type { EntrancePlug } from "./types.ts";
/** Reclaim actual local spoil; cumulative deposition is retained for old saves and metrics. */
export function reclaimSpoil(
  w: FoundingWorld,
  a: ColonyAgent,
  wanted: number,
): number {
  const pile = w.soil.deposits.find(
    (p) => p.mass > 0 && Math.hypot(a.x - p.x, a.z - p.z) < 0.45,
  );
  if (!pile) return 0;
  const amount = Math.min(pile.mass, Math.max(0, wanted));
  pile.mass -= amount;
  w.soil.reclaimed = (w.soil.reclaimed || 0) + amount;
  a.carryingSoil = (a.carryingSoil || 0) + amount;
  return amount;
}
export function updatePlugRadius(p: EntrancePlug): void {
  if (p.mass >= p.capacity - 1e-10) {
    p.innerRadius = 0;
    return;
  }
  if (p.mass <= 1e-10) {
    p.innerRadius = p.radius;
    return;
  }
  let remaining = p.mass;
  for (let i = p.shells.length - 1; i >= 0; i--) {
    const volume = p.shells[i];
    if (remaining >= volume) {
      remaining -= volume;
      continue;
    }
    const outer = (p.radius * (i + 1)) / p.shells.length,
      inner = (p.radius * i) / p.shells.length;
    p.innerRadius = Math.sqrt(
      outer * outer - (outer * outer - inner * inner) * (remaining / volume),
    );
    return;
  }
}
export function fillPlug(
  w: FoundingWorld,
  a: ColonyAgent,
  p: EntrancePlug,
  limit: number,
): number {
  const amount = Math.min(
    Math.max(0, limit),
    a.carryingSoil || 0,
    p.capacity - p.mass,
  );
  if (amount <= 0) return 0;
  a.carryingSoil = (a.carryingSoil || 0) - amount;
  p.mass += amount;
  updatePlugRadius(p);
  w.nest.revision++;
  return amount;
}
export function removePlug(
  w: FoundingWorld,
  a: ColonyAgent,
  p: EntrancePlug,
  limit: number,
): number {
  const amount = Math.min(Math.max(0, limit), p.mass);
  if (amount <= 0) return 0;
  p.mass -= amount;
  a.carryingSoil = (a.carryingSoil || 0) + amount;
  updatePlugRadius(p);
  w.nest.revision++;
  return amount;
}
