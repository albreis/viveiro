import { test } from "node:test";
import assert from "node:assert/strict";
import { setImmediate as immediate } from "node:timers/promises";
import { World, forecast } from "./fixtures/established-world.mjs";
import { runForecast, ForecastCancelled } from "../src/modules/forecast/run.ts";
import { ForecastRunner } from "../src/services/forecast-runner.ts";
import { ForecastClient } from "../src/services/forecast-client.ts";
const options = { runs: 2, days: 0.08, budgetMs: 120000 };
const progress = {
  doneTicks: 1,
  totalTicks: 16,
  completedRuns: 0,
  elapsedMs: 1,
  activeMs: 1,
  maxSliceMs: 1,
};
test("sliced full-model forecast matches synchronous ensemble exactly without touching the source", async () => {
  const w = new World("scheduler"),
    before = w.snapshot(),
    events = [];
  const outcome = await runForecast(before, options, {
    cancelled: () => false,
    progress: (p) => events.push(p),
    pause: async () => {},
  });
  assert.equal(outcome.complete, true);
  assert.deepEqual(
    outcome.result,
    forecast(before, options.runs, options.days),
  );
  assert.deepEqual(w.snapshot(), before);
  assert.equal(outcome.progress.doneTicks, 16);
  assert.ok(
    events.every((p, i) => !i || p.doneTicks >= events[i - 1].doneTicks),
  );
});
test("cancellation after yielding discards the unfinished run and reports no completed outcome", async () => {
  let cancel = false,
    ticks = 0;
  await assert.rejects(
    runForecast(
      { seed: "cancel", tick: 0 },
      { ...options, days: 1 },
      {
        cancelled: () => cancel,
        progress: () => {},
        now: () => ticks * 10,
        createWorld: () => ({
          step: () => {
            ticks++;
          },
          population: () => 2,
        }),
        pause: async () => {
          cancel = true;
        },
      },
    ),
    ForecastCancelled,
  );
  assert.equal(ticks, 1);
});
test("work budget stops within one indivisible tick and never treats partial horizon as a finished future", async () => {
  let clock = 0,
    ticks = 0;
  const outcome = await runForecast(
    { seed: "budget", tick: 0 },
    { runs: 3, days: 0.1, budgetMs: 15 },
    {
      cancelled: () => false,
      progress: () => {},
      now: () => clock,
      createWorld: () => ({
        step: () => {
          ticks++;
          clock += 10;
        },
        population: () => 99,
      }),
      pause: async () => {
        clock += 1000;
      },
    },
  );
  assert.equal(ticks, 2);
  assert.equal(outcome.complete, false);
  assert.equal(outcome.result, null);
  assert.equal(outcome.progress.activeMs, 20);
  assert.ok(outcome.progress.elapsedMs >= 1000);
  assert.equal(outcome.progress.completedRuns, 0);
});
test("latest request replaces queued work and stale outcomes never reach the interface", async () => {
  const starts = [],
    messages = [];
  let release;
  const execute = async (snapshot, opts, hooks) => {
    starts.push(snapshot.seed);
    if (snapshot.seed === "old") await new Promise((r) => (release = r));
    hooks.progress(progress);
    return { complete: true, result: null, progress };
  };
  const runner = new ForecastRunner(
    (message) => messages.push(message),
    execute,
  );
  const request = (id, seed) => ({
    type: "start",
    id,
    snapshot: { seed, tick: 0 },
    options,
  });
  runner.receive(request(1, "old"));
  runner.receive(request(2, "superseded"));
  runner.receive(request(3, "latest"));
  release();
  await immediate();
  assert.deepEqual(starts, ["old", "latest"]);
  assert.ok(messages.length > 0);
  assert.ok(messages.every((m) => m.id === 3));
});
test("explicit cancel removes queued jobs as well as the running result", async () => {
  let release;
  const messages = [];
  const runner = new ForecastRunner(
    (m) => messages.push(m),
    async () => {
      await new Promise((r) => (release = r));
      return { complete: true, result: null, progress };
    },
  );
  runner.receive({
    type: "start",
    id: 1,
    snapshot: { seed: "cancel", tick: 0 },
    options,
  });
  runner.receive({ type: "cancel", id: 2 });
  release();
  await immediate();
  assert.deepEqual(messages, []);
});
test("client ignores results invalidated by an intervention, cancellation or scenario change", () => {
  const posted = [],
    port = {
      postMessage: (m) => posted.push(m),
      terminate() {},
      onmessage: null,
      onerror: null,
    };
  const client = new ForecastClient(
    () => {},
    () => port,
  );
  client.request({ seed: "a", tick: 12 }, "a");
  const first = posted[0].id;
  client.invalidate();
  port.onmessage({
    data: {
      id: first,
      type: "result",
      outcome: { complete: true, result: null, progress },
    },
  });
  assert.equal(client.state.status, "idle");
  client.request({ seed: "b", tick: 13 }, "b");
  const second = posted.at(-1).id;
  client.cancel();
  port.onmessage({ data: { id: second, type: "progress", progress } });
  assert.equal(client.state.status, "cancelled");
  client.consider(
    () => {
      throw Error("cancelled jobs must not restart automatically");
    },
    "b",
    300,
  );
  assert.equal(client.state.status, "cancelled");
});
test("budget exhaustion and worker failures remain visible instead of silently restarting every frame", () => {
  const posted = [],
    port = {
      postMessage: (m) => posted.push(m),
      terminate() {},
      onmessage: null,
      onerror: null,
    };
  const client = new ForecastClient(
    () => {},
    () => port,
  );
  client.request({ seed: "a", tick: 12 }, "a");
  port.onmessage({
    data: {
      id: posted.at(-1).id,
      type: "result",
      outcome: { complete: false, result: null, progress },
    },
  });
  assert.equal(client.state.status, "budget");
  client.consider(
    () => {
      throw Error("budget auto-retry");
    },
    "a",
    1000,
  );
  client.request({ seed: "a", tick: 12 }, "a");
  port.onerror({});
  assert.equal(client.state.status, "error");
});
test("invalid horizons and budgets are rejected before constructing any world", async () => {
  for (const changes of [
    { runs: 1 },
    { days: 0 },
    { days: NaN },
    { budgetMs: Infinity },
    { runs: 33 },
  ])
    await assert.rejects(
      runForecast(
        { seed: "invalid", tick: 0 },
        { ...options, ...changes },
        {
          cancelled: () => false,
          progress: () => {},
          createWorld: () => {
            throw Error("must not construct");
          },
        },
      ),
      /inválido/,
    );
});
