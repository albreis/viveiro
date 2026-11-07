import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { isClaustral } from "../founding/types.ts";
import { physicalStockVisit } from "../stores/local.ts";
import { takeStock } from "../stores/ledger.ts";
import type { ColonyAgent, ColonyWorld } from "./types.ts";
import { contactAcrossAir } from "./contact.ts";
import { modelMath } from "../../libs/model-math.ts";

const PORTION = 0.18;

export function seedMeals(world: Pick<ColonyWorld, "biologicalProfile">) {
  return (
    world.biologicalProfile !== undefined &&
    resolveBiologicalProfile(world.biologicalProfile).seedMeals === true
  );
}

export function takeSeedRation(world: ColonyWorld, ant: ColonyAgent) {
  if (
    ant.kind !== "worker" ||
    ant.seedRation ||
    !world.ants.some((a) => a.kind === "queen" && a.crop < 0.3) ||
    !physicalStockVisit(world, ant)
  )
    return;
  const portion = takeStock(
    world,
    PORTION,
    "care",
    ant.node ?? undefined,
    true,
  );
  if (portion > 0) ant.seedRation = portion;
}

export function serveSeedRation(
  world: ColonyWorld,
  ant: ColonyAgent,
  queen: ColonyAgent | undefined,
) {
  if (
    !ant.seedRation ||
    !queen ||
    isClaustral(world) ||
    ant.node === null ||
    ant.node !== queen.node ||
    modelMath.hypot(
      ant.x - queen.x,
      (ant.y ?? 0) - (queen.y ?? 0),
      ant.z - queen.z,
    ) > 1 ||
    !contactAcrossAir(world.nest, ant, queen)
  )
    return;
  const portion = Math.min(ant.seedRation, Math.max(0, 0.6 - queen.crop));
  queen.crop += portion;
  ant.seedRation -= portion;
  if (ant.seedRation === 0) delete ant.seedRation;
}

export function validateSeedRations(ants: unknown[], enabled: boolean) {
  for (const item of ants) {
    const ant = item as { kind?: unknown; seedRation?: unknown } | null;
    const portion = ant?.seedRation;
    if (
      portion !== undefined &&
      (!enabled ||
        ant?.kind !== "worker" ||
        typeof portion !== "number" ||
        !Number.isFinite(portion) ||
        portion <= 0 ||
        portion > PORTION)
    )
      throw Error("Porção de sementes inválida.");
  }
}
