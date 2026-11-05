import assert from "node:assert/strict";
import { test } from "node:test";
import { BuhlArena } from "../src/modules/benchmarks/buhl-arena/geometry.ts";
import { runBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";
import { BuhlSoilLedger } from "../src/modules/benchmarks/buhl-arena/soil.ts";

test("escavação parcial conserva a massa e abre uma célula quando o solo acaba", () => {
  const arena = new BuhlArena(1);
  const ledger = new BuhlSoilLedger(arena, 1.5);
  const from = arena.indexAt({ xMm: 100, zMm: 0 });
  const target = arena.neighbor(from, 2);
  const full = ledger.nextLoad(target);
  assert.equal(full, 1690);
  assert.equal(ledger.dig(from, target, full), full);
  assert.equal(ledger.sample().voidVolumeCm3, 0);
  assert.equal(arena.walkable(target), false);
  ledger.drop(from, full);
  assert.equal(ledger.sample().carriedMicrograms, 0);
  assert.equal(ledger.pickUp(from), full);
  assert.equal(ledger.pickUp(from), 0);
  let mass;
  while ((mass = ledger.nextLoad(target)))
    assert.equal(ledger.dig(from, target, mass), mass);
  const sample = ledger.sample();
  assert.equal(arena.walkable(target), true);
  assert.equal(sample.voidVolumeCm3, arena.cellVolumeCm3);
  assert.equal(sample.removedSoilCm3, sample.voidVolumeCm3);
  assert.equal(
    sample.dugMicrograms,
    sample.carriedMicrograms + sample.depositedMicrograms,
  );
  assert.equal(sample.fullPellets, 4);
  assert.equal(sample.fragments, 1);
  assert.equal(ledger.dig(from, target, full), 0);
});

test("a rodada física reproduz a seed, conserva massa e usa amostras em segundos", () => {
  const plan = {
    seed: "ARENA-BASE-1",
    workers: 50,
    separationMm: 5,
    dryDensityMgPerMm3: 1.5,
    durationSeconds: 7201,
    sampleEverySeconds: 1200,
    digRatePerSecond: 0.5,
  };
  const run = runBuhlLab(plan);
  assert.deepEqual(run, runBuhlLab(plan));
  assert.deepEqual(
    run.samples.map((sample) => sample.timeSeconds),
    [0, 1200, 2400, 3600, 4800, 6000, 7200, 7201],
  );
  const initial = run.samples[0];
  const final = run.samples.at(-1);
  assert.equal(initial.openedCells, 0);
  assert.equal(initial.dugMicrograms, 0);
  assert.ok(final.openedCells > 0);
  assert.ok(final.fullPellets > 0);
  assert.ok(final.drops > 0);
  assert.equal(
    final.dugMicrograms,
    final.carriedMicrograms + final.depositedMicrograms,
  );
  assert.equal(
    final.initialSandCells,
    final.remainingSandCells + final.openedCells,
  );
  assert.equal(final.trafficOpenedCells, 0);
  assert.ok(
    final.distanceMm > 0 &&
      final.distanceMm <= ((plan.durationSeconds * 1000) / 50) * 0.8 * 50,
  );
  assert.throws(
    () => runBuhlLab({ ...plan, dryDensityMgPerMm3: null }),
    /dryDensity/,
  );
  assert.throws(() => runBuhlLab({ ...plan, tickMilliseconds: 100 }), /passo/);
});
