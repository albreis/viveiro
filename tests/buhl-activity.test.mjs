import assert from "node:assert/strict";
import { test } from "node:test";
import { BuhlActivity } from "../src/modules/benchmarks/buhl-arena/activity.ts";
import { BuhlArena } from "../src/modules/benchmarks/buhl-arena/geometry.ts";
import { runBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";

test("observação preserva a trajetória e fecha a conta de areia removida", () => {
  const plan = {
    seed: "ARENA-FADIGA-1",
    workers: 50,
    separationMm: 5,
    dryDensityMgPerMm3: 1.5,
    durationSeconds: 1200,
    sampleEverySeconds: 120,
    mechanism: "edge-follow",
    contactAccess: 0.35,
    digFatigue: "work-recovery",
  };
  const control = runBuhlLab(plan);
  const observed = runBuhlLab({ ...plan, observeActivity: true });
  assert.deepEqual(
    observed.samples.map(({ activity, ...sample }) => sample),
    control.samples,
  );
  assert.equal(observed.samples[0].activity.microgramsPerDiggingHour, null);
  const end = observed.samples.at(-1);
  assert.ok(end.activity.diggingSeconds > 0);
  assert.equal(end.activity.removedMicrograms, end.dugMicrograms);
  assert.equal(observed.activityByWorker.length, plan.workers);
  assert.equal(
    observed.activityByWorker.reduce(
      (total, worker) => total + worker.removedMicrograms,
      0,
    ),
    end.dugMicrograms,
  );
  assert.equal(end.activity.successfulDigs, end.fullPellets + end.fragments);
  assert.ok(end.activity.workersAdjacentToSand <= plan.workers);
});

test("inatividade adjacente exclui movimento recente, bloqueio e carga", () => {
  const arena = new BuhlArena();
  const cell = arena.indexAt({ xMm: 150, zMm: 0 });
  const workers = [cell, arena.neighbor(cell, 0)].map((position, i) => ({
    id: i + 1,
    cell: position,
    load: 0,
    dig: null,
  }));
  const occupied = new Uint16Array(arena.cellsPerSide * arena.cellsPerSide);
  for (const worker of workers) occupied[worker.cell] = worker.id;
  const activity = new BuhlActivity(2, 0.05);
  const count = (tick) =>
    activity.sample(arena, workers, occupied, tick).adjacentIdleWorkers;
  assert.equal(count(199), 0);
  assert.equal(count(200), 2);
  activity.blocked(1, 201);
  assert.equal(count(202), 0);
  activity.moved(2, 401);
  assert.equal(count(500), 0);
  workers[0].load = 1;
  assert.equal(count(601), 0);
});
