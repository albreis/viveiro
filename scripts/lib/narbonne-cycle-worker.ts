import assert from "node:assert/strict";
import { parentPort, workerData } from "node:worker_threads";
import { installPortableMath } from "../../src/libs/portable-math.ts";
import { World } from "../../src/modules/simulation/world.js";
import { normalizeExperiment } from "../../src/modules/experiments/plan.ts";
import { experimentResult } from "../../src/modules/experiments/result.ts";
import { dailyCsv } from "../../src/modules/observations/csv.ts";
import {
  colonyWorlds,
  allAnts,
  allBrood,
} from "../../src/modules/colonies/types.ts";
import { stockBalance } from "../../src/modules/stores/ledger.ts";
import { soilBalance } from "../../src/modules/soil/ledger.ts";
import { maternalBalance } from "../../src/modules/maternal/pools.ts";
import { reproductiveWindow } from "../../src/modules/biology/reproductive-calendar.ts";

installPortableMath();
const plan = normalizeExperiment(workerData);
if (plan.extension)
  throw Error("A comparação de ciclo usa o motor sem extensão.");
const world = new World(
  plan.seed,
  { ...plan.parameters },
  {
    founding: plan.startMode === "founding",
    biologicalProfile: plan.biologicalProfile,
  },
);
let firstEggTick: number | null = null;
let firstWorkerTick: number | null = null;
let establishedTick: number | null = null;
const samples: object[] = [];
function sample() {
  const soil = soilBalance(world);
  const foodErrors = colonyWorlds(world).flatMap((colony) => {
    const stock = stockBalance(colony);
    const maternal = colony.founding?.maternal;
    return [
      stock?.ledger ?? 0,
      stock?.rooms ?? 0,
      maternal ? maternalBalance(maternal).error : 0,
    ];
  });
  assert.ok(Math.abs(soil.error) < 1e-7);
  assert.ok(foodErrors.every((error) => Math.abs(error) < 1e-7));
  samples.push({
    day: world.tick / 100,
    adults: allAnts(world).length,
    workers: allAnts(world).filter((a) => a.kind === "worker").length,
    brood: allBrood(world).length,
    food: colonyWorlds(world).reduce((sum, c) => sum + c.food, 0),
    queenHealth: world.queenHealth,
    soilRemoved: soil.removed,
    soilEroded: soil.eroded,
    balanceMaxError: Math.max(
      Math.abs(soil.error),
      ...foodErrors.map(Math.abs),
    ),
    laying: reproductiveWindow(world, "laying"),
    phase: world.founding?.phase ?? "established",
  });
}
sample();
while (world.tick < plan.days * 100) {
  world.step();
  if (firstEggTick === null && world.founding?.firstClutch)
    firstEggTick = world.tick;
  if (firstWorkerTick === null && world.workers.length)
    firstWorkerTick = world.tick;
  if (establishedTick === null && world.founding?.phase === "established")
    establishedTick = world.tick;
  if (world.tick % 100 === 0) sample();
}
const result = await experimentResult(
  plan,
  dailyCsv([{ id: "a", world }]),
  world.rng,
);
parentPort!.postMessage({
  result,
  firstEggTick,
  firstWorkerTick,
  establishedTick,
  samples,
});
