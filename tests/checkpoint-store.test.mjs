import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { MemoryDriver, MemoryStorage } from "./fixtures/checkpoint-memory.mjs";
import { CheckpointStore } from "../src/services/checkpoints/store.ts";
import { LocalCheckpointFallback } from "../src/services/checkpoints/local-fallback.ts";
import { SerialCheckpointQueue } from "../src/services/checkpoints/serial-queue.ts";
import { createCheckpoint } from "../src/modules/persistence/codec.ts";
const session = (seed = "store") => {
  const w = new World(seed);
  return {
    version: 1,
    world: w.snapshot(),
    comparison: null,
    scenario: "a",
    initial: { seed, params: { ...w.params } },
    interventions: [],
    running: false,
    replaying: false,
    replayIndex: 0,
  };
};
function setup() {
  const driver = new MemoryDriver(),
    storage = new MemoryStorage(),
    fallback = new LocalCheckpointFallback(() => storage);
  let id = 0;
  const store = new CheckpointStore(
    driver,
    fallback,
    () => 1000,
    () => String(++id),
  );
  return { driver, storage, fallback, store };
}
test("serial writes coalesce only pending autosaves, retain manual checkpoints and never finish out of order", async () => {
  const writes = [],
    releases = [];
  const queue = new SerialCheckpointQueue(
    (r) =>
      new Promise((resolve) => {
        writes.push(r.id);
        releases.push(() => resolve({ ok: true, id: r.id }));
      }),
  );
  const r = (id, kind = "auto") => ({ id, kind });
  const a = queue.enqueue(r("a")),
    b = queue.enqueue(r("b")),
    c = queue.enqueue(r("c")),
    manual = queue.enqueue(r("manual", "manual")),
    d = queue.enqueue(r("d"));
  assert.equal((await b).superseded, true);
  assert.deepEqual(writes, ["a"]);
  for (let i = 0; i < 4; i++) {
    releases[i]();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  await queue.flush();
  assert.deepEqual(writes, ["a", "c", "manual", "d"]);
  assert.ok((await a).ok && (await c).ok && (await manual).ok && (await d).ok);
});
test("successful saves are acknowledged after persistence and identical paused autosaves are skipped", async () => {
  const { store, driver } = setup(),
    s = session();
  assert.equal((await store.save(s)).backend, "indexedDB");
  await store.save(s);
  assert.equal(driver.writes.length, 1);
  await store.save(s, "Observação", "manual");
  assert.equal(driver.writes.length, 2);
  assert.equal(
    (await store.list()).filter((r) => r.kind === "manual").length,
    1,
  );
  assert.deepEqual((await store.load()).session, s);
});
test("database failure falls back locally, retains the original legacy save and recovers the newer state", async () => {
  const { store, driver, storage } = setup(),
    legacy = session("legacy"),
    current = session("current");
  storage.setItem("viveiro-v1", JSON.stringify(legacy));
  driver.fail = true;
  assert.equal((await store.load()).session.world.seed, "legacy");
  const saved = await store.save(current);
  assert.equal(saved.backend, "localStorage");
  assert.equal(storage.getItem("viveiro-v1"), JSON.stringify(legacy));
  const recovered = await store.load();
  assert.equal(recovered.session.world.seed, "current");
});
test("a corrupt current record restores a valid older checkpoint rather than overwriting it", async () => {
  const { store, driver, storage } = setup(),
    old = session("older");
  await store.save(old, "Original", "manual");
  const original = driver.pointer;
  storage.values.clear();
  driver.records.set("broken", {
    id: "broken",
    kind: "auto",
    createdAt: 9999,
    sequence: 99,
    payload: old,
  });
  driver.pointer = "broken";
  const result = await store.load();
  assert.equal(result.session.world.seed, "older");
  assert.ok(result.notice);
  assert.ok(driver.records.has(original));
  assert.ok(driver.records.has("broken"));
});
test("unrecoverable data protects autosave, while an empty unavailable database can use the fallback", async () => {
  const one = setup();
  one.storage.setItem("viveiro-v2-fallback", "{broken");
  assert.equal((await one.store.load()).blocked, true);
  assert.equal((await one.store.save(session())).ok, false);
  assert.equal(one.storage.getItem("viveiro-v2-fallback"), "{broken");
  const two = setup();
  two.driver.fail = true;
  assert.equal((await two.store.load()).blocked, false);
  assert.equal((await two.store.save(session())).backend, "localStorage");
});
test("failure of both backends reports failure without claiming that a save is durable", async () => {
  const { store, driver, storage } = setup();
  driver.fail = true;
  storage.fail = true;
  const result = await store.save(session());
  assert.equal(result.ok, false);
  assert.match(result.message, /Não foi possível salvar/);
});
test("emergency fallback and manual restore retain exact model state and metadata", async () => {
  const { store, driver } = setup(),
    s = session("emergency");
  await store.save(s, "Ponto seguro", "manual");
  const id = driver.pointer;
  s.world.tick = 20;
  assert.ok(store.emergency(s));
  assert.equal((await store.load()).session.world.tick, 20);
  assert.equal((await store.restore(id)).world.tick, 0);
});
