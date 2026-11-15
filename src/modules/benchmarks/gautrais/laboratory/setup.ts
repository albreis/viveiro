import { World } from "../../../simulation/world.js";
import { hashSeed } from "../../../simulation/seed.ts";
import {
  profileReference,
  resolveBiologicalProfile,
} from "../../../biology/catalog.ts";
import { createSoilState } from "../../../soil/ledger.ts";
import { createColonyState } from "../../../colony/individual.ts";
import { createNestOdors } from "../../../chemistry/nest-odors.ts";
import { initializeRoomStores } from "../../../stores/initialize.ts";
import { invalidateNeighbors } from "../../../navigation/sensors.ts";
import { positionClear } from "../../../navigation/collision.ts";
import { modelMath } from "../../../../libs/model-math.ts";
import type { LessonWorld } from "../../../lessons/world.ts";
import { laboratoryGeometry } from "./geometry.ts";
import { legacyClockAudit } from "./scale.ts";
export interface LaboratorySetupOptions {
  seed: string;
  workers: 50 | 100 | 200;
  temperatureC: number;
  humidityPercent: number;
  coverThicknessMm: number;
}
export type LaboratoryWorld = LessonWorld & {
  step(count?: number): void;
  advance(): void;
};
export function prepareLaboratoryWorld(options: LaboratorySetupOptions) {
  if (
    !options ||
    !/^[A-Z0-9:_-]{1,64}$/.test(options.seed) ||
    ![50, 100, 200].includes(options.workers) ||
    !Number.isFinite(options.temperatureC) ||
    options.temperatureC < -10 ||
    options.temperatureC > 50 ||
    !Number.isFinite(options.humidityPercent) ||
    options.humidityPercent < 0 ||
    options.humidityPercent > 100
  )
    throw Error("Invalid laboratory setup options");
  const reference = profileReference("messor-narbonne", 3),
    biology = resolveBiologicalProfile(reference).workerReference!;
  const audit = legacyClockAudit(biology.bodyMm),
    geometry = laboratoryGeometry(audit, options.coverThicknessMm);
  const world = new World(
    options.seed,
    {
      temperatureC: options.temperatureC,
      humidity: options.humidityPercent,
      windX: 0,
      windZ: 0,
      light: 100,
    },
    { founding: false, biologicalProfile: reference },
  ) as unknown as LaboratoryWorld;
  Object.assign(world, {
    ants: [],
    brood: [],
    colonies: [],
    predators: [],
    plants: [],
    patches: [],
    events: [],
    history: [],
    nextId: 1,
    food: 0,
    deaths: 0,
    born: options.workers,
    rng: hashSeed(options.seed + ":laboratory-k1"),
    landscape: {
      version: 1,
      biome: "scrub",
      relief: [],
      ponds: [],
      logs: [],
      rocks: [],
      wetness: 0,
      litter: 0,
      rainPulse: 0,
    },
    nest: {
      nodes: [],
      links: [],
      linkWidths: [],
      revision: 2,
      relief: [],
      laboratory: geometry,
    },
    soil: createSoilState(),
    colony: createColonyState(),
  });
  world.nestOdors = createNestOdors(world.nest);
  initializeRoomStores(world);
  const minimumRadius = geometry.sandRadius + 1,
    maximumRadius = geometry.arenaRadius - 1;
  for (let i = 0; i < options.workers; i++) {
    const ant = world.makeAnt("worker", 0, 0);
    let placed = false;
    for (let attempt = 0; attempt < 256; attempt++) {
      const angle = world.range(0, 2 * Math.PI),
        radius = Math.sqrt(
          world.range(
            minimumRadius * minimumRadius,
            maximumRadius * maximumRadius,
          ),
        ),
        point = {
          x: radius * modelMath.cos(angle),
          y: -geometry.sandDepth + 0.008,
          z: radius * modelMath.sin(angle),
        };
      // Conservative envelope also excludes overlap in the other ant's heading.
      if (
        world.ants.some((other) => {
          const dx = point.x - other.x,
            dz = point.z - other.z,
            separation =
              (0.65 * ((ant.bodyScale || 1) + (other.bodyScale || 1))) / 2;
          return dx * dx + dz * dz < separation * separation;
        }) ||
        !positionClear(
          world,
          ant,
          point,
          ant.angle,
          0,
          { x: 0, y: 1, z: 0 },
          false,
        )
      )
        continue;
      Object.assign(ant, point, {
        age: 20,
        route: [],
        node: null,
        normal: { x: 0, y: 1, z: 0 },
      });
      world.ants.push(ant);
      invalidateNeighbors(world);
      placed = true;
      break;
    }
    if (!placed)
      throw Error("Laboratory cohort does not fit without body overlap");
  }
  return {
    world,
    report: {
      engine: "World" as const,
      phase: "geometry-preparation" as const,
      options: { ...options },
      geometry: { ...geometry },
      legacyClockAudit: audit,
      biologicalProfile: reference,
      initialSubstrate: "blank-sand-disk" as const,
      initialWorkerPlacement: "assumed uniform annulus outside sand" as const,
      retainedSoilWaterConfigured: false,
      coverThicknessSource: "explicit computational assumption" as const,
      initialSandVolumeCm3: (Math.PI * 100 * 100 * 5) / 1000,
      biologicalRulesChanged: false,
      physicalDynamicsIntegrated: false,
      physicalProtocolCompatible: false,
      reservedMetricsComputed: false,
      remaining: [
        "physical and biological clocks",
        "local navigation bounds and Fluon boundary",
        "excavation/transport volume and mass",
        "temporal alignment and observation convergence",
      ],
    },
  };
}
