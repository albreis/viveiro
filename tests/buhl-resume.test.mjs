import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";

test("o CLI de Buhl retoma os grupos completos e rejeita um resultado alterado", (t) => {
  const temp = resolve(tmpdir());
  const root = mkdtempSync(join(temp, "viveiro-buhl-"));
  t.after(() => {
    assert.equal(dirname(root), temp);
    rmSync(root, { recursive: true, force: true });
  });
  const partial = join(root, "partial");
  const complete = join(root, "complete");
  const cli = (output, days, ...flags) =>
    spawnSync(
      process.execPath,
      [
        "scripts/run-buhl.ts",
        "--out",
        output,
        "--days",
        String(days),
        "--groups",
        "2,4",
        "--sample-every",
        "25",
        ...flags,
      ],
      { encoding: "utf-8" },
    );
  const first = cli(partial, 1, "--limit", "1", "--jobs", "2");
  assert.equal(first.status, 0, first.stderr);
  assert.match(first.stdout, /"status":"partial"/);
  assert.equal(existsSync(join(partial, "serie.csv")), false);
  const savedPath = join(partial, "BUHL-1-2.json");
  const saved = readFileSync(savedPath, "utf8");

  const mismatch = cli(partial, 2, "--resume");
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, /existente difere/i);
  const resumed = cli(partial, 1, "--resume", "--jobs", "2");
  assert.equal(resumed.status, 0, resumed.stderr);
  assert.equal(readFileSync(savedPath, "utf8"), saved);

  const fresh = cli(complete, 1);
  assert.equal(fresh.status, 0, fresh.stderr);
  for (const file of ["serie.csv", "comparacao.json"]) {
    assert.deepEqual(
      readFileSync(join(partial, file)),
      readFileSync(join(complete, file)),
    );
  }
  const altered = JSON.parse(saved);
  altered.run.samples[0].removed += 1;
  writeFileSync(savedPath, JSON.stringify(altered));
  const corrupt = cli(partial, 1, "--resume");
  assert.equal(corrupt.status, 1);
  assert.match(corrupt.stderr, /resultado de Buhl inválido/i);
  assert.equal(existsSync(join(partial, ".sweep.lock")), false);
});
