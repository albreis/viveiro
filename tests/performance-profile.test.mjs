import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import {
  renderProfile,
  visibleWorkers,
} from "../src/modules/renderer/performance-profile.ts";
import { FrameMeasurement } from "../src/modules/renderer/frame-measurement.ts";
import { soilMeshData } from "../src/modules/terrain/mesh-data.ts";
import { sampleSoil } from "../src/modules/terrain/field.ts";

test("limite visual preserva todos os agentes, inclui seleção distante e exclui o corpo seguido", () => {
  const ants = Array.from({ length: 160 }, (_, id) => ({
    id: id + 1,
    x: id,
    y: 0,
    z: 0,
  }));
  const before = structuredClone(ants);
  const light = visibleWorkers(
    ants,
    renderProfile("light"),
    { x: 0, y: 0, z: 0 },
    1,
    160,
  );
  assert.equal(light.length, 80);
  assert.ok(light.some((a) => a.id === 160));
  assert.ok(!light.some((a) => a.id === 1));
  assert.deepEqual(ants, before);
  assert.equal(
    visibleWorkers(ants, renderProfile("full"), { x: 0, y: 0, z: 0 }, 1, null)
      .length,
    159,
  );
});

test("malha leve reduz triângulos sem alterar campo de colisão ou estado do mundo", () => {
  const world = new World("light-mode-same-model");
  const before = world.snapshot();
  const full = soilMeshData(world.nest);
  const light = soilMeshData(world.nest, "light");
  assert.ok(light.positions.length < full.positions.length * 0.85);
  let error = 0;
  for (let i = 0; i < light.positions.length; i += 237) {
    const p = {
      x: light.positions[i],
      y: light.positions[i + 1],
      z: light.positions[i + 2],
    };
    error = Math.max(error, Math.abs(sampleSoil(world.nest, p).distance));
  }
  assert.ok(error < 0.005, "vértices fora do mesmo campo: " + error);
  assert.deepEqual(world.snapshot(), before);
});

test("medição usa tempo real e P95, e descarta medições canceladas", () => {
  const m = new FrameMeasurement();
  m.begin(0);
  let result;
  for (let frame = 1; frame <= 600; frame++)
    result = m.frame(frame * (10000 / 600), { calls: 40, triangles: 1000 });
  assert.ok(result);
  assert.equal(result.frames, 600);
  assert.ok(Math.abs(result.fps - 60) < 0.001);
  assert.ok(Math.abs(result.p95FrameMs - 1000 / 60) < 0.001);
  assert.equal(result.meanDrawCalls, 40);
  m.begin(20000);
  m.cancel();
  assert.equal(m.frame(40000, { calls: 1, triangles: 1 }), null);
});

test("perfil de apresentação separa previsão aproximada do modelo completo", () => {
  assert.equal(renderProfile("light").forecast, "counts");
  assert.equal(renderProfile("full").forecast, "complete");
  assert.equal(renderProfile("unknown").mode, "full");
});
