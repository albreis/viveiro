import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { family } from "./fixtures/family.mjs";
import { World } from "./fixtures/established-world.mjs";
import { createLearning } from "../src/modules/learning/live.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
  parseExperiment,
  checksum,
} from "../src/modules/persistence/codec.ts";
import {
  compactSession,
  expandSession,
} from "../src/modules/persistence/compact.ts";
const session = (w) => ({
  version: 1,
  world: w.snapshot(),
  comparison: null,
  scenario: "a",
  initial: { seed: w.seed, params: { ...w.params } },
  interventions: [],
  replaying: false,
  replayIndex: 0,
  running: false,
});
const meta = {
  id: "manual-codec",
  createdAt: 1793530000000,
  sequence: 1,
  kind: "manual",
  label: "Antes da chuva",
};
test("a compact checkpoint preserves personal brains and resources while storing shared habitat once", () => {
  const { w, child } = family("codec-family");
  w.step(30);
  w.learning = createLearning("root");
  child.learning = createLearning("child");
  child.food = 3;
  w.food = 12;
  const s = session(w),
    before = structuredClone(s),
    record = createCheckpoint(s, meta),
    expanded = decodeCheckpoint(record);
  assert.ok(isDeepStrictEqual(expanded, s));
  assert.ok(isDeepStrictEqual(before, s), "packing mutated the live snapshot");
  assert.ok(JSON.stringify(record).length < JSON.stringify(s).length * 0.8);
  assert.equal(record.payload.world.colonies[0].soil, undefined);
  assert.notDeepEqual(
    record.payload.world.learning.brain,
    record.payload.world.colonies[0].learning.brain,
  );
  assert.equal(expanded.world.colonies[0].food, 3);
  assert.equal(expanded.world.food, 12);
  assert.equal(expanded.world.colonies[0].nest, expanded.world.nest);
});
test("unshared child data is retained and compact roundtrip leaves both scenarios unchanged", () => {
  const { w, child } = family("distinct-fields");
  w.step(10);
  const s = session(w);
  s.comparison = World.restore(w.snapshot()).snapshot();
  s.scenario = "b";
  s.world.colonies[0].params = { ...s.world.params, humidity: 37 };
  const p = compactSession(s),
    r = expandSession(p);
  assert.equal(p.world.colonies[0].params.humidity, 37);
  assert.ok(isDeepStrictEqual(r, s));
});
test("restoring a compact checkpoint preserves exact future climate, genes, RNG and shared state", () => {
  const { w } = family("codec-future");
  w.step(40);
  const restored = World.restore(
    decodeCheckpoint(createCheckpoint(session(w), meta)).world,
  );
  w.step(60);
  restored.step(60);
  assert.ok(
    isDeepStrictEqual(w.snapshot(), restored.snapshot()),
    "checkpoint changed the future",
  );
});
test("legacy saves and exported experiments normalize without changing their world or actions", () => {
  const w = new World("legacy-codec"),
    s = session(w);
  delete s.scenario;
  delete s.running;
  delete s.replaying;
  delete s.replayIndex;
  s.interventions = [{ tick: 10, type: "rain", x: 0, z: 0 }];
  const parsed = parseExperiment(JSON.stringify(s));
  assert.deepEqual(parsed.world, s.world);
  assert.deepEqual(parsed.interventions, s.interventions);
  assert.equal(parsed.running, true);
  assert.equal(parsed.scenario, "a");
});
test("corruption, unsupported versions and injected prototypes fail before replacing a world", () => {
  const s = session(new World("corruption")),
    r = createCheckpoint(s, meta),
    changed = structuredClone(r);
  changed.payload.world.food = 999;
  assert.throws(() => decodeCheckpoint(changed), /incompleto|alterado/);
  assert.throws(() => decodeCheckpoint({ ...r, version: 3 }), /Versão/);
  assert.throws(
    () => parseExperiment('{"version":1,"__proto__":{"polluted":true}}'),
    /Chave/,
  );
  assert.equal({}.polluted, undefined);
  assert.throws(
    () =>
      parseExperiment(
        JSON.stringify({ ...s, world: { ...s.world, step: "override" } }),
      ),
    /Método/,
  );
  assert.throws(
    () =>
      parseExperiment(
        JSON.stringify({ ...s, world: { ...s.world, colonies: {} } }),
      ),
    /colônia/,
  );
});
test("unexpected habitat references and malformed metadata are rejected even with a fresh checksum", () => {
  const { w } = family("reference-validation"),
    r = createCheckpoint(session(w), meta);
  r.payload.world.colonies[0].habitatKeys = ["rng"];
  const { checksum: old, ...body } = r;
  r.checksum = checksum(JSON.stringify(body));
  assert.throws(() => decodeCheckpoint(r), /compartilhado/);
  const good = createCheckpoint(session(w), meta);
  assert.throws(() => decodeCheckpoint({ ...good, label: 5 }), /metadados/);
});
