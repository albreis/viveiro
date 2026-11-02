import type { ColonyWorld } from "../colony/types.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { addWaste } from "../colony/waste.ts";
import { takeStock } from "./ledger.ts";
import { STORE_PARAMETERS as p } from "./types.ts";
export function spoilRoomStocks(w: ColonyWorld): void {
  for (const b of [...(w.colony.stores?.bins ?? [])]) {
    const r = sampleClimate(w.microclimate, b.point),
      water = r?.water ?? 0.55;
    const thermal = Math.max(
      0.25,
      Math.min(2, 1 + ((r?.temperature ?? 24) - 24) / 20),
    );
    const loss =
      b.amount * Math.max(0, water - p.spoilWater) * p.spoilRate * thermal;
    const amount = takeStock(w, loss, "spoilage", b.node, true);
    if (amount <= 0) continue;
    w.colony.spoiled += amount;
    addWaste(w, { ...b.point, mass: amount, kind: "food", stored: false });
  }
}
