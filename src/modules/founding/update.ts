import type { FoundingWorld } from "./types.ts";
import { changePhase, founder, isClaustral, spendReserve } from "./types.ts";
import { updateFlight, landMale } from "./flight.ts";
import { updateFoundingDig } from "./excavation.ts";
export function updateFounding(world: FoundingWorld) {
  const f = world.founding;
  if (!f || ["established", "failed"].includes(f.phase)) return;
  landMale(world);
  const queen = founder(world);
  if (!queen) {
    changePhase(world, "failed", "A fundação terminou com a perda da rainha.");
    return;
  }
  const paid = spendReserve(world, "maintenance", 0.001);
  if (paid < 0.001) world.queenHealth = Math.max(0, world.queenHealth - 0.15);
  queen.energy = world.queenHealth;
  if (world.queenHealth <= 0) {
    changePhase(
      world,
      "failed",
      "As reservas maternas se esgotaram antes de sustentar a colônia.",
    );
    return;
  }
  if (["weather", "flight", "landing", "dealate"].includes(f.phase))
    updateFlight(world);
  else if (f.phase === "digging") updateFoundingDig(world);
  else if (f.phase === "claustral")
    queen.state = "Cuidando da prole com reservas maternas";
}
export { isClaustral };
