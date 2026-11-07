import type { ColonyWorld, ColonyAgent } from "../../colony/types.ts";

interface StudyWorld extends ColonyWorld {
  readonly day: number;
  readonly workers: ColonyAgent[];
  rng: number;
  range(min: number, max: number): number;
  step(count?: number): void;
}
import { World, BOUNDS, TICKS_PER_DAY } from "../../simulation/world.js";
import { profileReference } from "../../biology/catalog.ts";
import { soilBalance } from "../../soil/ledger.ts";

/** First baseline uses the actual terrarium engine; it is not yet a Buhl replica. */
export function createTerrariumStudy(seed: string, workers: number) {
  if (![50, 100, 200].includes(workers))
    throw Error("Use 50, 100 ou 200 operárias.");
  if (!seed || seed.length > 128) throw Error("Seed inválida.");
  const world = new World(
    seed,
    { humidity: 68, temperatureC: 24 },
    {
      founding: false,
      biologicalProfile: profileReference("messor-narbonne", 2),
    },
  ) as unknown as StudyWorld;
  world.ants = [];
  world.brood = [];
  world.predators = [];
  for (let i = 0; i < workers; i++) {
    const ant = world.makeAnt(
      "worker",
      world.range(-BOUNDS.x, BOUNDS.x),
      world.range(-BOUNDS.z, BOUNDS.z),
    );
    ant.age = 10;
    world.ants.push(ant);
  }
  return world;
}
export function runTerrariumStudyBaseline(
  seed: string,
  workers: number,
  ticks = 100,
) {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 5000)
    throw Error("Use de 0 a 5000 passos no piloto.");
  const world = createTerrariumStudy(seed, workers);
  const samples: object[] = [];
  const sample = () => {
    const soil = soilBalance(world);
    if (Math.abs(soil.error) > 1e-7)
      throw Error("Balanço de solo inconsistente.");
    samples.push({
      tick: world.tick,
      modelDays: world.day,
      workers: world.workers.length,
      removedModelVolume: soil.removed,
      erodedModelVolume: soil.eroded,
      carriedModelVolume: soil.carried,
      depositedModelVolume: soil.deposited,
      soilError: soil.error,
    });
  };
  sample();
  for (let i = 0; i < ticks; i++) {
    world.step();
    if (world.tick % 100 === 0 || i === ticks - 1) sample();
  }
  return {
    schema: "viveiro-terrarium-study-baseline-v1",
    engine: "Viveiro.World",
    calibrated: false,
    buhlComparable: false,
    seed,
    initialWorkers: workers,
    ticksPerModelDay: TICKS_PER_DAY,
    blockers: [
      "Use physical biological time rather than accelerated model days.",
      "Construct the experimental geometry with explicit millimetres and soil depth.",
      "Validate soil volume and carried-load units against the study.",
      "Validate initial placement and remove pre-existing galleries for the controlled assay.",
    ],
    biologicalProfile: world.biologicalProfile,
    samples,
    finalRng: world.rng,
  };
}
