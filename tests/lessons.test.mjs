import { test } from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/modules/lessons/catalog.ts";
import { createLessonSession } from "../src/modules/lessons/recipe.ts";
import {
  restoreSessionModels,
  captureSession,
} from "../src/app/session-models.ts";
import { normalizeSession } from "../src/modules/persistence/validation.ts";
import { stepSession } from "../src/modules/time/session-step.ts";
import { geneValue } from "../src/modules/genetics/genome.ts";
import { airNetwork } from "../src/modules/ventilation/network.ts";
import { World } from "../src/modules/simulation/world.js";

for (const version of [1, 2])
  for (const d of lessons)
    test("estado inicial reproduzível v" + version + ": " + d.id, () => {
      const a = createLessonSession({ id: d.id, version });
      assert.deepEqual(a, createLessonSession({ id: d.id, version }));
      assert.equal(a.version, 2);
      assert.equal(a.running, false);
      assert.equal(a.world.seed, a.comparison.seed);
      assert.equal(a.world.tick, 0);
      assert.equal(a.comparison.tick, 0);
      assert.equal(a.clock.secondsPerDay, 60);
      const models = restoreSessionModels(a);
      const b = restoreSessionModels(a);
      for (let i = 0; i < 5; i++) {
        stepSession(models.world, models.comparison, models.session);
        stepSession(b.world, b.comparison, b.session);
      }
      assert.deepEqual(models.world.snapshot(), b.world.snapshot());
      assert.deepEqual(models.comparison.snapshot(), b.comparison.snapshot());
    });

test("vento e repouso mudam apenas o parâmetro declarado no estado inicial", () => {
  for (const [id, key, lo, hi] of [
    ["trilhas-vento", "windX", 0, 1.5],
    ["repouso-solo", "reposeAngle", 15, 55],
  ]) {
    const s = createLessonSession({ id, version: 1 }),
      a = s.world,
      b = s.comparison;
    assert.equal(a.params[key], lo);
    assert.equal(b.params[key], hi);
    delete a.params[key];
    delete b.params[key];
    assert.deepEqual(a, b);
    if (id === "trilhas-vento") assert.ok(a.pheromones.some((x) => x > 0));
    else assert.ok(a.nest.rubble.length > 0);
  }
});
test("segunda abertura é real na rede de ar e começa com a mesma concentração", () => {
  const s = createLessonSession({ id: "entradas-ar", version: 1 });
  const a = World.restore(s.world),
    b = World.restore(s.comparison);
  assert.equal(airNetwork(a).vents.length, 1);
  assert.equal(airNetwork(b).vents.length, 2);
  assert.deepEqual(a.ants, b.ants);
  for (const w of [a, b])
    for (const cell of w.gases.cells) {
      assert.ok(Math.abs(cell.oxygen / cell.volume - 0.19) < 1e-12);
      assert.ok(Math.abs(cell.carbon / cell.volume - 0.012) < 1e-12);
    }
});
test("temperatura muda ar/solo, mantendo água, prole e genes iniciais iguais", () => {
  const { world: a, comparison: b } = createLessonSession({
    id: "crias-temperatura",
    version: 1,
  });
  assert.equal(a.params.temperatureC, 18);
  assert.equal(b.params.temperatureC, 28);
  assert.ok(a.microclimate.temperature.every((x) => x === 18));
  assert.ok(b.microclimate.temperature.every((x) => x === 28));
  assert.deepEqual(a.microclimate.water, b.microclimate.water);
  assert.deepEqual(a.brood, b.brood);
});
test("fundação compara estratégias explícitas com alados e solo intacto", () => {
  const { world: a, comparison: b } = createLessonSession({
    id: "fundacao-coleta",
    version: 1,
  });
  assert.equal(a.biologicalProfile.id, "generic-demo");
  assert.equal(b.biologicalProfile.id, "generic-semiclaustral-demo");
  assert.deepEqual(a.ants, b.ants);
  assert.equal(a.nest.nodes.length, 0);
  assert.equal(b.nest.nodes.length, 0);
  assert.ok(b.founding.foraging);
});
test("alimento em B usa a intervenção normal sem alterar genes ou seed", () => {
  const { world: a, comparison: b } = createLessonSession({
    id: "mesma-seed",
    version: 1,
  });
  assert.equal(b.patches.length, a.patches.length + 1);
  assert.equal(b.patches.at(-1).amount, 5);
  assert.deepEqual(a.ants, b.ants);
  assert.equal(a.rng, b.rng);
});
test("as filhas herdam o locus materno, mantendo pai e os outros loci", () => {
  const { world: a, comparison: b } = createLessonSession({
    id: "heranca",
    version: 1,
  });
  assert.deepEqual(a.genetics.sire, b.genetics.sire);
  assert.equal(geneValue(a.genetics.queen.genome, "locomotion"), 0.2);
  assert.equal(geneValue(b.genetics.queen.genome, "locomotion"), 0.8);
  a.brood.forEach((child, i) => {
    assert.equal(child.genome.motherId, 1);
    assert.equal(child.genome.fatherId, 2);
    assert.ok(
      geneValue(b.brood[i].genome, "locomotion") >
        geneValue(child.genome, "locomotion"),
    );
    child.genome.haplotypes.forEach((copy, j) =>
      assert.deepEqual(copy.slice(1), b.brood[i].genome.haplotypes[j].slice(1)),
    );
  });
});
test("sessões antigas continuam emv1; aulas exigem v2 e referência conhecida", () => {
  const s = createLessonSession({ id: "heranca", version: 1 });
  assert.throws(() => normalizeSession({ ...s, version: 1 }), /versão2/);
  assert.throws(
    () => normalizeSession({ ...s, lesson: { id: "unknown", version: 1 } }),
    /desconhecido/,
  );
  assert.throws(
    () => normalizeSession({ ...s, lesson: { id: "heranca", version: 99 } }),
    /não suportada/,
  );
  assert.throws(
    () => normalizeSession({ ...s, comparison: null }),
    /incompleta/,
  );
  const legacy = { ...s, version: 1 };
  delete legacy.lesson;
  assert.equal(normalizeSession(legacy).version, 1);
  const r = restoreSessionModels(s);
  const captured = captureSession({
    ...r.session,
    world: r.world,
    comparison: r.comparison,
  });
  assert.equal(captured.version, 2);
  assert.deepEqual(captured.lesson, s.lesson);
});
