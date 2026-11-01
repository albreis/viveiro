import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { knownRoute } from "../src/modules/navigation/route-memory.ts";
import { requestRoute } from "../src/modules/navigation/local-routing.ts";
import { chooseLocalExit } from "../src/modules/navigation/local-route-policy.ts";
import {
  createNestOdors,
  updateNestOdors,
  routeOdorSignal,
} from "../src/modules/chemistry/nest-odors.ts";

test("route memory uses only edges the ant has traversed", () => {
  const memory = [
    [0, 1, 2],
    [1, 2, 2],
    [0, 3, 10],
    [3, 2, 10],
  ];
  assert.deepEqual(knownRoute(memory, 0, 2), [1, 2]);
  assert.deepEqual(knownRoute([], 0, 2), []);
  assert.deepEqual(knownRoute(memory, 0, 2, [0, 1]), [3, 2]);
});
test("an untrained ant receives one adjacent exit, not a global route", () => {
  const w = new World("local-route"),
    ant = w.makeAnt("worker", w.nest.nodes[3].x, w.nest.nodes[3].z);
  Object.assign(ant, { node: 3, route: [], knownEdges: [] });
  requestRoute(w, ant, 0);
  assert.equal(ant.route.length, 1);
  assert.ok(
    w.nest.links.some(
      ([a, b]) =>
        (a === 3 && b === ant.route[0]) || (b === 3 && a === ant.route[0]),
    ),
  );
  assert.equal(ant.knownEdges.length, 0);
});
test("landmark chemistry is balanced and creates a local directional signal", () => {
  const w = new World("odor"),
    state = createNestOdors(w.nest);
  for (let i = 0; i < 100; i++) updateNestOdors(w.nest, state);
  const total = Object.values(state.fields)
    .flat()
    .reduce((n, v) => n + v, 0);
  assert.ok(
    Math.abs(total - state.initial - state.emitted + state.evaporated) < 1e-8,
  );
  assert.ok(routeOdorSignal(w.nest, state, 1, 0, "1:entrance") > 0);
  assert.ok(
    Object.values(state.fields)
      .flat()
      .every((v) => v >= 0 && Number.isFinite(v)),
  );
});
test("the local policy favors a sensed gradient but still explores", () => {
  const w = new World("local-policy");
  let forward = 0;
  const options = [
    {
      id: 1,
      signal: 0.06,
      visited: false,
      backtrack: false,
      goalVisible: false,
    },
    {
      id: 2,
      signal: -0.06,
      visited: false,
      backtrack: false,
      goalVisible: false,
    },
  ];
  for (let i = 0; i < 4000; i++)
    forward += chooseLocalExit(options, () => w.random()) === 1 ? 1 : 0;
  assert.ok(forward > 3800 && forward < 4000);
});

test("recent unrewarded cycles suppress even a strong misleading odor", () => {
  const options = [
    {
      id: 1,
      signal: 0.15,
      visited: true,
      visits: 4,
      backtrack: true,
      goalVisible: false,
    },
    {
      id: 2,
      signal: 0,
      visited: false,
      visits: 0,
      backtrack: false,
      goalVisible: false,
    },
  ];
  assert.equal(
    chooseLocalExit(options, () => 0.5),
    2,
  );
});
