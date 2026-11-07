import { reproductiveWindow } from "../biology/reproductive-calendar.ts";
import { canFertilize } from "../fertility/model.ts";
import { addStock, takeStock } from "../stores/ledger.ts";
import { layingComfort } from "../development/sensing.ts";
import type { ColonyWorld } from "../colony/types.ts";
import { makeBrood } from "../colony/brood.ts";
import { roomNode } from "../colony/rooms.ts";
import { LIMIT } from "../simulation/constants.js";
import { isClaustral } from "../founding/types.ts";
/** The daughter carries eight food units already paid by her source colony. */
export const GYNE_COST = 9,
  MALE_COST = 1.2,
  DAUGHTER_RESERVE = 8;
export function laySexualBrood(w: ColonyWorld) {
  const queen = w.ants.find((a) => a.kind === "queen" && (a.health ?? 100) > 0);
  w.colony.reproductiveFood ??= 0;
  if (w.remainingFoundations === 0 || !canFertilize(w)) {
    addStock(w, w.colony.reproductiveFood, "refund");
    w.colony.reproductiveFood = 0;
    return false;
  }
  if (w.food < 0.2 || !queen || w.queenHealth < 40) {
    const refund = Math.min(
      w.colony.reproductiveFood,
      Math.max(0, 1.2 - w.food),
    );
    addStock(w, refund, "refund");
    w.colony.reproductiveFood -= refund;
  }
  if (
    !queen ||
    !reproductiveWindow(w, "alates") ||
    layingComfort(w) <= 0 ||
    queen.age < 25 ||
    w.queenHealth < 60 ||
    isClaustral(w) ||
    w.ants.filter((a) => a.kind === "worker").length < 12 ||
    w.remainingFoundations === 0 ||
    w.tick - (w.lastSexualLaying ?? -3000) < 3000 ||
    w.ants.some((a) => a.sexual) ||
    w.brood.some((b) => b.kind === "gyne" || b.kind === "male") ||
    w.population + w.brood.length + (w.capacityOffset || 0) + 2 > LIMIT
  )
    return false;
  const investment = GYNE_COST + MALE_COST;
  const deposit = Math.min(
    Math.max(0, investment - w.colony.reproductiveFood),
    Math.max(0, w.food - 1.2),
  );
  takeStock(w, deposit, "sexual");
  w.colony.reproductiveFood += deposit;
  if (w.colony.reproductiveFood < investment - 1e-9) return false;
  const nursery = roomNode(w.nest, "nursery", 0, w.colonyId || 1);
  for (const kind of ["gyne", "male"] as const)
    w.brood.push(makeBrood(w, w.nextId++, nursery, kind));
  w.colony.reproductiveFood = Math.max(
    0,
    w.colony.reproductiveFood - investment,
  );
  w.lastSexualLaying = w.tick;
  w.log(
    "A colônia investiu em uma princesa e um zangão para o próximo voo.",
    "birth",
  );
  return true;
}
