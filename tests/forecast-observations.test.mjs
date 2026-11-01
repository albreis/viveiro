import { test } from "node:test";
import assert from "node:assert/strict";
import { World, forecast } from "./fixtures/established-world.mjs";
import {
  observeCounts,
  normalizeCounts,
} from "../src/modules/forecast/observations.ts";
import { fitCounts, countFuture } from "../src/modules/forecast/count-model.ts";
import { runCountForecast } from "../src/modules/forecast/count-run.ts";
import { ForecastCancelled } from "../src/modules/forecast/run.ts";
import { ForecastClient } from "../src/services/forecast-client.ts";
import { summarizeErrors } from "../src/modules/forecast/evaluation-metrics.ts";
import { evaluateSnapshot } from "../src/modules/forecast/evaluate-snapshot.ts";
const observation = {
  kind: "counts",
  seed: "counts",
  tick: 100,
  counts: [
    { tick: 50, population: 10 },
    { tick: 75, population: 11 },
    { tick: 100, population: 12 },
  ],
};
const options = { runs: 6, days: 2, budgetMs: 30000, observation: "counts" };
const hooks = {
  cancelled: () => false,
  progress: () => {},
  pause: async () => {},
};
test("observation contract reads only declared census fields and discards future and old records before reading values", () => {
  const secret = () => {
      throw Error("hidden state was accessed");
    },
    future = {
      tick: 101,
      get population() {
        return secret();
      },
    },
    old = {
      tick: -250,
      get population() {
        return secret();
      },
    };
  const allowed = {
    seed: "safe",
    tick: 100,
    ants: { length: 2 },
    colonies: [{ ants: { length: 3 } }],
    history: [{ tick: 50, population: 4 }, future, old],
  };
  const source = new Proxy(allowed, {
    get(target, key) {
      if (!(key in target)) return secret();
      return target[key];
    },
  });
  const result = observeCounts(source);
  assert.deepEqual(result, {
    kind: "counts",
    seed: "safe",
    tick: 100,
    counts: [
      { tick: 50, population: 4 },
      { tick: 100, population: 5 },
    ],
  });
  assert.deepEqual(
    normalizeCounts({ ...result, counts: [...result.counts, future] }),
    result,
  );
});
test("count extrapolation uses only past observations, recovers a linear census trend and stays bounded", () => {
  const fit = fitCounts(observation);
  assert.equal(fit.slope, 4);
  assert.ok(fit.residuals.every((r) => Math.abs(r) < 1e-10));
  assert.equal(countFuture(observation, fit, 2, 0), 20);
  assert.equal(
    countFuture(observation, { ...fit, current: 449, slope: 1000 }, 7, 0),
    450,
  );
  assert.equal(
    countFuture(observation, { ...fit, current: 1, slope: -1000 }, 7, 0),
    0,
  );
});
test("bootstrap outcomes are deterministic and leave observations untouched; short history is explicitly labelled persistence", async () => {
  const before = structuredClone(observation),
    a = await runCountForecast(observation, options, hooks),
    b = await runCountForecast(observation, options, hooks);
  assert.deepEqual(a.result, b.result);
  assert.deepEqual(observation, before);
  assert.equal(a.observation, "counts");
  assert.equal(a.observedPoints, 3);
  assert.equal(a.complete, true);
  const short = await runCountForecast(
    { ...observation, counts: observation.counts.slice(-1) },
    options,
    hooks,
  );
  assert.match(short.warning, /insuficiente/);
  assert.deepEqual(short.result.values, Array(6).fill(12));
});
test("partial forecast transport excludes the full model and preserves the method metadata in results", () => {
  let sent;
  const port = {
    postMessage: (value) => (sent = value),
    terminate() {},
    onmessage: null,
    onerror: null,
  };
  const client = new ForecastClient(
    () => {},
    () => port,
  );
  client.options.observation = "counts";
  client.request(observation, "a");
  assert.deepEqual(Object.keys(sent.snapshot).sort(), ["seed", "tick"]);
  assert.deepEqual(sent.observation, observation);
  assert.equal("ants" in sent.snapshot, false);
  port.onmessage({
    data: {
      id: sent.id,
      type: "result",
      outcome: {
        complete: true,
        result: null,
        observation: "counts",
        observedPoints: 3,
        warning: "approx",
      },
    },
  });
  assert.equal(client.state.observation, "counts");
  assert.equal(client.state.observedPoints, 3);
  assert.equal(client.state.warning, "approx");
  client.request({ seed: "wrong", tick: 0, ants: [] }, "a");
  assert.equal(client.state.status, "error");
});
test("forecast errors are grouped by horizon with signed bias, MAE, RMSE, empirical coverage and width", () => {
  const row = (truth, median, low, high, current) => ({
    seed: "metric",
    originTick: 0,
    days: 1,
    truth,
    current,
    complete: { median, low, high },
    counts: { median: truth, low: truth, high: truth },
    persistence: { median: current, low: current, high: current },
  });
  const result = summarizeErrors([
      row(10, 12, 11, 13, 9),
      row(20, 18, 17, 21, 21),
    ]),
    full = result.find((r) => r.method === "complete");
  assert.deepEqual(full, {
    method: "complete",
    days: 1,
    n: 2,
    mae: 2,
    rmse: 2,
    bias: 0,
    coverage: 0.5,
    width: 3,
  });
  assert.equal(result.find((r) => r.method === "counts").mae, 0);
  assert.equal(result.find((r) => r.method === "persistence").mae, 1);
  assert.deepEqual(summarizeErrors([]), []);
});
test("paired evaluation scores independent true continuations and matches the prior ensemble at each horizon", async () => {
  const w = new World("heldout-unit");
  w.step(180);
  const before = w.snapshot(),
    rows = await evaluateSnapshot(
      before,
      { horizons: [0.1, 0.2], runs: 2, budgetMs: 120000 },
      hooks,
    );
  assert.equal(rows.length, 2);
  assert.deepEqual(w.snapshot(), before);
  for (const row of rows) {
    const truth = World.restore(before);
    truth.step(Math.round(row.days * 100));
    assert.equal(row.truth, truth.population);
    const prior = forecast(before, 2, row.days);
    assert.equal(row.complete.median, prior.median);
    assert.equal(row.complete.low, prior.low);
    assert.equal(row.complete.high, prior.high);
  }
});
test("incomplete budgeted ensembles cannot silently enter evaluation metrics", async () => {
  const w = new World("budget-eval");
  let clock = 0;
  await assert.rejects(
    evaluateSnapshot(
      w.snapshot(),
      { horizons: [0.1], runs: 2, budgetMs: 1 },
      { ...hooks, now: () => (clock += 10) },
    ),
    /orçamento/,
  );
});
test("partial forecast cancellation is honored after yielding and invalid census inputs fail explicitly", async () => {
  let cancelled = false;
  await assert.rejects(
    runCountForecast(observation, options, {
      ...hooks,
      cancelled: () => cancelled,
      pause: async () => {
        cancelled = true;
      },
    }),
    ForecastCancelled,
  );
  assert.throws(
    () =>
      normalizeCounts({
        ...observation,
        counts: [{ tick: 100, population: NaN }],
      }),
    /Censo/,
  );
  assert.throws(
    () =>
      normalizeCounts({
        ...observation,
        counts: [{ tick: 99, population: 2 }],
      }),
    /atual/,
  );
});
