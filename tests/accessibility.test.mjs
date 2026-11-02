import { test } from "node:test";
import assert from "node:assert/strict";
import { keyboardCamera } from "../src/modules/renderer/keyboard-camera.ts";
import { placement } from "../src/app/accessible-interventions.ts";
import { chartSummary } from "../src/app/chart-summary.ts";
import { ownsSpaceKey } from "../src/app/keyboard.ts";
const position = (x = 0, y = 0, z = 0) => ({
  x,
  y,
  z,
  set(a, b, c) {
    this.x = a;
    this.y = b;
    this.z = c;
  },
});
function camera() {
  return {
    followId: null,
    lookYaw: 0,
    lookPitch: 0,
    camera: { position: position(10, 8, 20) },
    controls: {
      target: position(1, -1, 2),
      minDistance: 9,
      maxDistance: 53,
      minPolarAngle: 0.07,
      maxPolarAngle: 1.9,
      update() {},
    },
    setView() {
      this.reset = true;
    },
  };
}
const radius = (h) =>
  Math.hypot(
    h.camera.position.x - h.controls.target.x,
    h.camera.position.y - h.controls.target.y,
    h.camera.position.z - h.controls.target.z,
  );

test("camera orbit preserves radius and target; zoom and inclination respect existing limits", () => {
  const h = camera(),
    before = radius(h),
    target = structuredClone({ ...h.controls.target, set: undefined });
  assert.equal(keyboardCamera(h, "ArrowLeft"), true);
  assert.ok(Math.abs(radius(h) - before) < 1e-12);
  assert.deepEqual({ ...h.controls.target, set: undefined }, target);
  for (let n = 0; n < 200; n++) {
    keyboardCamera(h, "ArrowDown");
    keyboardCamera(h, "-");
  }
  assert.ok(Math.abs(radius(h) - 53) < 1e-10);
  const cos = (h.camera.position.y - h.controls.target.y) / radius(h);
  assert.ok(Math.abs(Math.acos(cos) - 1.9) < 1e-10);
  for (let n = 0; n < 200; n++) {
    keyboardCamera(h, "ArrowUp");
    keyboardCamera(h, "+");
  }
  assert.ok(Math.abs(radius(h) - 9) < 1e-10);
  assert.ok(
    [h.camera.position.x, h.camera.position.y, h.camera.position.z].every(
      Number.isFinite,
    ),
  );
  assert.equal(keyboardCamera(h, "Tab"), false);
  assert.equal(keyboardCamera(h, " "), false);
  assert.equal(keyboardCamera(h, "Home"), true);
  assert.equal(h.reset, true);
});
test("first person rotates view with bounded pitch without moving the camera or agents", () => {
  const h = camera();
  h.followId = 7;
  const before = { ...h.camera.position };
  for (let n = 0; n < 30; n++) keyboardCamera(h, "ArrowUp");
  keyboardCamera(h, "ArrowRight");
  keyboardCamera(h, "+");
  assert.equal(h.lookPitch, 0.8);
  assert.equal(h.lookYaw, 0.12);
  assert.deepEqual(h.camera.position, before);
  for (let n = 0; n < 30; n++) keyboardCamera(h, "ArrowDown");
  assert.equal(h.lookPitch, -0.8);
  keyboardCamera(h, "Home");
  assert.equal(h.lookYaw, 0);
  assert.equal(h.lookPitch, 0);
});
test("degenerate camera vectors stay finite instead of producing NaN", () => {
  const h = camera();
  h.camera.position.set(1, -1, 2);
  assert.equal(keyboardCamera(h, "ArrowUp"), true);
  assert.deepEqual(
    [h.camera.position.x, h.camera.position.y, h.camera.position.z],
    [1, -1, 2],
  );
});
test("summary, links, dialogs, editable controls and scroll regions own Space instead of pausing the world", () => {
  for (const tagName of [
    "SUMMARY",
    "A",
    "BUTTON",
    "INPUT",
    "TEXTAREA",
    "SELECT",
  ])
    assert.equal(ownsSpaceKey({ tagName }), true);
  assert.equal(
    ownsSpaceKey({ tagName: "DIV", getAttribute: () => "region" }),
    true,
  );
  assert.equal(
    ownsSpaceKey({ tagName: "SPAN", closest: () => ({ tagName: "BUTTON" }) }),
    true,
  );
  assert.equal(ownsSpaceKey({ tagName: "DIV", isContentEditable: true }), true);
  assert.equal(
    ownsSpaceKey({
      tagName: "DIV",
      getAttribute: () => "group",
      closest: () => null,
    }),
    false,
  );
});
test("coordinate input admits only existing mouse tools and finite points inside the real model bounds", () => {
  for (const type of ["food", "plant", "predator", "scent"])
    assert.deepEqual(placement(type, 9.3, -5.8), { type, x: 9.3, z: -5.8 });
  for (const [type, x, z] of [
    ["collapse", 0, 0],
    ["food", Infinity, 0],
    ["food", NaN, 0],
    ["plant", 9.31, 0],
    ["scent", 0, -5.81],
  ])
    assert.throws(() => placement(type, x, z), /limites/);
});
test("text alternative describes only the displayed census interval and leaves the history unchanged", () => {
  const points = [
      { tick: 0, population: 2 },
      { tick: 1000, population: 5 },
      { tick: 2000, population: 8 },
      { tick: 3900, population: 3 },
    ],
    before = JSON.stringify(points);
  const text = chartSummary(points, 4000, "B");
  assert.match(text, /Cenário B: 3 censos/);
  assert.match(text, /mínimo 3, máximo 8/);
  assert.match(text, /sem previsão/);
  assert.equal(JSON.stringify(points), before);
  assert.match(chartSummary([], 50, "A"), /sem censos/);
});
