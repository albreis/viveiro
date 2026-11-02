import { test } from "node:test";
import assert from "node:assert/strict";
import { SimulationClock, normalizeClock } from "../src/modules/time/clock.ts";
import { stepSession } from "../src/modules/time/session-step.ts";
import { World } from "./fixtures/established-world.mjs";
import { timeSession } from "./fixtures/time-session.mjs";
import { normalizeSession } from "../src/modules/persistence/validation.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
} from "../src/modules/persistence/codec.ts";
const meta = {
  id: "manual-time",
  sequence: 1,
  createdAt: 1,
  kind: "manual",
  label: "Clock",
};

test("missing clock retains the historical ten-second day; a new installation starts at one minute", () => {
  assert.equal(normalizeClock(undefined).secondsPerDay, 10);
  assert.equal(new SimulationClock().state.secondsPerDay, 60);
  const old = timeSession();
  delete old.clock;
  assert.equal(Object.hasOwn(normalizeSession(old), "clock"), false);
  assert.deepEqual(decodeCheckpoint(createCheckpoint(old, meta)), old);
});
test("frame budgets retain whole and fractional overdue ticks across pause, checkpoint and reload", () => {
  const clock = new SimulationClock({
    version: 1,
    secondsPerDay: 10,
    speed: 1,
    pendingTicks: 0.125,
  });
  clock.credit(1);
  let elapsed = 0,
    done = 0;
  clock.drain(
    () => {
      done++;
      elapsed += 4;
    },
    () => elapsed,
    6,
  );
  assert.equal(done, 2);
  assert.equal(clock.state.pendingTicks, 8.125);
  const s = timeSession();
  s.clock = { ...clock.state };
  s.advance = { version: 1, startTick: 0, targetTick: 100 };
  const saved = decodeCheckpoint(createCheckpoint(s, meta));
  assert.deepEqual(saved.clock, clock.state);
  assert.deepEqual(saved.advance, s.advance);
  const resumed = new SimulationClock(saved.clock);
  resumed.drain(
    () => done++,
    () => 0,
  );
  assert.equal(done, 10);
  assert.equal(resumed.state.pendingTicks, 0.125);
  clock.credit(0.25);
  assert.equal(
    clock.state.pendingTicks,
    10.625,
    "a slow quarter-second frame was discarded",
  );
});
test("base pace, boosters and irregular rendering schedules produce byte-identical model worlds and A/B replay", () => {
  const source = timeSession("pace-equality");
  const run = (secondsPerDay, speed, frames) => {
    const w = World.restore(source.world),
      b = World.restore(source.comparison),
      cursor = {
        ...source,
        interventions: structuredClone(source.interventions),
      };
    const clock = new SimulationClock({
      version: 1,
      secondsPerDay,
      speed,
      pendingTicks: 0,
    });
    for (const fraction of frames) {
      clock.credit((fraction * 1.2 * secondsPerDay) / speed);
      clock.drain(
        () => stepSession(w, b, cursor),
        () => 0,
      );
    }
    while (clock.state.pendingTicks + 1e-9 >= 1)
      clock.drain(
        () => stepSession(w, b, cursor),
        () => 0,
      );
    assert.equal(w.tick, 120);
    assert.equal(b.tick, 120);
    assert.equal(cursor.replayIndex, 2);
    return JSON.stringify([w.snapshot(), b.snapshot()]);
  };
  const baseline = run(10, 1, [1]);
  for (const [pace, speed] of [
    [60, 1],
    [60, 10],
    [300, 3],
    [3600, 1],
  ])
    assert.equal(
      run(pace, speed, [0.01, 0.03, 0.12, 0.04, 0.3, 0.5]),
      baseline,
    );
});
test("invalid clock and offline target state is rejected before application", () => {
  for (const c of [
    { version: 2, secondsPerDay: 60, speed: 1, pendingTicks: 0 },
    { version: 1, secondsPerDay: 0, speed: 1, pendingTicks: 0 },
    { version: 1, secondsPerDay: 60, speed: 100, pendingTicks: 0 },
    { version: 1, secondsPerDay: 60, speed: 1, pendingTicks: -1 },
  ])
    assert.throws(() => normalizeClock(c));
  const clock = new SimulationClock();
  for (const dt of [-1, Infinity, NaN]) assert.throws(() => clock.credit(dt));
  for (const plan of [
    { version: 1, startTick: 1, targetTick: 100 },
    { version: 1, startTick: 0, targetTick: 0 },
    { version: 1, startTick: 0, targetTick: 36501 },
  ]) {
    const s = timeSession();
    s.advance = plan;
    assert.throws(() => normalizeSession(s));
  }
});
