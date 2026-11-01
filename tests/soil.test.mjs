import { undergroundEdge, lerp } from "./fixtures/geometry.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { proposeDig, digBite } from "../src/modules/soil/projects.ts";
import {
  soilBalance,
  depositSoil,
  dropSoil,
} from "../src/modules/soil/ledger.ts";
import { collapseEdge } from "../src/modules/soil/erosion.ts";
import { updateSoilWorker } from "../src/modules/soil/worker.ts";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";

test("newly excavated and eroded material remains in cargo, deposits or rubble", () => {
  const w = new World("soil-ledger");
  const project = proposeDig(w, 3);
  assert.ok(project);
  const ant = w.makeAnt("worker", 0, 0);
  w.ants = [ant];
  const revision = w.nest.revision;
  for (let i = 0; i < 35; i++) digBite(w, ant, project);
  assert.ok(w.soil.removed > 0);
  assert.ok(w.nest.revision > revision);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-10);
  depositSoil(w, ant);
  assert.ok(w.soil.deposited > 0);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-10);
  w.ants = [];
  const rubble = collapseEdge(w, undergroundEdge(w).i, true);
  assert.ok(rubble && w.soil.eroded > 0);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-10);
});

test("a digger carries material to the surface without teleporting, then returns to work", () => {
  const w = new World("soil-carrier");
  const project = proposeDig(w, 3);
  assert.ok(project);
  const front = w.nest.nodes[project.front],
    from = w.nest.nodes[3];
  const footing = tunnelFooting(w.nest, front, from, front, 0.35);
  const ant = w.makeAnt("worker", footing.x, footing.z);
  Object.assign(ant, {
    ...footing,
    node: project.front,
    route: [],
    tunnelCenter: { x: front.x, y: front.y, z: front.z },
    tunnelY: front.y,
    soilTask: { projectId: project.id, phase: "dig", digTicks: 0 },
  });
  w.ants = [ant];
  w.brood = [];
  w.predators = [];
  w.food = 100;
  let carrying = false,
    deposited = false,
    maxJump = 0;
  for (let i = 0; i < 2200; i++) {
    const p = { x: ant.x, y: ant.y, z: ant.z };
    w.step();
    maxJump = Math.max(
      maxJump,
      Math.hypot(ant.x - p.x, ant.y - p.y, ant.z - p.z),
    );
    carrying ||= ant.carryingSoil > 0;
    deposited ||= w.soil.deposited > 0;
    assert.ok(Math.abs(soilBalance(w).error) < 1e-8);
    assert.ok(maxJump <= ant.speed * 1.2 + 0.002, "soil carrier teleported");
    if (deposited && ant.node !== null && ant.soilTask?.phase !== "dump") break;
  }
  console.log(
    JSON.stringify({
      carrying,
      deposited,
      maxJump,
      task: ant.soilTask,
      state: ant.state,
    }),
  );
  assert.ok(carrying);
  assert.ok(
    deposited,
    "a digger must reach the surface before claiming delivery",
  );
  assert.ok(ant.node !== null, "the digger must return below ground");
});

test("repairing rubble transfers mass into a worker rather than deleting it", () => {
  const w = new World("soil-repair");
  w.ants = [];
  const rubble = collapseEdge(w, undergroundEdge(w).i, true);
  assert.ok(rubble);
  const ant = w.makeAnt("worker", rubble.x, rubble.z);
  Object.assign(ant, {
    y: rubble.y,
    node: w.nest.links[rubble.edge][0],
    route: [w.nest.links[rubble.edge][1]],
    soilTask: { phase: "repair", rubbleId: rubble.id, digTicks: 0 },
  });
  w.ants = [ant];
  const before = rubble.mass;
  for (let i = 0; i < 5; i++) updateSoilWorker(w, ant);
  assert.ok(rubble.mass < before);
  assert.ok(ant.carryingSoil > 0);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-10);
  dropSoil(w, ant);
  assert.equal(ant.carryingSoil, 0);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-10);
});

test("snapshots preserve excavation work and its future material balance", () => {
  const w = new World("soil-snapshot");
  w.step(600);
  const copy = World.restore(w.snapshot());
  w.step(200);
  copy.step(200);
  assert.deepEqual(copy.snapshot(), w.snapshot());
  assert.ok(Math.abs(soilBalance(copy).error) < 1e-8);
});

test("a local repair worker clears a collapse through repeated trips to the surface", () => {
  const w = new World("repair-cycle");
  w.ants = [];
  w.predators = [];
  w.brood = [];
  w.food = 100;
  const edge = undergroundEdge(w);
  const pile = collapseEdge(w, edge.i, true);
  assert.ok(pile);
  const center = lerp(edge.p, edge.q, 0.4);
  const f = tunnelFooting(w.nest, center, edge.p, edge.q, 0.35);
  const ant = w.makeAnt("worker", f.x, f.z);
  Object.assign(ant, {
    ...f,
    node: edge.a,
    route: [edge.b],
    tunnelCenter: center,
    tunnelY: center.y,
  });
  w.ants = [ant];
  for (let i = 0; i < 3500 && pile.mass > 0.0001; i++) {
    const p = { x: ant.x, y: ant.y, z: ant.z };
    w.step();
    assert.ok(
      Math.hypot(ant.x - p.x, ant.y - p.y, ant.z - p.z) <=
        ant.speed * 1.2 + 0.002,
    );
    assert.ok(Math.abs(soilBalance(w).error) < 1e-8);
  }
  console.log(
    JSON.stringify({
      remaining: pile.mass,
      deposited: w.soil.deposited,
      tick: w.tick,
      task: ant.soilTask,
    }),
  );
  assert.ok(
    pile.mass <= 0.0001,
    "the collapse must be cleared, not only have its first bite removed",
  );
  assert.ok(w.soil.deposited > 0);
});

test("a detour ending at another entrance does not complete an excavation return", async () => {
  const { arriveWithSoil } = await import("../src/modules/soil/routing.ts");
  const w = new World("detour-job"),
    project = proposeDig(w, 3);
  assert.ok(project);
  const node = w.nest.nodes[6],
    ant = w.makeAnt("worker", node.x, node.z);
  Object.assign(ant, {
    node: 6,
    route: [],
    soilTask: { projectId: project.id, phase: "return", digTicks: 0 },
  });
  arriveWithSoil(w, ant, 6);
  assert.equal(ant.soilTask.phase, "return");
  updateSoilWorker(w, ant);
  assert.ok(
    w.nest.links.some(
      ([a, b]) =>
        (a === 6 && b === ant.route[0]) || (b === 6 && a === ant.route[0]),
    ),
  );
  assert.notEqual(ant.route[0], project.front);
});

test("a digger with an advanced logical node walks its body to the workface before excavating", () => {
  const w = new World("workface-return");
  w.ants = [];
  w.brood = [];
  w.predators = [];
  w.food = 100;
  const project = proposeDig(w, 2);
  assert.ok(project);
  const from = w.nest.nodes[2],
    to = w.nest.nodes[1],
    center = lerp(from, to, 0.5);
  const footing = tunnelFooting(w.nest, center, from, to, Math.PI);
  const ant = w.makeAnt("worker", footing.x, footing.z);
  Object.assign(ant, footing, {
    node: project.front,
    route: [],
    tunnelCenter: { ...w.nest.nodes[project.front] },
    tunnelY: w.nest.nodes[project.front].y,
    soilTask: { phase: "dig", projectId: project.id, digTicks: 0 },
  });
  w.ants = [ant];
  for (let i = 0; i < 600 && w.soil.removed === 0; i++) {
    const old = { x: ant.x, y: ant.y, z: ant.z };
    w.step();
    assert.ok(
      Math.hypot(ant.x - old.x, ant.y - old.y, ant.z - old.z) <=
        ant.speed * 1.2 + 0.002,
    );
  }
  assert.ok(
    w.soil.removed > 0,
    "a logical self-route must not leave the digger motionless",
  );
});
