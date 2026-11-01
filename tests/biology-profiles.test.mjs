import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { World } from "../src/modules/simulation/world.js";
import {
  biologicalProfiles,
  biologicalParameters,
  profileReference,
  resolveBiologicalProfile,
  prepareBiologicalExperiment,
} from "../src/modules/biology/catalog.ts";
import { biologicalSources } from "../src/modules/biology/sources.ts";
import { UnsupportedBiologicalProfile } from "../src/modules/biology/errors.ts";
import {
  captureSession,
  restoreSessionModels,
} from "../src/app/session-models.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
  checksum,
} from "../src/modules/persistence/codec.ts";
import { normalizeSession } from "../src/modules/persistence/validation.ts";
import { CheckpointStore } from "../src/services/checkpoints/store.ts";
import { LocalCheckpointFallback } from "../src/services/checkpoints/local-fallback.ts";
import { MemoryDriver, MemoryStorage } from "./fixtures/checkpoint-memory.mjs";
import { cohort } from "./fixtures/family.mjs";
import { spawnDaughter } from "../src/modules/colonies/spawn.ts";
const session = (world, reference) =>
  captureSession({
    world,
    comparison: null,
    scenario: "a",
    initial: {
      seed: world.seed,
      params: { ...world.params },
      startMode: "established",
      ...(reference ? { biologicalProfile: reference } : {}),
    },
    interventions: [],
    replaying: false,
    replayIndex: 0,
    running: true,
  });
const meta = (id, createdAt) => ({
  id,
  createdAt,
  sequence: createdAt,
  kind: "auto",
  label: "",
});
test("versioned records distinguish hypotheses, measurements and protocol conditions with traceable units and samples", () => {
  for (const p of biologicalParameters) {
    assert.ok(p.unit && p.uncertainty && p.context);
    assert.ok(biologicalSources.some((s) => s.id === p.source));
    assert.ok(p.version >= 1);
    if (p.evidence === "measurement") assert.ok(p.sample > 0);
    if (p.evidence === "hypothesis") assert.equal(p.application, "none");
    assert.ok(Object.isFrozen(p));
  }
  assert.equal(
    biologicalParameters.find((p) => p.id === "study.workerProduction").value,
    17 / 22,
  );
  assert.equal(biologicalProfiles[1].modelSpecies, null);
  assert.equal(biologicalProfiles[1].referenceSpecies, "Lasius niger");
});
test("reference presets apply only documented initial air conditions without modifying the input or adding biological timers", () => {
  const params = { humidity: 52, light: 68, temperatureC: 35, randomness: 28 },
    before = { ...params };
  const generic = prepareBiologicalExperiment("generic-demo", params),
    reference = prepareBiologicalExperiment("lab-lniger-2024", params);
  assert.deepEqual(params, before);
  assert.deepEqual(generic.params, params);
  assert.deepEqual(reference.params, {
    ...params,
    humidity: 80,
    temperatureC: 21,
  });
  assert.deepEqual(
    Object.keys(reference.params).sort(),
    Object.keys(params).sort(),
  );
  assert.equal(reference.biologicalProfile.version, 1);
});
test("legacy resolution is read-only and adding generic provenance leaves the complete numerical future unchanged", () => {
  const plain = new World("profile-legacy", {}, { founding: false }),
    tagged = new World(
      "profile-legacy",
      {},
      { founding: false, biologicalProfile: profileReference() },
    );
  const before = plain.snapshot();
  resolveBiologicalProfile(plain.biologicalProfile);
  assert.deepEqual(plain.snapshot(), before);
  assert.equal(Object.hasOwn(plain, "biologicalProfile"), false);
  plain.step(200);
  tagged.step(200);
  const a = plain.snapshot(),
    b = tagged.snapshot();
  delete b.biologicalProfile;
  assert.ok(isDeepStrictEqual(a, b));
  assert.equal(
    Object.hasOwn(World.restore(before), "biologicalProfile"),
    false,
  );
});
test("profile identity and exact parameters survive checkpoint, model restore and replay configuration without reapplying presets", () => {
  const config = prepareBiologicalExperiment("lab-lniger-2024", {
      humidity: 52,
      light: 68,
      randomness: 28,
    }),
    w = new World("profile-save", config.params, {
      founding: false,
      biologicalProfile: config.biologicalProfile,
    });
  w.step(35);
  w.params.humidity = 67;
  const saved = session(w, config.biologicalProfile),
    record = createCheckpoint(saved, meta("pinned", 10)),
    decoded = decodeCheckpoint(record),
    restored = restoreSessionModels(decoded);
  assert.deepEqual(decoded.initial.biologicalProfile, config.biologicalProfile);
  assert.equal(restored.world.params.humidity, 67);
  assert.deepEqual(restored.world.biologicalProfile, config.biologicalProfile);
  restored.world.step(40);
  w.step(40);
  assert.ok(isDeepStrictEqual(w.snapshot(), restored.world.snapshot()));
  const replay = new World(saved.initial.seed, saved.initial.params, {
    founding: false,
    biologicalProfile: saved.initial.biologicalProfile,
  });
  assert.deepEqual(replay.biologicalProfile, w.biologicalProfile);
  assert.equal(replay.params.humidity, 67);
});
test("daughter colonies inherit an independent pinned biological reference from their actual source colony", () => {
  const { w, gyne, male } = cohort("profile-daughter"),
    entry = w.nest.nodes[0];
  w.biologicalProfile = profileReference("lab-lniger-2024");
  for (const [i, ant] of [gyne, male].entries())
    Object.assign(ant, {
      x: entry.x + 0.6,
      y: entry.y + 0.01,
      z: entry.z + i * 0.3,
      node: null,
      route: [],
      age: 1.2,
    });
  const child = spawnDaughter(w, w, gyne, male);
  assert.ok(child);
  assert.deepEqual(child.biologicalProfile, w.biologicalProfile);
  assert.notEqual(child.biologicalProfile, w.biologicalProfile);
  child.biologicalProfile.version = 2;
  assert.equal(w.biologicalProfile.version, 1);
});
test("unknown profile IDs, versions and schemas fail explicitly during model and session reconstruction", () => {
  for (const ref of [
    { schema: 1, id: "future", version: 1 },
    { schema: 1, id: "generic-demo", version: 2 },
    { schema: 2, id: "generic-demo", version: 1 },
  ]) {
    assert.throws(
      () => resolveBiologicalProfile(ref),
      UnsupportedBiologicalProfile,
    );
    const w = new World("unsupported", {}, { founding: false }),
      raw = w.snapshot();
    raw.biologicalProfile = ref;
    assert.throws(() => World.restore(raw), UnsupportedBiologicalProfile);
    const s = session(w);
    s.world.biologicalProfile = ref;
    assert.throws(() => normalizeSession(s), UnsupportedBiologicalProfile);
  }
});
test("a future profile in a valid-checksum current save protects original data even when an older compatible fallback exists", async () => {
  const w = new World(
      "forward-profile",
      {},
      { founding: false, biologicalProfile: profileReference() },
    ),
    old = createCheckpoint(session(w, profileReference()), meta("older", 1)),
    future = structuredClone(
      createCheckpoint(session(w, profileReference()), meta("future", 2)),
    );
  future.payload.world.biologicalProfile.version = 2;
  const { checksum: ignored, ...body } = future;
  future.checksum = checksum(JSON.stringify(body));
  const driver = new MemoryDriver(),
    storage = new MemoryStorage(),
    fallback = new LocalCheckpointFallback(() => storage);
  await driver.write(future);
  fallback.write(old);
  const before = structuredClone(future),
    store = new CheckpointStore(driver, fallback),
    loaded = await store.load();
  assert.equal(loaded.blocked, true);
  assert.equal(loaded.session.running, false);
  assert.match(loaded.notice, /perfil biológico/);
  assert.deepEqual(await driver.current(), before);
  assert.equal((await store.save(session(w))).ok, false);
  assert.equal(driver.writes.length, 1);
});
