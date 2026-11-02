import { dockForTarget } from "../src/modules/onboarding/placement.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialTour,
  tourTransition,
  shouldOfferTour,
  tourOutcome,
} from "../src/modules/onboarding/tour.ts";
import {
  readTourChoice,
  writeTourChoice,
  tourPreferenceKey,
} from "../src/services/tour-preference.ts";
import { ownsSpaceKey } from "../src/app/keyboard.ts";

test("tour só conclui após confirmação real da primeira pessoa", () => {
  const initial = Object.freeze(initialTour());
  let state = tourTransition(initial, { type: "start", firstPerson: false });
  state = tourTransition(state, { type: "next", agentAvailable: true });
  assert.equal(state.step, 1);
  state = tourTransition(state, { type: "next", agentAvailable: true });
  assert.equal(state.step, 2);
  assert.deepEqual(
    tourTransition(state, { type: "next", agentAvailable: true }),
    state,
  );
  assert.equal(tourOutcome(state), "dismissed");
  state = tourTransition(state, { type: "first-person" });
  assert.equal(state.step, 3);
  assert.equal(tourOutcome(state), "completed");
  state = tourTransition(state, { type: "next", agentAvailable: true });
  assert.equal(state.open, false);
  assert.equal(initial.open, false);
});

test("sem formigas o guia não inventa câmera; pular e reabrir reiniciam só o guia", () => {
  let state = tourTransition(initialTour(), {
    type: "start",
    firstPerson: false,
  });
  state = tourTransition(state, { type: "next", agentAvailable: false });
  assert.equal(state.step, 1);
  assert.equal(
    tourTransition(state, { type: "next", agentAvailable: false }).step,
    1,
  );
  const closed = tourTransition(state, { type: "close" });
  assert.equal(closed.open, false);
  assert.equal(tourOutcome(closed), "dismissed");
  assert.deepEqual(tourTransition(closed, { type: "first-person" }), closed);
  assert.equal(
    tourTransition(closed, { type: "start", firstPerson: false }).step,
    0,
  );
  assert.equal(
    tourTransition(closed, { type: "start", firstPerson: true }).step,
    3,
  );
});

test("voltar respeita limites e preserva a confirmação já observada", () => {
  let state = tourTransition(initialTour(), {
    type: "start",
    firstPerson: false,
  });
  assert.equal(tourTransition(state, { type: "back" }).step, 0);
  state = tourTransition(state, { type: "first-person" });
  const back = tourTransition(state, { type: "back" });
  assert.equal(back.step, 2);
  assert.equal(
    tourTransition(back, { type: "next", agentAvailable: true }).step,
    3,
  );
});

test("oferta automática fica restrita à primeira visita sem experimento salvo", () => {
  assert.equal(shouldOfferTour(false, null), true);
  for (const saved of [false, true])
    for (const choice of ["completed", "dismissed"])
      assert.equal(shouldOfferTour(saved, choice), false);
  assert.equal(shouldOfferTour(true, null), false);
});

test("preferência guarda apenas resultado local e tolera bloqueio de armazenamento", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(readTourChoice(storage), null);
  assert.equal(writeTourChoice("dismissed", storage), true);
  assert.equal(readTourChoice(storage), "dismissed");
  assert.deepEqual([...values.keys()], [tourPreferenceKey]);
  values.set(tourPreferenceKey, '{"seed":"not-a-tour-state"}');
  assert.equal(readTourChoice(storage), null);
  const denied = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("denied");
    },
  };
  assert.equal(readTourChoice(denied), null);
  assert.equal(writeTourChoice("completed", denied), false);
});

test("teclado de seleção e edição não aciona a pausa global da simulação", () => {
  for (const tagName of ["SELECT", "INPUT", "TEXTAREA", "BUTTON"])
    assert.equal(ownsSpaceKey({ tagName }), true);
  assert.equal(ownsSpaceKey({ tagName: "DIV", isContentEditable: true }), true);
  assert.equal(ownsSpaceKey({ tagName: "CANVAS" }), false);
  assert.equal(ownsSpaceKey(null), false);
});

test("o cartão do guia deixa controles à direita e no centro do celular descobertos", () => {
  assert.equal(
    dockForTarget(
      { width: 1068, height: 812 },
      { width: 370, height: 340 },
      { left: 700, right: 790, top: 480, bottom: 515 },
    ),
    "bottom-left",
  );
  assert.equal(
    dockForTarget(
      { width: 390, height: 800 },
      { width: 368, height: 300 },
      { left: 200, right: 350, top: 450, bottom: 490 },
    ),
    "top-right",
  );
  assert.equal(
    dockForTarget(
      { width: 390, height: 800 },
      { width: 368, height: 300 },
      { left: 0, right: 390, top: 0, bottom: 800 },
    ),
    null,
  );
});
