import { test } from "node:test";
import assert from "node:assert/strict";
import { installPortableMath } from "../src/libs/portable-math.ts";
import { modelMath as m, arithmeticPolicy } from "../src/libs/model-math.ts";
const originals = Object.fromEntries(
  Object.getOwnPropertyNames(Math).map((k) => [k, Math[k]]),
);
installPortableMath();
const close = (a, b, t = 1e-14) =>
  assert.ok(Math.abs(a - b) <= t, `${a} versus ${b}`);
test("backend portátil não altera Math global e mantém contrato versionado", () => {
  assert.equal(arithmeticPolicy(), "stdlib-f64-v1");
  installPortableMath();
  for (const [k, v] of Object.entries(originals)) assert.equal(Math[k], v, k);
});
test("funções portáteis atendem valores analíticos, simetrias e limites", () => {
  assert.equal(m.exp(0), 1);
  close(m.exp(1), Math.E);
  assert.equal(m.exp(-1000), 0);
  close(m.expm1(1e-12), 1e-12 + 5e-25, 1e-27);
  assert.equal(m.sin(0), 0);
  assert.equal(m.cos(0), 1);
  assert.equal(m.tan(0), 0);
  close(m.sin(Math.PI / 6), 0.5);
  close(m.cos(Math.PI / 3), 0.5);
  close(m.tan(Math.PI / 4), 1);
  close(m.atan(1), Math.PI / 4);
  close(m.atan2(1, 0), Math.PI / 2);
  assert.ok(Object.is(m.atan2(-0, 1), -0));
  assert.equal(m.log(Math.E), 1);
  assert.equal(m.log(0), -Infinity);
  close(m.log1p(1e-12), 1e-12 - 5e-25, 1e-27);
  assert.equal(m.cbrt(-8), -2);
  assert.equal(m.pow(2, -3), 0.125);
  close(m.pow(9, 0.5), 3);
  assert.equal(m.hypot(3, 4, 12), 13);
  assert.equal(m.hypot(), 0);
  assert.equal(m.hypot(NaN, Infinity), Infinity);
  assert.ok(Number.isNaN(m.hypot(NaN, 1)));
  close(m.hypot(1e308, 1e308) / 1e308, Math.SQRT2);
  close(m.tanh(0), 0);
  assert.equal(m.tanh(Infinity), 1);
});
