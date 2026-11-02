import { test } from "node:test";
import assert from "node:assert/strict";
import { setImmediate as turn } from "node:timers/promises";
import { runSweep } from "../src/modules/sweeps/run.ts";
import { exampleSweep } from "../src/modules/sweeps/plan.ts";
import {
  validateCheckpoint,
  checkpointJson,
} from "../src/modules/sweeps/checkpoint.ts";
import {
  sweepJobs,
  sweepVersion,
  sweepArithmetic,
} from "../src/modules/sweeps/jobs.ts";
import { runExperimentProcess } from "../scripts/lib/experiment-process.ts";
import { sha256 } from "../src/modules/sweeps/jobs.ts";
const plan = () => ({
  ...exampleSweep(),
  values: [45, 75],
  replicates: 2,
  base: { ...exampleSweep().base, days: 0 },
});
const execute = (job, signal) => runExperimentProcess(job.plan, { signal });
const stub = async (job) => {
  const csv = "fixture," + job.id + "\r\n";
  return {
    csv,
    manifest: JSON.stringify({
      schema: "viveiro-run-v1",
      modelVersion: sweepVersion,
      arithmetic: sweepArithmetic,
      calibrated: false,
      plan: job.plan,
      clock: { startTick: 0, endTick: job.plan.days * 100 },
      csv: {
        file: "dados.csv",
        bytes: new TextEncoder().encode(csv).length,
        sha256: await sha256(csv),
      },
    }),
  };
};
test("pool overlaps slots within its bound and commits before progress", async () => {
  let active = 0,
    peak = 0,
    committed = 0;
  const c = await runSweep(plan(), {
    concurrency: 3,
    execute: async (j) => {
      active++;
      peak = Math.max(peak, active);
      await turn();
      const r = await stub(j);
      active--;
      return r;
    },
    completed: () => {
      committed++;
    },
    progress: (c) => assert.equal(c.results.length, committed),
  });
  assert.ok(peak > 1 && peak <= 3);
  assert.equal(c.results.length, 4);
  assert.deepEqual(
    c.results.map((r) => r.id),
    ["v001-r001", "v001-r002", "v002-r001", "v002-r002"],
  );
});
test("real Worker results are equal in serial, parallel and resumed runs", async () => {
  const p = plan();
  const serial = await runSweep(p, { concurrency: 1, execute });
  const parallel = await runSweep(p, { concurrency: 3, execute });
  const first = await runSweep(p, { concurrency: 2, maxNewRuns: 1, execute });
  assert.equal(first.results.length, 1);
  let calls = 0;
  const resumed = await runSweep(p, {
    concurrency: 2,
    checkpoint: first,
    execute: (...args) => {
      calls++;
      return execute(...args);
    },
  });
  assert.equal(calls, 3);
  assert.equal(checkpointJson(serial), checkpointJson(parallel));
  assert.equal(checkpointJson(serial), checkpointJson(resumed));
  assert.ok(serial.results.every((r) => r.result.csv.charCodeAt(0) === 0xfeff));
  const jobs = await sweepJobs(p);
  for (const mutation of [
    (c) => (c.modelVersion = "old"),
    (c) => c.plan.values.reverse(),
    (c) => c.results.push(c.results[0]),
    (c) => (c.results[0].result.csv += "broken"),
    (c) => (c.results[0].id = "../../outside"),
  ]) {
    const bad = structuredClone(serial);
    mutation(bad);
    let called = false;
    await assert.rejects(
      runSweep(p, {
        concurrency: 2,
        checkpoint: bad,
        execute: async () => {
          called = true;
          throw Error("must not run");
        },
      }),
    );
    assert.equal(called, false);
  }
  await assert.rejects(validateCheckpoint({}, p, jobs));
});
test("a pre-aborted pool never starts an agent and no completed resume reruns work", async () => {
  const abort = new AbortController();
  abort.abort();
  let calls = 0;
  await assert.rejects(
    runSweep(plan(), {
      concurrency: 2,
      signal: abort.signal,
      execute: async () => {
        calls++;
        throw Error();
      },
    }),
    { name: "AbortError" },
  );
  assert.equal(calls, 0);
  const full = await runSweep(plan(), { concurrency: 2, execute: stub });
  const reused = await runSweep(plan(), {
    concurrency: 2,
    checkpoint: full,
    execute: async () => {
      throw Error("Unexpected rerun");
    },
  });
  assert.deepEqual(reused, full);
});
test("cancel preserves committed progress and interrupts active work", async () => {
  const abort = new AbortController();
  let latest;
  await assert.rejects(
    runSweep(plan(), {
      concurrency: 2,
      signal: abort.signal,
      execute: stub,
      progress: (c) => {
        latest = c;
        if (c.results.length >= 1) abort.abort();
      },
    }),
    { name: "AbortError" },
  );
  assert.ok(latest.results.length >= 1 && latest.results.length < 4);
  const finished = await runSweep(plan(), {
    concurrency: 2,
    checkpoint: latest,
    execute: stub,
  });
  assert.equal(finished.results.length, 4);
});
test("a worker failure is surfaced and remaining work is not silently marked complete", async () => {
  await assert.rejects(
    runSweep(plan(), {
      concurrency: 2,
      execute: async () => {
        throw Error("deliberate worker failure");
      },
    }),
    /deliberate worker failure/,
  );
});

test("terminating an active production Worker rejects promptly with AbortError", async () => {
  const abort = new AbortController();
  const p = exampleSweep().base;
  p.days = 365;
  const task = runExperimentProcess(p, { signal: abort.signal });
  abort.abort();
  await assert.rejects(task, { name: "AbortError" });
});
