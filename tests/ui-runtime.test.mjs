import { test } from "node:test";
import assert from "node:assert/strict";
import { FrameController } from "../src/app/controller-frame.ts";
import {
  createLiveWorld,
  restoreLiveWorld,
  liveWorld,
} from "../src/app/runtime-world.ts";
import { stepSession } from "../src/modules/time/session-step.ts";
import { element } from "../src/app/dom-elements.ts";

function controller(seed) {
  const c = new FrameController();
  c.world = createLiveWorld(
    seed,
    { humidity: 58, light: 72, randomness: 28 },
    { founding: false },
  );
  c.initial = {
    seed,
    params: { ...c.world.params },
    startMode: "established",
    biologicalProfile: c.world.biologicalProfile,
  };
  c.running = false;
  return c;
}

test("typed legacy boundary preserves model identity and rejects a plain or missing world", () => {
  const c = controller("UI-BOUNDARY");
  assert.equal(liveWorld(c.world), c.world);
  assert.throws(
    () => liveWorld({ seed: "fake", tick: 0, ants: [], nest: {}, params: {} }),
    /Invalid initialized/,
  );
  assert.throws(() => liveWorld(null), /Invalid initialized/);
  const restored = restoreLiveWorld(c.world.snapshot());
  assert.deepEqual(restored.snapshot(), c.world.snapshot());
});

test("bound UI tick preserves A/B timed intervention order, replay cursor and exact model states", () => {
  const c = controller("UI-REPLAY");
  c.comparison = restoreLiveWorld(c.world.snapshot());
  c.comparison.params.humidity += 1;
  const a = restoreLiveWorld(c.world.snapshot()),
    b = restoreLiveWorld(c.comparison.snapshot());
  c.interventions = [
    { tick: 5, type: "rain", x: 0, z: 0 },
    { tick: 9, type: "food", x: 2, z: 1 },
  ];
  c.replaying = true;
  const cursor = {
    interventions: structuredClone(c.interventions),
    replaying: true,
    replayIndex: 0,
  };
  const tick = c.tick;
  for (let i = 0; i < 20; i++) {
    tick();
    stepSession(a, b, cursor);
  }
  assert.deepEqual(c.world.snapshot(), a.snapshot());
  assert.deepEqual(c.comparison.snapshot(), b.snapshot());
  assert.equal(c.replayIndex, cursor.replayIndex);
  assert.equal(c.replayIndex, 2);
});

test("session application preserves clock, lesson-free A/B replay and the same future without a scene", () => {
  const c = controller("UI-SAVE");
  c.comparison = restoreLiveWorld(c.world.snapshot());
  c.scenario = "b";
  c.running = true;
  c.replaying = true;
  c.interventions = [{ tick: 2, type: "rain", x: 0, z: 0 }];
  c.clock.state.pendingTicks = 0.5;
  const session = c.getSession(),
    before = structuredClone(session);
  const restored = new FrameController();
  restored.applySavedSession(session, true);
  assert.equal(restored.running, false);
  assert.equal(restored.scenario, "b");
  assert.equal(restored.clock.state.pendingTicks, 0.5);
  assert.deepEqual(session, before);
  for (let i = 0; i < 12; i++) {
    c.tick();
    restored.tick();
  }
  assert.deepEqual(restored.world.snapshot(), c.world.snapshot());
  assert.deepEqual(restored.comparison.snapshot(), c.comparison.snapshot());
  assert.equal(restored.replayIndex, c.replayIndex);
});

test("owned DOM controls fail clearly for a missing or wrongly typed element", () => {
  const previous = globalThis.document;
  try {
    globalThis.document = {
      getElementById(id) {
        return id === "seed"
          ? { tagName: "INPUT" }
          : id === "chart"
            ? { tagName: "DIV" }
            : null;
      },
    };
    assert.equal(element("seed").tagName, "INPUT");
    assert.throws(() => element("chart"), /Wrong interface element: chart/);
    assert.throws(
      () => element("missing"),
      /Missing interface element: missing/,
    );
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
