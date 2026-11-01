import { accessibleReserve } from "../maternal/pools.ts";
import { MATERNAL_PARAMETERS } from "../maternal/types.ts";
import { laySexualBrood } from "../colonies/sexual-brood.ts";
import type { ColonyWorld } from "./types.ts";
import { LIMIT } from "../simulation/constants.js";
import { makeBrood, broodStage } from "./brood.ts";
import { hatchWorker } from "./hatching.ts";
import { isClaustral, spendReserve } from "../founding/types.ts";
/** The first clutch is paid from a finite maternal pool; later clutches need stock. */
export function updateBroodLifecycle(world: ColonyWorld, suitability: number) {
  const f = world.founding,
    queen = world.ants.find((a) => a.kind === "queen" && (a.health ?? 100) > 0),
    closed = isClaustral(world);
  const consumption =
    world.brood.filter((b) => broodStage(b.age) === "larva").length * 0.0012;
  const paid = closed
    ? spendReserve(world, "larvae", consumption)
    : Math.min(world.food, consumption);
  if (!closed) world.food -= paid;
  const fed = paid >= consumption - 1e-10;
  laySexualBrood(world);
  if (queen) {
    if (!closed) queen.state = "Cuidando da colônia";
    const first = !!f && f.phase === "claustral" && !f.firstClutch;
    const affordable =
      first && f?.maternal
        ? Math.floor(
            (accessibleReserve(f.maternal, "eggs") + 1e-10) /
              MATERNAL_PARAMETERS.eggCost,
          )
        : Infinity;
    const layingAllowed = first
      ? f!.reserves > 2 && affordable > 0
      : !closed && world.food > 2;
    if (
      (!f || f.phase === "established" || first) &&
      world.tick >= 25 &&
      world.tick - world.lastLaying >= 65 &&
      layingAllowed &&
      world.queenHealth > 20 &&
      world.population + world.brood.length + (world.capacityOffset || 0) <
        LIMIT
    ) {
      const eggs = Math.min(
        first ? Math.min(4, affordable) : 4 + Math.floor(world.random() * 3),
        LIMIT -
          world.population -
          world.brood.length -
          (world.capacityOffset || 0),
      );
      for (let i = 0; i < eggs; i++) {
        const b = makeBrood(world, world.nextId++);
        if (first) b.nanitic = true;
        world.brood.push(b);
      }
      if (first) {
        spendReserve(world, "eggs", eggs * MATERNAL_PARAMETERS.eggCost);
        f!.firstClutch = true;
      } else
        world.food = Math.max(
          0,
          world.food - eggs * MATERNAL_PARAMETERS.eggCost,
        );
      world.lastLaying = world.tick;
      world.log(
        "A rainha colocou " +
          eggs +
          " ovos" +
          (first ? " usando reservas maternas." : "."),
        "birth",
      );
    }
  }
  const remaining = [];
  let hatched = 0,
    alates = 0;
  for (const brood of world.brood) {
    if (fed || broodStage(brood.age) !== "larva")
      brood.age += 0.006 + suitability * 0.004;
    if (
      brood.age >= 1.3 &&
      brood.carrier === undefined &&
      world.population + (world.capacityOffset || 0) < LIMIT
    ) {
      const adult = hatchWorker(world, brood);
      if (adult.sexual) alates++;
      else hatched++;
    } else remaining.push(brood);
  }
  world.brood = remaining;
  if (alates)
    world.log(alates + " alado(s) nasceram para uma futura fundação.", "birth");
  if (hatched) world.log(hatched + " operária(s) nasceram.", "birth");
  if (f?.phase === "claustral" && f.nanitics > 0) {
    f.phase = "established";
    f.since = world.tick;
    world.log(
      "As primeiras naníticas assumem o forrageamento. A colônia passa a depender do alimento externo.",
      "birth",
    );
  }
}
