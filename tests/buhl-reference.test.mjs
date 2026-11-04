import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { compareBuhlReference } from "../scripts/lib/buhl-reference.ts";
import { readCsv } from "../src/libs/csv-reader.ts";

test("rt24b distingue grupo pendente, reprodução exata e primeira divergência", (t) => {
  const parent = resolve(tmpdir());
  const folder = mkdtempSync(join(parent, "viveiro-rt24b-"));
  t.after(() => {
    assert.equal(dirname(folder), parent);
    rmSync(folder, { recursive: true, force: true });
  });
  const put = (name, value) =>
    writeFileSync(join(folder, name), JSON.stringify(value));
  const plan = {
    schema: "viveiro-buhl-plano-v1",
    sourceFingerprint: "a".repeat(64),
    config: {
      days: 3,
      seeds: 1,
      groups: [50, 100, 200],
      sampleEvery: 600,
      mode: "estigmergia",
      protocol: "grupo-fixo",
      idle: "original",
      realTime: { hours: 24, secondsPerTick: 1, ticks: 86400 },
      firstSeed: 1,
      brake: {},
    },
  };
  put("plano.json", plan);
  assert.ok(
    compareBuhlReference(folder).results.every((r) => r.status === "pending"),
  );
  const archive = new URL(
    "../docs/validacoes/anexos-buhl/resultados/rt24b/serie.csv",
    import.meta.url,
  );
  const run = {
    seed: "BUHL-1",
    workers: 50,
    days: 3,
    samples: readCsv(readFileSync(archive, "utf8"))
      .slice(1)
      .filter((row) => row[1] === "50")
      .map((row) => ({
        tick: Number(row[2]),
        removed: Number(row[5]),
        traffic: Number(row[6]),
        workers: Number(row[7]),
        activeProjects: Number(row[8]),
        nestNodes: Number(row[9]),
      })),
  };
  const writeRun = () =>
    put("BUHL-1-50.json", {
      run,
      sha256: createHash("sha256").update(JSON.stringify(run)).digest("hex"),
    });
  writeRun();
  const identical = compareBuhlReference(folder).results[0];
  assert.equal(identical.status, "identical");
  assert.equal(identical.samples, 145);

  run.samples[2].traffic += 0.01;
  run.samples.at(-1).removed += 0.01;
  writeRun();
  const different = compareBuhlReference(folder).results[0];
  assert.equal(different.status, "different");
  assert.equal(different.differentSamples, 2);
  assert.deepEqual(different.firstDifference, {
    tick: 1200,
    fields: ["traffic"],
  });

  put("BUHL-1-50.json", { run, sha256: "corrompido" });
  assert.throws(() => compareBuhlReference(folder), /Registro inválido/);

  plan.config.realTime.secondsPerTick = 2;
  put("plano.json", plan);
  assert.throws(() => compareBuhlReference(folder), /não corresponde/);
});
