import { test } from "node:test";
import assert from "node:assert/strict";
import {
  GENES,
  founderGenome,
  offspringGenome,
} from "../src/modules/genetics/genome.ts";
import { expressGenome } from "../src/modules/genetics/phenotype.ts";
import { World } from "../src/modules/simulation/world.js";
test("offspring inherit maternal and paternal copies reproducibly without mutating parents", () => {
  const mother = founderGenome("family", 1, "queen"),
    father = founderGenome("family", 2, "male"),
    before = JSON.stringify({ mother, father });
  const child = offspringGenome(
    mother,
    father,
    "child",
    { motherId: 1, fatherId: 2 },
    { mutationRate: 0 },
  );
  assert.equal(mother.ploidy, 2);
  assert.equal(father.ploidy, 1);
  assert.equal(child.ploidy, 2);
  assert.equal(child.generation, 1);
  assert.equal(child.motherId, 1);
  assert.equal(child.fatherId, 2);
  GENES.forEach((_, i) =>
    assert.ok(
      mother.haplotypes.some((copy) => copy[i] === child.haplotypes[0][i]),
    ),
  );
  assert.deepEqual(child.haplotypes[1], father.haplotypes[0]);
  assert.deepEqual(
    child,
    offspringGenome(
      mother,
      father,
      "child",
      { motherId: 1, fatherId: 2 },
      { mutationRate: 0 },
    ),
  );
  child.haplotypes[1][0] = 0;
  assert.equal(JSON.stringify({ mother, father }), before);
});
test("unfertilized offspring have one maternal copy and no paternal identity", () => {
  const mother = founderGenome("male", 1, "queen");
  const son = offspringGenome(
    mother,
    undefined,
    "son",
    { motherId: 1, fatherId: 999 },
    { mutationRate: 0 },
  );
  assert.equal(son.ploidy, 1);
  assert.equal(son.haplotypes.length, 1);
  assert.equal(son.fatherId, undefined);
});
test("mutation events are recorded, bounded and reproducible across generations", () => {
  const mother = founderGenome("mutant", 1, "queen"),
    father = founderGenome("mutant", 2, "male");
  const child = offspringGenome(
    mother,
    father,
    "mutant-child",
    { motherId: 1, fatherId: 2 },
    { mutationRate: 1, mutationSize: 0.2 },
  );
  assert.equal(child.mutations.length, GENES.length * 2);
  assert.ok(
    child.haplotypes
      .flat()
      .every((value) => value >= 0 && value <= 1 && Number.isFinite(value)),
  );
  assert.deepEqual(
    child,
    offspringGenome(
      mother,
      father,
      "mutant-child",
      { motherId: 1, fatherId: 2 },
      { mutationRate: 1, mutationSize: 0.2 },
    ),
  );
  const next = offspringGenome(
    child,
    father,
    "next",
    { motherId: 3, fatherId: 2 },
    { mutationRate: 0 },
  );
  assert.equal(next.generation, 2);
});
test("genes have measurable but bounded effects on locomotion, body, senses and metabolism", () => {
  const sample = () => ({
    speed: 0.09,
    bodyScale: 1,
    headScale: 1,
    traits: { activity: 0.5, courage: 0.5, exploration: 0.5 },
    thresholds: { nurse: 0.5, cleaner: 0.5, excavator: 0.5 },
  });
  const low = sample(),
    high = sample(),
    genome = (value) => ({
      ploidy: 2,
      haplotypes: [GENES.map(() => value), GENES.map(() => value)],
      generation: 0,
      origin: "founder",
      mutations: [],
    });
  expressGenome(low, genome(0));
  expressGenome(high, genome(1));
  assert.ok(high.speed > low.speed && high.speed < 0.11);
  assert.ok(high.bodyScale > low.bodyScale && high.bodyScale < 1.1);
  assert.ok(high.pheromoneGain > low.pheromoneGain);
  assert.ok(
    high.metabolicCost < low.metabolicCost && high.digPower > low.digPower,
  );
  assert.ok(high.thresholds.nurse < low.thresholds.nurse);
});
test("an embryo retains its genome and parents when it hatches", () => {
  const w = new World("genetic-birth");
  w.step(30);
  const egg = w.brood[0],
    genome = structuredClone(egg.genome);
  assert.ok(genome);
  assert.equal(genome.motherId, 1);
  assert.equal(genome.fatherId, 2);
  w.lastLaying = Infinity;
  w.brood = [egg];
  egg.age = 1.31;
  const before = w.born;
  w.step();
  const newborn = w.workers[0];
  assert.ok(newborn);
  assert.deepEqual(newborn.genome, genome);
  assert.equal(w.born, before + 1);
});
test("genetics and its future persist exactly through snapshots", () => {
  const w = new World("genetic-snapshot");
  w.step(250);
  const restored = World.restore(w.snapshot());
  w.step(100);
  restored.step(100);
  assert.deepEqual(restored.snapshot(), w.snapshot());
});
test("legacy migration preserves bodies and behavior and marks ancestry as unrecorded", () => {
  const w = new World("genetic-legacy");
  w.step(210);
  delete w.genetics;
  for (const a of w.ants) delete a.genome;
  for (const b of w.brood) delete b.genome;
  const traits = (ants) =>
    ants.map((a) => ({
      id: a.id,
      speed: a.speed,
      bodyScale: a.bodyScale,
      headScale: a.headScale,
      traits: a.traits,
      thresholds: a.thresholds,
    }));
  const before = structuredClone(traits(w.ants)),
    restored = World.restore(w.snapshot());
  assert.deepEqual(traits(restored.ants), before);
  assert.ok(
    restored.ants.every(
      (a) =>
        a.genome.origin === "legacy-inferred" &&
        !a.genome.motherId &&
        !a.genome.fatherId,
    ),
  );
  assert.equal(restored.genetics.sire.id, undefined);
  assert.deepEqual(
    World.restore(restored.snapshot()).snapshot(),
    restored.snapshot(),
  );
});
