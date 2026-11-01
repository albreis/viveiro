import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { chemicalFamily } from "./fixtures/chemical-family.mjs";
import {
  colonyProfile,
  odorDistance,
  prepareSocialChemistry,
  recognizes,
} from "../src/modules/social-chemistry/profile.ts";
import { updateSocialEncounters } from "../src/modules/social-chemistry/encounters.ts";
import { updateTerritory } from "../src/modules/social-chemistry/territory.ts";
import { updateEncounterMotion } from "../src/modules/social-chemistry/contact-motion.ts";
import { updateNutrition } from "../src/modules/colony/nutrition.ts";
import { sampleSupport } from "../src/modules/terrain/field.ts";
test("chemical profiles reproduce by seed, normalize and distinguish a disguised body from ancestry", () => {
  const one = new World("profile-one"),
    two = new World("profile-two"),
    p = colonyProfile(one);
  assert.deepEqual(p, colonyProfile(one));
  assert.ok(Math.abs(p.reduce((s, v) => s + v, 0) - 1) < 1e-12);
  assert.notDeepEqual(p, colonyProfile(two));
  const { w, a, b } = chemicalFamily();
  assert.equal(recognizes(w, a, b), false);
  b.odorMask = { profile: [1, 0, 0, 0], strength: 1, until: w.tick + 10 };
  prepareSocialChemistry(w);
  assert.equal(recognizes(w, a, b), true);
  assert.equal(b.colonyId, 2);
  w.tick += 200;
  for (let i = 0; i < 170; i++) {
    w.tick++;
    prepareSocialChemistry(w);
  }
  assert.equal(b.odorMask, undefined);
  assert.equal(recognizes(w, a, b), false);
});
test("soil blocks a chemical contact even when different agents are nearby", () => {
  const { w, a, b } = chemicalFamily();
  a.y = b.y = -0.5;
  updateSocialEncounters(w);
  assert.equal(w.socialChemistry.contacts, 0);
  assert.equal(a.encounter, undefined);
  assert.equal(b.health, 100);
});
test("a persistent alien contact escalates from posture to damage while a vulnerable worker retreats", () => {
  const { w, a, b } = chemicalFamily();
  b.kind = "queen";
  a.traits.courage = 1;
  for (let i = 0; i < 3; i++) {
    w.tick += 6;
    updateSocialEncounters(w);
  }
  assert.ok(w.socialChemistry.intimidations >= 2);
  assert.ok(w.socialChemistry.attacks >= 1);
  assert.ok(b.health < 100);
  const vulnerable = chemicalFamily();
  vulnerable.a.energy = 20;
  vulnerable.a.traits.courage = 0;
  vulnerable.b.kind = "queen";
  updateSocialEncounters(vulnerable.w);
  assert.equal(vulnerable.w.socialChemistry.retreats, 1);
  const previous = { x: vulnerable.a.x, y: vulnerable.a.y, z: vulnerable.a.z };
  assert.equal(updateEncounterMotion(vulnerable.w, vulnerable.a), true);
  assert.ok(
    Math.hypot(
      vulnerable.a.x - previous.x,
      vulnerable.a.y - previous.y,
      vulnerable.a.z - previous.z,
    ) <=
      vulnerable.a.speed * 0.7 + 0.0003,
  );
  assert.ok(
    Math.abs(sampleSupport(vulnerable.w.nest, vulnerable.a).distance - 0.008) <
      0.02,
  );
});
test("territory diffusion and evaporation conserve the deposited chemical budget", () => {
  const { w, child } = chemicalFamily();
  updateTerritory(w);
  assert.ok(w.socialChemistry.deposited > 0);
  w.ants = [];
  child.ants = [];
  for (let i = 0; i < 200; i++) {
    w.tick++;
    updateTerritory(w);
  }
  const s = w.socialChemistry,
    mass = Object.values(s.territory)
      .flat()
      .reduce((a, b) => a + b, 0);
  assert.ok(s.evaporated > 0);
  assert.ok(Math.abs(s.deposited - s.evaporated - mass) < 1e-9);
  assert.ok(
    Object.values(s.territory)
      .flat()
      .every((v) => v >= 0 && Number.isFinite(v)),
  );
});
test("a matching disguise permits contact feeding without creating food and is rejected after fading", () => {
  const { w, child, a, b } = chemicalFamily();
  a.crop = 0.6;
  b.crop = 0;
  b.odorMask = { profile: [1, 0, 0, 0], strength: 1, until: w.tick + 10 };
  prepareSocialChemistry(w);
  const before = a.crop + b.crop;
  updateNutrition(w);
  assert.ok(b.crop > 0);
  assert.ok(Math.abs(before - a.crop - b.crop) < 1e-10);
  const restored = World.restore(w.snapshot());
  w.step(60);
  restored.step(60);
  assert.deepEqual(restored.snapshot(), w.snapshot());
});
