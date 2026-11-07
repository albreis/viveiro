import { resolveBiologicalProfile } from "../../biology/catalog.ts";
import { referenceWorkerMorphology } from "../../biology/worker-morphology.ts";
import {
  MESH_BODY_UNITS,
  temperatureWalkingFactor,
} from "../../biology/worker-reference.ts";
import type { BuhlLabPlan } from "./settings.ts";
import { BUHL_WALKING_OBSERVATION } from "./locomotion.ts";

export interface BuhlWorkerBody {
  bodyScale: number;
  headScale: number;
}
export class BuhlWorkerProfile {
  readonly reference;
  readonly walkingMmPerSecond: number;
  readonly mmPerModelUnit: number;
  readonly soilLoadFactor: number;
  constructor(plan: BuhlLabPlan) {
    const reference = resolveBiologicalProfile(
      plan.workerProfile,
    ).workerReference;
    if (!reference || !plan.microclimate)
      throw Error("O perfil de operárias exige porte e temperatura explícita.");
    this.reference = reference;
    this.mmPerModelUnit = reference.bodyMm / MESH_BODY_UNITS;
    this.soilLoadFactor =
      plan.locomotion?.soilLoadFactor ??
      reference.tunnelWalking?.soilLoadFactor ??
      1;
    this.walkingMmPerSecond =
      plan.locomotion?.walkingSource === "buhl-observed"
        ? BUHL_WALKING_OBSERVATION.meanMmPerSecond
        : reference.openWalkingMmPerSecond *
          temperatureWalkingFactor(reference, plan.microclimate.temperatureC);
  }
  body(seed: string, id: number): BuhlWorkerBody {
    return referenceWorkerMorphology(this.reference, seed, id);
  }
  walkingSpeed(loadFraction: number, underground: boolean) {
    const penalty = underground ? this.soilLoadFactor : 1;
    return (
      this.walkingMmPerSecond * (1 - Math.min(1, loadFraction) * (1 - penalty))
    );
  }
}
