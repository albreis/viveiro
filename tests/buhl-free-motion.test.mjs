import assert from "node:assert/strict";
import test from "node:test";
import { measureBuhlFreeMotion } from "../scripts/lib/buhl-free-motion.ts";

test("deslocamento livre tem variação individual e escala física permanece opcional", () => {
  const raw = measureBuhlFreeMotion();
  const { individual, mean, sampleSd } = raw.speedModelUnitsPerTick;
  assert.equal(individual.length, 64);
  assert.ok(individual.every((v) => v > 0.06 && v < 0.12));
  assert.ok(sampleSd > 0);
  assert.deepEqual(raw, measureBuhlFreeMotion());
  assert.equal(raw.candidateSecondsPerTick, null);
  assert.equal(raw.calibrated, false);

  const converted = measureBuhlFreeMotion(100);
  assert.deepEqual(
    converted.speedModelUnitsPerTick,
    raw.speedModelUnitsPerTick,
  );
  assert.equal(converted.candidateSecondsPerTick, (mean * 100) / 15.05);
  assert.equal(converted.calibrated, false);
  for (const scale of [0, -1, Number.NaN, Infinity])
    assert.throws(() => measureBuhlFreeMotion(scale), /positiva e finita/);
});
