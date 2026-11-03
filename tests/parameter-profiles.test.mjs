import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeParameterProfile,
  profileJson,
} from "../src/modules/parameter-profiles/profile.ts";
import {
  checkParameterProfileVersion,
  readParameterProfiles,
  saveParameterProfile,
  parameterProfilesKey,
} from "../src/services/parameter-profile-store.ts";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { parameterRanges } from "../src/modules/experiments/parameters.ts";
import { normalizeSweep } from "../src/modules/sweeps/plan.ts";
import { sweepJobs } from "../src/modules/sweeps/jobs.ts";
import { runExperimentProcess } from "../scripts/lib/experiment-process.ts";
const profile = (extra = {}) =>
  normalizeParameterProfile({
    schema: "viveiro-parameter-profile-v1",
    catalogVersion: 1,
    id: "qa-profile",
    version: 1,
    label: "Perfil QA",
    biologicalProfile: { schema: 1, id: "generic-demo", version: 1 },
    parameters: { humidity: 68, ...extra },
  });
const storage = () => {
  const map = new Map([["unrelated-save", "keep"]]);
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
  };
};
test("profile export/import is canonical and preserves omission of the five optional inputs", () => {
  const p = profile();
  assert.deepEqual(normalizeParameterProfile(JSON.parse(profileJson(p))), p);
  assert.equal(Object.keys(p.parameters).length, 7);
  for (const key of [
    "initialFood",
    "initialRainPulse",
    "photoperiodHours",
    "surfaceDiffusionScale",
    "surfaceEvaporationScale",
  ])
    assert.equal(Object.hasOwn(p.parameters, key), false);
  const expanded = profile({
    photoperiodHours: 14,
    initialFood: 12,
    initialRainPulse: 0.2,
    surfaceDiffusionScale: 1.1,
    surfaceEvaporationScale: 0.8,
  });
  assert.equal(Object.keys(expanded.parameters).length, 12);
  assert.equal(
    Object.keys(
      normalizeExperiment({ schema: "viveiro-experiment-v1" }).parameters,
    ).length,
    7,
  );
});
test("profiles reject unsupported catalogs, invented biology, unknown fields and every out-of-range input", () => {
  const p = profile();
  for (const bad of [
    { ...p, schema: "future" },
    { ...p, catalogVersion: 2 },
    { ...p, id: "../x" },
    { ...p, version: 0 },
    { ...p, label: "\u0000" },
    { ...p, unknown: 1 },
    { ...p, biologicalProfile: { schema: 1, id: "invented", version: 1 } },
  ])
    assert.throws(() => normalizeParameterProfile(bad));
  for (const [key, [min, max]] of Object.entries(parameterRanges)) {
    for (const value of [min - 1, max + 1, NaN, Infinity, "42"])
      assert.throws(() =>
        normalizeParameterProfile({
          ...p,
          parameters: { ...p.parameters, [key]: value },
        }),
      );
  }
});
test("local profile versions are immutable, idempotent and do not touch unrelated saved state", () => {
  const store = storage(),
    p = profile();
  saveParameterProfile(p, store);
  const original = store.getItem(parameterProfilesKey);
  saveParameterProfile(JSON.parse(profileJson(p)), store);
  assert.equal(store.getItem(parameterProfilesKey), original);
  assert.throws(
    () =>
      saveParameterProfile(
        { ...p, parameters: { ...p.parameters, humidity: 80 } },
        store,
      ),
    /Aumente a versão/,
  );
  assert.equal(store.getItem(parameterProfilesKey), original);
  assert.throws(
    () =>
      checkParameterProfileVersion(
        { ...p, parameters: { ...p.parameters, humidity: 80 } },
        store,
      ),
    /Aumente a versão/,
  );
  saveParameterProfile(
    { ...p, version: 2, parameters: { ...p.parameters, humidity: 80 } },
    store,
  );
  assert.equal(readParameterProfiles(store).length, 2);
  assert.equal(store.getItem("unrelated-save"), "keep");
  const loaded = readParameterProfiles(store);
  loaded[0].parameters.humidity = 1;
  assert.equal(readParameterProfiles(store)[0].parameters.humidity, 68);
});
test("corrupt storage and quota failures leave the previous bytes intact", () => {
  const store = storage();
  store.setItem(parameterProfilesKey, "not json");
  const before = new Map(store.map);
  assert.throws(() => saveParameterProfile(profile(), store));
  assert.deepEqual(store.map, before);
  store.setItem(parameterProfilesKey, "[]");
  const good = store.getItem(parameterProfilesKey);
  assert.throws(
    () =>
      saveParameterProfile(profile(), {
        getItem: store.getItem,
        setItem: () => {
          throw Error("quota");
        },
      }),
    /quota/,
  );
  assert.equal(store.getItem(parameterProfilesKey), good);
  const duplicate = profile();
  store.setItem(parameterProfilesKey, JSON.stringify([duplicate, duplicate]));
  assert.throws(() => readParameterProfiles(store), /duplicada/);
});
test("exported/reimported profile reproduces the production Worker CSV and manifest by seed", async () => {
  const p = profile({
    initialFood: 12,
    photoperiodHours: 14,
    initialRainPulse: 0.2,
    surfaceDiffusionScale: 1.1,
    surfaceEvaporationScale: 0.8,
  });
  const base = {
    schema: "viveiro-experiment-v1",
    seed: "PROFILE-44",
    days: 3,
    startMode: "established",
    biologicalProfile: p.biologicalProfile,
    parameters: p.parameters,
  };
  const a = await runExperimentProcess({ ...base, parameterProfile: p });
  const b = await runExperimentProcess({
    ...base,
    parameterProfile: JSON.parse(profileJson(p)),
  });
  assert.deepEqual(a, b);
  assert.deepEqual(JSON.parse(a.manifest).plan.parameterProfile, p);
  const withoutOrigin = await runExperimentProcess(base);
  assert.equal(a.csv, withoutOrigin.csv);
});
test("sweeps preserve the immutable origin profile while recording the actual varied values", async () => {
  const p = profile(),
    plan = normalizeSweep({
      schema: "viveiro-sweep-v1",
      base: {
        schema: "viveiro-experiment-v1",
        seed: "PROFILE-SWEEP",
        days: 1,
        parameterProfile: p,
        parameters: p.parameters,
        biologicalProfile: p.biologicalProfile,
      },
      parameter: "humidity",
      values: [40, 80],
      replicates: 1,
    });
  const jobs = await sweepJobs(plan);
  assert.deepEqual(
    jobs.map((j) => j.plan.parameters.humidity),
    [40, 80],
  );
  assert.ok(
    jobs.every((j) => j.plan.parameterProfile.parameters.humidity === 68),
  );
  const result = await runExperimentProcess(jobs[0].plan),
    manifest = JSON.parse(result.manifest);
  assert.equal(manifest.plan.parameters.humidity, 40);
  assert.equal(manifest.plan.parameterProfile.parameters.humidity, 68);
});
