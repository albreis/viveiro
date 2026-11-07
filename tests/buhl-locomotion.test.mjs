import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { normalizeBuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";
import { BuhlWorkerProfile } from "../src/modules/benchmarks/buhl-arena/worker-profile.ts";
import {
  describeBuhlLab,
  runBuhlLab,
} from "../src/modules/benchmarks/buhl-arena/run.ts";

const archived = JSON.parse(
  readFileSync(
    "docs/validacoes/buhl-narbonne-operarias-comparacao.json",
    "utf8",
  ),
);
const input = {
  ...archived.plans[0],
  durationSeconds: 120,
  sampleEverySeconds: 60,
};
const plan = (walkingSource, soilLoadFactor) =>
  normalizeBuhlLabPlan({
    ...input,
    locomotion: { walkingSource, soilLoadFactor },
  });

test("factorial interventions preserve body shape and separately change walking and load", () => {
  const baseline = new BuhlWorkerProfile(normalizeBuhlLabPlan(input));
  for (const walking of ["profile-temperature", "buhl-observed"]) {
    for (const load of [0.85, 1]) {
      const p = plan(walking, load),
        profile = new BuhlWorkerProfile(p);
      const speed = walking === "buhl-observed" ? 15.05 : 11.022222222222222;
      assert.equal(profile.walkingSpeed(0, true), speed);
      assert.equal(profile.walkingSpeed(1, false), speed);
      assert.equal(profile.walkingSpeed(1, true), speed * load);
      assert.equal(
        profile.walkingSpeed(0.5, true),
        speed * (1 - 0.5 * (1 - load)),
      );
      for (let id = 1; id <= 200; id++)
        assert.deepEqual(
          profile.body(input.seed, id),
          baseline.body(input.seed, id),
        );
      const metadata = describeBuhlLab(p);
      assert.equal(metadata.locomotion.unloadedMmPerSecond, speed);
      assert.equal(metadata.locomotion.loadedGalleryMmPerSecond, speed * load);
      assert.equal(metadata.model, "viveiro-disco-locomocao-v1");
      assert.equal(metadata.calibrated, false);
    }
  }
});

test("observing steps is inert and explicit baseline reproduces the historical trajectory", () => {
  const control = runBuhlLab(input);
  const observed = runBuhlLab({
    ...plan("profile-temperature", 0.85),
    observeActivity: true,
  });
  assert.deepEqual(
    observed.samples.map(({ activity, ...sample }) => sample),
    control.samples,
  );
  assert.deepEqual(observed.workerPhenotypes, control.workerPhenotypes);
  const end = observed.samples.at(-1);
  assert.equal(
    end.distanceMm,
    (end.activity.loadedSteps + end.activity.unloadedSteps) * input.pitchMm,
  );
  assert.equal(end.activity.removedMicrograms, end.dugMicrograms);
});

test("interventions reject hidden coefficients, invalid loads and missing worker profiles", () => {
  const valid = plan("buhl-observed", 0.85);
  for (const bad of [
    null,
    [],
    {},
    { walkingSource: "unknown", soilLoadFactor: 1 },
    { walkingSource: "buhl-observed", soilLoadFactor: 0 },
    { walkingSource: "buhl-observed", soilLoadFactor: NaN },
    { walkingSource: "buhl-observed", soilLoadFactor: 1.1 },
    { ...valid.locomotion, volumeMultiplier: 1.6 },
  ])
    assert.throws(() => normalizeBuhlLabPlan({ ...input, locomotion: bad }));
  const noProfile = { ...valid };
  delete noProfile.workerProfile;
  assert.throws(() => normalizeBuhlLabPlan(noProfile), /exige perfil/);
});
