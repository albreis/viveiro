import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  readdirSync,
  mkdtempSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { analyzeMorris } from "../src/modules/sensitivity/analyze.ts";
const read = (p) => readFileSync(p, "utf8");
const hash = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
test("Morris: 104 archived World runs retain exact CSV hashes, plans and all published statistics", () => {
  const dir = "public/experimentos/morris-042";
  const { sourceFingerprint, ...design } = JSON.parse(
    read(join(dir, "desenho.json")),
  );
  const index = JSON.parse(read(join(dir, "arquivos.json")));
  assert.equal(index.files.length, 208);
  for (const f of index.files)
    assert.equal(hash(join(dir, f.file)), f.sha256, f.file);
  const records = design.jobs.map((job) => {
    const csv = read(join(dir, job.id + ".csv"));
    const manifest = read(join(dir, job.id + ".manifest.json"));
    const m = JSON.parse(manifest);
    assert.deepEqual(m.plan, job.plan);
    assert.equal(m.csv.sha256, createHash("sha256").update(csv).digest("hex"));
    assert.equal(m.modelVersion, design.modelVersion);
    assert.equal(m.clock.endTick, 1000);
    return { id: job.id, result: { csv, manifest } };
  });
  assert.deepEqual(
    JSON.parse(
      JSON.stringify({ ...analyzeMorris(design, records), sourceFingerprint }),
    ),
    JSON.parse(read(join(dir, "resultados.json"))),
  );
});
test("Morris CLI: real model, resume without replacement, refuse damaged results", () => {
  const root = mkdtempSync(resolve(".runtime/morris-cli-")),
    out = join(root, "run");
  const args = [
    "--out",
    out,
    "--days",
    "1",
    "--trajectories",
    "2",
    "--replicates",
    "1",
    "--jobs",
    "2",
  ];
  const run = (extra) =>
    spawnSync(
      process.execPath,
      ["scripts/run-sensitivity.ts", ...args, ...extra],
      { encoding: "utf8", windowsHide: true, timeout: 180000 },
    );
  let r = run([]);
  assert.equal(r.status, 0, r.stderr);
  const files = readdirSync(out).sort();
  assert.equal(
    files.filter((f) => /^t\d+-p\d+-r\d+\.json$/.test(f)).length,
    26,
  );
  const hashes = files.map((f) => [
    f,
    hash(join(out, f)),
    statSync(join(out, f)).mtimeMs,
  ]);
  r = run(["--resume"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(
    files.map((f) => [f, hash(join(out, f)), statSync(join(out, f)).mtimeMs]),
    hashes,
  );
  const record = join(out, "t001-p000-r001.json");
  writeFileSync(
    record,
    read(record).replace("populacao_adulta_ind", "invalid_column"),
  );
  const damaged = hash(record);
  r = run(["--resume"]);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /hash inválido/);
  assert.equal(hash(record), damaged);
});
