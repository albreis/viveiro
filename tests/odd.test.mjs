import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import vectors from "../src/modules/model-documentation/vectors.json" with { type: "json" };
import { referenceField } from "../src/modules/model-documentation/reference-field.ts";
import { diffuseEvaporate } from "../src/modules/chemistry/reaction-diffusion.ts";
const close = (a, b, label) =>
  assert.ok(Math.abs(a - b) <= 1e-12, `${label}: ${a} / ${b}`);
const sum = (a) => a.reduce((n, v) => n + v, 0);
for (const c of vectors.cases)
  test("ODD analítico: " + c.id, () => {
    const input = Object.freeze([...c.input]);
    const reference = referenceField(input, c.parameters);
    const production = [...input];
    diffuseEvaporate(production, c.parameters);
    for (let i = 0; i < input.length; i++) {
      close(reference[i], c.expected[i], "referência " + i);
      close(production[i], c.expected[i], "produção " + i);
    }
    assert.deepEqual(input, c.input);
  });
test("ODD: balanço conservativo em grades, ventos e subpassos distintos", () => {
  for (let k = 0; k < 36; k++) {
    const p = {
      width: 1 + (k % 4),
      height: 1 + (Math.floor(k / 4) % 4),
      cellSize: [0.5, 1, 2][k % 3],
      diffusion: [0, 0.03, 0.12][k % 3],
      decay: k % 2 ? 0.06 : 0,
      dt: [0, 0.4, 2.4][Math.floor(k / 3) % 3],
      windX: [-0.2, 0, 0.3][k % 3],
      windZ: [0.15, -0.25, 0][Math.floor(k / 3) % 3],
    };
    const input = Object.freeze(
      Array.from(
        { length: p.width * p.height },
        (_, i) => ((i * 7 + k) % 17) / 17,
      ),
    );
    const reference = referenceField(input, p),
      production = [...input];
    diffuseEvaporate(production, p);
    close(
      sum(reference),
      sum(input) * Math.exp(-p.decay * p.dt),
      "massa referência " + k,
    );
    close(sum(production), sum(reference), "massa produção " + k);
    reference.forEach((v, i) => {
      assert.ok(Number.isFinite(v) && v >= 0);
      close(v, production[i], "célula " + k + ":" + i);
    });
  }
});
test("ODD: fronteira fechada, campo zero e referência executável isolada", () => {
  const p = {
    width: 1,
    height: 1,
    cellSize: 0.5,
    diffusion: 0.5,
    decay: 0,
    dt: 3,
    windX: 2,
    windZ: -2,
  };
  assert.deepEqual(referenceField([4], p), [4]);
  assert.deepEqual(referenceField([0], p), [0]);
  const result = JSON.parse(
    execFileSync(process.execPath, ["scripts/check-odd-reference.ts"], {
      encoding: "utf8",
    }),
  );
  assert.equal(result.referenceOnly, true);
  assert.equal(result.results.length, 7);
  assert.ok(
    result.results.every(
      (v) => v.maxAbsoluteError <= vectors.absoluteTolerance,
    ),
  );
});
test("ODD: referência rejeita domínio inválido sem alterar a entrada", () => {
  const p = {
    width: 1,
    height: 1,
    cellSize: 1,
    diffusion: 0.1,
    decay: 0,
    dt: 1,
  };
  for (const change of [
    { width: 0 },
    { height: 1.5 },
    { cellSize: 0 },
    { dt: -1 },
    { decay: -1 },
    { windX: NaN },
    { diffusion: Infinity },
  ])
    assert.throws(() => referenceField([1], { ...p, ...change }));
  assert.throws(() => referenceField([-1], p));
  assert.throws(() => referenceField([], p));
});
