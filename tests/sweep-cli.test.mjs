import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
mkdirSync(".runtime", { recursive: true });
const root = () => mkdtempSync(resolve(".runtime/sweep-cli-"));
const cli = (args) =>
  spawnSync(process.execPath, ["scripts/run-sweep.ts", ...args], {
    encoding: "utf8",
    windowsHide: true,
    timeout: 180000,
  });
const run = (args) => {
  const r = cli(args);
  assert.equal(r.status, 0, r.stderr || r.error?.message);
  return r;
};
const hashes = (folder) =>
  readdirSync(folder)
    .filter((n) => /^v\d+-r\d+$/.test(n))
    .map((id) => [
      id,
      ...["dados.csv", "manifesto.json"].map((f) =>
        createHash("sha256")
          .update(readFileSync(join(folder, id, f)))
          .digest("hex"),
      ),
    ]);
test("acceptance: one command executes five values x ten REAL replicas; resume computes only remaining runs", () => {
  const dir = root(),
    full = join(dir, "full"),
    resume = join(dir, "resume");
  run(["--out", full, "--jobs", "2"]);
  assert.equal(hashes(full).length, 50);
  run(["--out", resume, "--jobs", "3", "--limit", "7"]);
  assert.equal(hashes(resume).length, 7);
  const before = hashes(resume),
    mtime = statSync(join(resume, "v001-r001/dados.csv")).mtimeMs;
  run(["--out", resume, "--jobs", "4", "--resume"]);
  assert.deepEqual(hashes(resume).slice(0, 7), before);
  assert.equal(statSync(join(resume, "v001-r001/dados.csv")).mtimeMs, mtime);
  assert.deepEqual(hashes(full), hashes(resume));
  for (const file of ["resumo.csv", "concluido.json", "retomada.json"])
    assert.deepEqual(
      readFileSync(join(full, file)),
      readFileSync(join(resume, file)),
    );
  const id = JSON.parse(readFileSync(join(full, "concluido.json"))).id;
  const imported = join(dir, "imported");
  run([
    "--checkpoint",
    join(resume, "retomada-7.json"),
    "--out",
    imported,
    "--jobs",
    "4",
  ]);
  assert.deepEqual(hashes(full), hashes(imported));
  writeFileSync(
    join(dir, "acceptance.json"),
    JSON.stringify(
      {
        runs: 50,
        oneCommand: true,
        resumedFrom: 7,
        reusedMtime: true,
        parallelCounts: [2, 3, 4],
        importedPortableCheckpoint: true,
        byteEqual: true,
        id,
        full,
        resume,
        imported,
      },
      null,
      2,
    ),
  );
  console.log("sweep-acceptance", join(dir, "acceptance.json"));
});
test("CLI fails safely on missing/duplicate arguments and unrelated existing data", () => {
  const dir = root(),
    out = join(dir, "existing");
  mkdirSync(out);
  writeFileSync(join(out, "sentinel"), "keep");
  for (const args of [
    ["--out", out],
    ["--jobs", "0", "--out", join(dir, "bad")],
    ["--out", join(dir, "bad"), "--resume"],
  ])
    assert.notEqual(cli(args).status, 0);
  assert.equal(readFileSync(join(out, "sentinel"), "utf8"), "keep");
});
