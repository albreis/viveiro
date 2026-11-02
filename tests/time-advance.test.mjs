import { family } from "./fixtures/family.mjs";
import { survivalWorld } from "./fixtures/survival.mjs";
import { captureSession } from "../src/app/session-models.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  runAdvance,
  AdvanceCancelled,
} from "../src/modules/time/run-advance.ts";
import { AdvanceClient } from "../src/services/advance-client.ts";
import { stepSession } from "../src/modules/time/session-step.ts";
import { World } from "./fixtures/established-world.mjs";
import { timeSession } from "./fixtures/time-session.mjs";
import {
  createCheckpoint,
  decodeCheckpoint,
} from "../src/modules/persistence/codec.ts";
const options = { days: 1, budgetMs: 10000 };
const hooks = {
  cancelled: () => false,
  progress: () => {},
  pause: async () => {},
};
const expected = (source) => {
  const w = World.restore(source.world),
    b = World.restore(source.comparison),
    cursor = structuredClone(source);
  for (let i = 0; i < 100; i++) stepSession(w, b, cursor);
  return { w: w.snapshot(), b: b.snapshot(), replayIndex: cursor.replayIndex };
};

test("headless advance matches visible fixed steps, including action timing, both scenarios and exact RNG; source stays unchanged", async () => {
  const source = timeSession("advance-equivalence"),
    before = JSON.stringify(source),
    reference = expected(source),
    progress = [];
  const out = await runAdvance(source, options, {
    ...hooks,
    progress: (p) => progress.push(p),
  });
  assert.equal(out.complete, true);
  assert.equal(out.progress.doneTicks, 100);
  assert.equal(out.session.world.tick, 100);
  assert.equal(out.session.comparison.tick, 100);
  assert.equal(JSON.stringify(out.session.world), JSON.stringify(reference.w));
  assert.equal(
    JSON.stringify(out.session.comparison),
    JSON.stringify(reference.b),
  );
  assert.equal(out.session.replayIndex, 2);
  assert.equal(out.session.running, false);
  assert.deepEqual(out.session.clock, source.clock);
  assert.equal(out.session.advance, undefined);
  assert.equal(JSON.stringify(source), before);
  assert.ok(progress.length > 0);
  assert.ok(
    progress.every((p, i) => !i || p.doneTicks >= progress[i - 1].doneTicks),
  );
});
test("budget commits only complete ticks, persists the remaining goal and resumes from checkpoints to the same exact future", async () => {
  const source = timeSession("advance-budget"),
    reference = expected(source);
  let session = source,
    tries = 0,
    first;
  do {
    let time = 0;
    const out = await runAdvance(session, options, {
      ...hooks,
      now: () => (time += 100),
    });
    first ??= out;
    tries++;
    assert.ok(out.progress.doneTicks > 0);
    session = decodeCheckpoint(
      createCheckpoint(out.session, {
        id: "manual-resume-" + tries,
        sequence: tries,
        createdAt: tries,
        kind: "manual",
        label: "Resume",
      }),
    );
    if (!out.complete) {
      assert.equal(session.advance.targetTick, 100);
      assert.equal(session.advance.startTick, 0);
    } else break;
    assert.ok(tries < 20);
  } while (true);
  assert.equal(first.complete, false);
  assert.ok(tries > 1);
  assert.equal(session.advance, undefined);
  assert.equal(JSON.stringify(session.world), JSON.stringify(reference.w));
  assert.equal(JSON.stringify(session.comparison), JSON.stringify(reference.b));
  assert.equal(session.replayIndex, 2);
});
test("cooperative cancellation yields no applied outcome and leaves the source and replay cursor unchanged", async () => {
  const s = timeSession("advance-cancel"),
    before = JSON.stringify(s);
  let cancel = false,
    time = 0,
    progress = 0;
  await assert.rejects(
    runAdvance(s, options, {
      cancelled: () => cancel,
      now: () => (time += 5),
      progress: () => progress++,
      pause: async () => {
        cancel = true;
      },
    }),
    AdvanceCancelled,
  );
  assert.ok(progress > 0);
  assert.equal(JSON.stringify(s), before);
});
test("advance validates limits and requires a paused source instead of silently advancing a running experiment", async () => {
  const s = timeSession();
  await assert.rejects(
    runAdvance({ ...s, running: true }, options, hooks),
    /Pause/,
  );
  for (const o of [
    { days: 0, budgetMs: 10000 },
    { days: 366, budgetMs: 10000 },
    { days: 1.2, budgetMs: 10000 },
    { days: 1, budgetMs: 1 },
  ])
    await assert.rejects(runAdvance(s, o, hooks));
});
class Port {
  onmessage = null;
  onerror = null;
  sent = [];
  ended = false;
  postMessage(m) {
    this.sent.push(m);
  }
  terminate() {
    this.ended = true;
  }
}
test("cancelled or replaced worker responses cannot overwrite a newer session, and a successful response applies once", () => {
  const ports = [],
    applied = [],
    errors = [];
  const client = new AdvanceClient(
    () => {
      const p = new Port();
      ports.push(p);
      return p;
    },
    (p, e) => {
      if (e) errors.push(e);
    },
    (o) => applied.push(o),
  );
  const s = timeSession();
  client.start(s, options);
  const a = ports[0],
    id = a.sent[0].id;
  client.cancel();
  a.onmessage({ data: { id, type: "result", outcome: { session: s } } });
  assert.equal(applied.length, 0);
  assert.equal(a.ended, true);
  client.start(s, options);
  const b = ports[1],
    next = b.sent[0].id;
  a.onerror({});
  assert.equal(errors.length, 0);
  b.onmessage({ data: { id: next, type: "result", outcome: { session: s } } });
  b.onmessage({ data: { id: next, type: "result", outcome: { session: s } } });
  assert.equal(applied.length, 1);
  assert.equal(b.ended, true);
  client.start(s, options);
  const c = ports[2];
  c.onerror({});
  assert.equal(errors.length, 1);
  assert.equal(applied.length, 1);
});

for (const [name, make] of [
  ["shared daughter colonies", () => family("time-family").w],
  [
    "founding with finite fertility, soil, climate and survival",
    () => survivalWorld(true),
  ],
]) {
  test("headless advance preserves the exact future of " + name, async () => {
    const w = make();
    const source = captureSession({
      world: w,
      comparison: null,
      scenario: "a",
      initial: {
        seed: w.seed,
        params: { ...w.params },
        biologicalProfile: w.biologicalProfile,
      },
      running: false,
      replaying: false,
      replayIndex: 0,
      interventions: [],
    });
    if (w.ants[0]?.life) {
      w.intervene("healthChallenge", 0, 0, w.ants[0].id);
      source.world = w.snapshot();
    }
    const baseline = World.restore(source.world);
    baseline.step(100);
    const out = await runAdvance(source, options, hooks);
    assert.equal(out.complete, true);
    assert.equal(
      JSON.stringify(out.session.world),
      JSON.stringify(baseline.snapshot()),
    );
    if (source.world.colonies?.length)
      assert.equal(
        out.session.world.colonies.length,
        source.world.colonies.length,
      );
  });
}
