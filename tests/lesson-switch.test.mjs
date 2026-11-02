import { test } from "node:test";
import assert from "node:assert/strict";
import { switchLesson } from "../src/modules/lessons/safe-switch.ts";
import { createLessonSession } from "../src/modules/lessons/recipe.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
} from "../src/modules/persistence/codec.ts";
import { World } from "../src/modules/simulation/world.js";
import { stepSession } from "../src/modules/time/session-step.ts";
import { runAdvance } from "../src/modules/time/run-advance.ts";

test("backup durável vem antes da troca; falha e fallback mantêm o mundo", async () => {
  const prior = createLessonSession({ id: "trilhas-vento", version: 1 });
  const next = createLessonSession({ id: "heranca", version: 1 });
  for (const result of [{ ok: false }, { ok: true, backend: "localStorage" }]) {
    let applied = false;
    await assert.rejects(
      switchLesson(next, {
        pause() {},
        capture: () => structuredClone(prior),
        backup: async () => result,
        apply() {
          applied = true;
        },
      }),
      /mantido em pausa/,
    );
    assert.equal(applied, false);
  }
  const calls = [];
  await switchLesson(next, {
    pause() {
      calls.push("pause");
    },
    capture: () => structuredClone(prior),
    backup: async (saved) => {
      calls.push("backup");
      assert.deepEqual(saved, prior);
      return { ok: true, backend: "indexedDB", id: "before" };
    },
    apply(s) {
      calls.push("apply");
      assert.deepEqual(s, next);
    },
  });
  assert.deepEqual(calls, ["pause", "backup", "apply"]);
});
test("mudança concorrente do experimento invalida uma troca em espera", async () => {
  const prior = createLessonSession({ id: "heranca", version: 1 });
  let changed = false,
    applied = false;
  await assert.rejects(
    switchLesson(prior, {
      pause() {},
      capture: () => ({ ...structuredClone(prior), running: changed }),
      backup: async () => {
        changed = true;
        return { ok: true, backend: "indexedDB" };
      },
      apply() {
        applied = true;
      },
    }),
    /mudou durante/,
  );
  assert.equal(applied, false);
});
for (const version of [1, 2])
  test(
    "checkpoint e avanço headless preservam a aula v" +
      version +
      " e os dois cenários",
    async () => {
      const s = createLessonSession({ id: "crias-temperatura", version });
      s.interventions = [{ tick: 10, type: "humidity", value: 75 }];
      s.replaying = true;
      const a = World.restore(s.world),
        b = World.restore(s.comparison);
      const cursor = structuredClone(s);
      for (let i = 0; i < 100; i++) stepSession(a, b, cursor);
      const record = createCheckpoint(s, {
        id: "lesson",
        sequence: 1,
        createdAt: 1,
        kind: "manual",
        label: "Aula",
      });
      const loaded = decodeCheckpoint(record);
      assert.equal(loaded.version, 2);
      assert.deepEqual(loaded.lesson, s.lesson);
      const result = await runAdvance(
        loaded,
        { days: 1, budgetMs: 10000 },
        {
          cancelled: () => false,
          progress() {},
          pause: async () => {},
        },
      );
      assert.equal(result.complete, true);
      assert.equal(result.session.world.tick, 100);
      assert.equal(result.session.comparison.tick, 100);
      assert.deepEqual(result.session.lesson, s.lesson);
      assert.equal(result.session.replayIndex, 1);
      assert.deepEqual(result.session.world, a.snapshot());
      assert.deepEqual(result.session.comparison, b.snapshot());
    },
  );
