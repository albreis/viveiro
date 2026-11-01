import { test } from "node:test";
import assert from "node:assert/strict";
import { airFixture } from "./fixtures/air.mjs";
import { airNetwork } from "../src/modules/ventilation/network.ts";
import { syncGases } from "../src/modules/ventilation/state.ts";
import { solveAirPressure } from "../src/modules/ventilation/pressure.ts";
import { transportGases } from "../src/modules/ventilation/transport.ts";
import { respire } from "../src/modules/ventilation/respiration.ts";
import {
  gasBudget,
  adjacentAirComfort,
  airEnergyCost,
} from "../src/modules/ventilation/sensing.ts";
const close = (a, b = 0, t = 1e-9) =>
  assert.ok(Math.abs(a - b) < t, a + " != " + b);
test("closed gas transport conserves both tracers and stays nonnegative for a large step", () => {
  const { w, net, s } = airFixture(0);
  s.cells[0].oxygen = s.cells[0].volume * 0.09;
  s.cells[0].carbon = s.cells[0].volume * 0.1;
  const oxygen = s.cells.reduce((n, c) => n + c.oxygen, 0),
    carbon = s.cells.reduce((n, c) => n + c.carbon, 0);
  const inlet = solveAirPressure(w, net, s);
  transportGases(s, net, inlet, 10000);
  close(
    s.cells.reduce((n, c) => n + c.oxygen, 0),
    oxygen,
  );
  close(
    s.cells.reduce((n, c) => n + c.carbon, 0),
    carbon,
  );
  assert.ok(
    s.cells.every(
      (c) =>
        c.oxygen >= 0 &&
        c.carbon >= 0 &&
        Number.isFinite(c.carbon) &&
        c.oxygen + c.carbon <= c.volume,
    ),
  );
});
test("one opening cannot create throughflow in a blind tree; two openings respond to wind", () => {
  const { w, net, s } = airFixture(1);
  w.params.windX = 3;
  solveAirPressure(w, net, s);
  assert.ok(s.flow.every((q) => Math.abs(q) < 1e-10));
  w.nest.nodes[2].type = "entrance";
  const two = airNetwork(w);
  const inlets = solveAirPressure(w, two, s);
  assert.ok(Math.abs(s.flow[0]) > 1e-7);
  close(inlets.reduce((a, b) => a + b, 0));
  assert.ok(s.residual < 1e-10);
});
test("wind removes more excess carbon through two openings than diffusion alone", () => {
  const run = (wind) => {
    const { w, net, s } = airFixture(2);
    w.params.windX = wind;
    for (const c of s.cells) c.carbon = c.volume * 0.05;
    const inlet = solveAirPressure(w, net, s);
    transportGases(s, net, inlet, 6000);
    return s.cells.reduce((n, c) => n + c.carbon, 0);
  };
  assert.ok(run(4) < run(0));
});
test("thermal buoyancy reverses when soil-air temperature difference reverses", () => {
  const { w } = airFixture(2);
  w.nest.nodes[2].y = 1;
  const solve = (air) => {
    w.params.temperatureC = air;
    const net = airNetwork(w),
      s = syncGases(w, net);
    solveAirPressure(w, net, s);
    return s.flow[0];
  };
  const hot = solve(10),
    cold = solve(38);
  assert.ok(Math.abs(hot) > 1e-9);
  assert.ok(hot * cold < 0);
});
test("rubble restricts diffusion and circulation; widening a tunnel increases conductance", () => {
  const { w, net } = airFixture(2);
  w.nest.rubble = [{ x: -0.5, y: -0.5, z: 0, mass: 0.1 }];
  const blocked = airNetwork(w);
  assert.ok(blocked.edges[0].conductance < net.edges[0].conductance * 0.5);
  assert.ok(blocked.edges[0].diffusion < net.edges[0].diffusion);
  w.nest.rubble = [];
  w.nest.linkWidths[0] = 0.5;
  assert.ok(airNetwork(w).edges[0].conductance > net.edges[0].conductance);
});
test("respiration, boundary exchange and excavation changes have explicit budgets", () => {
  const { w, net, s } = airFixture(2);
  w.ants = [
    { node: 1, x: 0, y: -1, z: 0, route: [], bodyScale: 1, metabolicCost: 1 },
  ];
  w.brood = [{ node: 1 }];
  respire(w, s, 100);
  assert.ok(s.consumed > 0);
  close(s.produced, s.consumed * 0.8);
  w.params.windX = 3;
  transportGases(s, net, solveAirPressure(w, net, s), 500);
  w.nest.nodes[1].r = 0.8;
  syncGases(w, airNetwork(w));
  const budget = gasBudget(s);
  close(budget.oxygen);
  close(budget.carbon);
  assert.ok(s.geometryOxygen > 0);
});
test("air sensors use only adjacent short exits; exposure costs energy without moving a body", () => {
  const { w, s } = airFixture(2),
    a = { node: 0, route: [], x: -1, y: 0, z: 0 };
  s.cells[1].carbon = s.cells[1].volume * 0.1;
  assert.equal(adjacentAirComfort(w, a, 1), 1);
  w.nest.nodes[1].x = -0.5;
  w.nest.nodes[1].y = -0.5;
  assert.ok(adjacentAirComfort(w, a, 1) < 0.2);
  assert.equal(adjacentAirComfort(w, a, 2), 1);
  a.node = 1;
  assert.ok(airEnergyCost(w, a) > 0);
  assert.equal(a.x, -1);
});

test("an empty founding site and a sealed disconnected compartment remain finite", () => {
  const { w } = airFixture(0);
  w.nest.nodes = [];
  w.nest.links = [];
  w.nest.linkWidths = [];
  const empty = airNetwork(w),
    state = syncGases(w, empty);
  transportGases(state, empty, solveAirPressure(w, empty, state), 20);
  assert.equal(state.cells.length, 0);
  assert.equal(state.residual, 0);
  const f = airFixture(2);
  f.w.nest.rubble = [{ x: -0.5, y: -0.5, z: 0, mass: 1 }];
  const net = airNetwork(f.w);
  assert.equal(net.edges[0].conductance, 0);
  const inlet = solveAirPressure(f.w, net, f.s);
  transportGases(f.s, net, inlet, 50);
  assert.ok(f.s.pressure.every(Number.isFinite));
  assert.ok(f.s.residual < 1e-10);
});
test("carried brood respires at its carrier compartment instead of a stale nursery node", () => {
  const { w, s } = airFixture(0);
  w.ants = [
    {
      id: 9,
      node: 2,
      x: 1,
      y: 0,
      z: 0,
      route: [],
      bodyScale: 1,
      metabolicCost: 1,
    },
  ];
  w.brood = [{ node: 0, carrier: 9 }];
  const before = s.cells.map((c) => c.oxygen);
  respire(w, s, 10);
  close(s.cells[0].oxygen, before[0]);
  close(before[2] - s.cells[2].oxygen, 0.000023);
});
