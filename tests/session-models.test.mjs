import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { family } from "./fixtures/family.mjs";
import {
  captureSession,
  restoreSessionModels,
} from "../src/app/session-models.ts";
test("session capture and model reconstruction keep comparison and replay separate without changing the live world", () => {
  const { w } = family("session-models");
  w.step(20);
  const before = w.snapshot();
  const session = captureSession({
    world: w,
    comparison: null,
    scenario: "a",
    initial: { seed: w.seed, params: { ...w.params } },
    interventions: [{ tick: 10, type: "rain" }],
    running: false,
    replaying: true,
    replayIndex: 1,
  });
  const restored = restoreSessionModels(session);
  assert.equal(restored.session.running, false);
  assert.equal(restored.session.replaying, true);
  assert.equal(restored.session.replayIndex, 1);
  assert.ok(isDeepStrictEqual(w.snapshot(), before));
  w.step(20);
  restored.world.step(20);
  assert.ok(isDeepStrictEqual(w.snapshot(), restored.world.snapshot()));
});
