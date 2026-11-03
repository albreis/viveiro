import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  balancedReference,
  registerExtension,
  requireExtension,
  extensionReference,
} from "../src/modules/extensions/registry.ts";
import {
  localInput,
  extensionChoice,
} from "../src/modules/extensions/decision.ts";
import { World } from "../src/modules/simulation/world.js";
import { continueLocalRoute } from "../src/modules/navigation/local-routing.ts";
const exits = [
  {
    id: 1,
    signal: 0.1,
    comfort: 1,
    visited: false,
    backtrack: false,
    goalVisible: false,
  },
  {
    id: 2,
    signal: 0,
    comfort: 0.8,
    visited: false,
    backtrack: false,
    goalVisible: true,
  },
];
const reference = (id) => ({
  schema: 1,
  id,
  version: 1,
  sourceSha256: "a".repeat(64),
});
test("bundled example hash identifies the formatted one-file source", () => {
  const hash = createHash("sha256")
    .update(
      readFileSync("src/extensions/balanced.ts", "utf8").replaceAll(
        "\r\n",
        "\n",
      ),
    )
    .digest("hex");
  assert.equal(balancedReference.sourceSha256, hash);
  for (const ref of [
    { ...balancedReference, schema: 2 },
    { ...balancedReference, url: "https://example.org/x.js" },
    { ...balancedReference, sourceSha256: "bad" },
  ])
    assert.throws(() => extensionReference(ref));
  assert.throws(
    () => requireExtension({ ...balancedReference, version: 99 }),
    /não instalada/,
  );
});
test("sensors and signal submodels see only frozen local copies; only passable offered IDs can be sampled", () => {
  let calls = [];
  const ref = reference("test-local");
  registerExtension(
    {
      id: ref.id,
      version: 1,
      sensors: [
        {
          id: "cargo",
          sample: (input) => {
            assert.deepEqual(Object.keys(input).sort(), ["agent", "exits"]);
            assert.deepEqual(Object.keys(input.agent).sort(), [
              "energy",
              "hasLoad",
            ]);
            assert.throws(() => {
              input.exits[0].id = 900;
            });
            assert.throws(() => {
              input.agent.energy = 999;
            });
            calls.push("sensor");
            return { value: input.agent.hasLoad ? 2 : 1 };
          },
        },
      ],
      submodels: [
        {
          id: "bonus",
          compute: ({ signals }) => {
            calls.push("model");
            assert.throws(() => {
              signals["sensor.cargo.value"] = 9;
            });
            return { weight: signals["sensor.cargo.value"] * 2 };
          },
        },
      ],
      policy: {
        id: "local",
        weights: ({ signals }) => {
          calls.push("policy");
          return [0, signals["model.bonus.weight"]];
        },
      },
    },
    ref,
  );
  const ant = { energy: 80, carrying: 1, world: { secret: true } },
    input = localInput(ant, exits);
  assert.equal(
    extensionChoice(ref, input, () => 0.5),
    2,
  );
  assert.deepEqual(calls, ["sensor", "model", "policy"]);
  assert.equal(ant.energy, 80);
  assert.equal(exits[0].id, 1);
  assert.throws(
    () =>
      registerExtension(
        { id: ref.id, version: 1, policy: { id: "same", weights: () => [1] } },
        { ...ref, sourceSha256: "b".repeat(64) },
      ),
    /fonte diferente/,
  );
});
test("invalid signals and weights fail explicitly instead of moving to a hidden exit or silently falling back", () => {
  for (const [n, weights] of [
    [1, [0, 0]],
    [2, [NaN, 1]],
    [3, [1]],
    [4, [-1, 1]],
    [5, [1e9, 1]],
  ]) {
    const ref = reference("test-bad-" + n);
    registerExtension(
      { id: ref.id, version: 1, policy: { id: "bad", weights: () => weights } },
      ref,
    );
    assert.throws(() =>
      extensionChoice(ref, localInput({ energy: 1 }, exits), () => 0.3),
    );
  }
  const ref = reference("test-bad-signal");
  registerExtension(
    {
      id: ref.id,
      version: 1,
      sensors: [{ id: "nan", sample: () => ({ bad: Infinity }) }],
      policy: { id: "unused", weights: () => [1, 1] },
    },
    ref,
  );
  assert.throws(
    () => extensionChoice(ref, localInput({ energy: 1 }, exits), () => 0.5),
    /Sinal local/,
  );
});
test("extension World restores its exact future and refuses an unavailable policy before continuation", () => {
  const w = new World(
    "EXT-RESTORE",
    {},
    {
      founding: false,
      biologicalProfile: { schema: 1, id: "generic-demo", version: 1 },
      decisionExtension: balancedReference,
    },
  );
  w.step(240);
  const snapshot = w.snapshot(),
    restored = World.restore(snapshot);
  w.step(35);
  restored.step(35);
  assert.deepEqual(w.snapshot(), restored.snapshot());
  assert.ok(w.extensionDecisions > 0);
  const wrong = structuredClone(snapshot);
  wrong.decisionExtension.sourceSha256 = "f".repeat(64);
  assert.throws(() => World.restore(wrong), /não instalada/);
  const bad = structuredClone(snapshot);
  bad.extensionDecisions = -1;
  assert.throws(() => World.restore(bad), /Contagem/);
});
test("custom policy cannot choose a sealed edge or use the remembered-route fast path", () => {
  const w = new World(
    "EXT-PASSAGE",
    {},
    { founding: false, decisionExtension: balancedReference },
  );
  const ant = w.makeAnt("worker", 0, 0);
  Object.assign(ant, {
    node: 3,
    route: [],
    knownEdges: [[3, 4, 0]],
    routeIntent: {
      destination: 0,
      tag: "entrance",
      odor: "entrance",
      owner: 1,
    },
  });
  const blockedEdge = w.nest.links.findIndex(([a, b]) => a === 3 || b === 3);
  const pair = w.nest.links[blockedEdge],
    blocked = pair[0] === 3 ? pair[1] : pair[0];
  w.nest.plugs = [{ edge: blockedEdge, mass: 1, innerRadius: 0 }];
  continueLocalRoute(w, ant);
  assert.ok(!ant.route.includes(blocked));
  assert.ok(w.extensionDecisions > 0);
  assert.ok(ant.route.length <= 1);
  for (const id of ant.route)
    assert.ok(
      w.nest.links.some(
        ([a, b]) => (a === 3 && b === id) || (b === 3 && a === id),
      ),
    );
});
