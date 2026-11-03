import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readCsv } from "../src/libs/csv-reader.ts";
const read = (p) => readFileSync(p, "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const cli = (script, args) =>
  spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    windowsHide: true,
    timeout: 120000,
  });
mkdirSync(".runtime", { recursive: true });
test("one new policy file runs in the real CLI, is compared with ACO, and replays byte-for-byte", () => {
  const root = mkdtempSync(resolve(".runtime/extensions-cli-")),
    file = join(root, "my-policy.ts"),
    out = join(root, "comparison");
  const source = read("src/extensions/balanced.ts")
    .replace("balanced-local", "one-file-policy")
    .replace(
      "../modules/extensions/types.ts",
      "../../src/modules/extensions/types.ts",
    );
  writeFileSync(file, source);
  const comparison = cli("scripts/compare-policy.ts", [
    "--extension",
    file,
    "--out",
    out,
    "--days",
    "3",
    "--replicates",
    "2",
  ]);
  assert.equal(comparison.status, 0, comparison.stderr);
  const rows = readCsv(read(join(out, "comparacao.csv"))),
    header = rows[0];
  assert.equal(rows.length, 5);
  const parsed = rows
    .slice(1)
    .map((r) => Object.fromEntries(header.map((k, i) => [k, r[i]])));
  assert.equal(parsed[0].seed, parsed[1].seed);
  assert.equal(parsed[2].seed, parsed[3].seed);
  assert.notEqual(parsed[0].seed, parsed[2].seed);
  let custom;
  for (const row of parsed) {
    const csv = read(join(out, row.csv_path)),
      manifest = JSON.parse(
        read(join(out, row.csv_path.replace("dados.csv", "manifesto.json"))),
      );
    assert.equal(sha(csv), row.csv_sha256);
    assert.equal(manifest.csv.sha256, row.csv_sha256);
    if (row.policy === "extension") {
      assert.ok(Number(row.decisions) > 0);
      assert.equal(manifest.plan.extension.id, "one-file-policy");
      assert.equal(
        manifest.plan.extension.sourceSha256,
        sha(source.replaceAll("\r\n", "\n")),
      );
      custom = {
        csv,
        manifest,
        manifestBytes: read(
          join(out, row.csv_path.replace("dados.csv", "manifesto.json")),
        ),
      };
    } else assert.equal(manifest.plan.extension, undefined);
  }
  const planFile = join(root, "plan.json");
  writeFileSync(planFile, JSON.stringify(custom.manifest.plan));
  const repeat = join(root, "repeat");
  const replay = cli("scripts/run-experiment.ts", [
    "--plan",
    planFile,
    "--extension",
    file,
    "--out",
    repeat,
  ]);
  assert.equal(replay.status, 0, replay.stderr);
  assert.equal(read(join(repeat, "dados.csv")), custom.csv);
  assert.equal(read(join(repeat, "manifesto.json")), custom.manifestBytes);
  assert.ok(!custom.manifestBytes.includes(root));
  writeFileSync(file, source + "\n// source changed\n");
  const wrong = join(root, "wrong");
  const rejected = cli("scripts/run-experiment.ts", [
    "--plan",
    planFile,
    "--extension",
    file,
    "--out",
    wrong,
  ]);
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /difere do módulo/);
  assert.equal(existsSync(wrong), false);
});
