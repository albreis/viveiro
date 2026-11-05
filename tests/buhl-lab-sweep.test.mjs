import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

test("o lote retoma a rodada ausente e rejeita arquivo alterado", (t) => {
  const root = mkdtempSync(join(tmpdir(), "viveiro-arena-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const plan = join(root, "plano.json");
  const out = join(root, "lote");
  writeFileSync(
    plan,
    JSON.stringify({
      groups: [50, 100],
      seeds: ["RETOMADA-1"],
      settings: {
        separationMm: 5,
        dryDensityMgPerMm3: 1.5,
        durationSeconds: 60,
      },
    }),
  );
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [
        "scripts/sweep-buhl-arena.ts",
        "--plan",
        plan,
        "--out",
        out,
        "--jobs",
        "2",
        ...args,
      ],
      { encoding: "utf8", timeout: 20_000 },
    );
  const first = run("--limit", "1");
  assert.equal(first.status, 0, first.stderr);
  assert.deepEqual(JSON.parse(first.stdout), { completed: 1, total: 2 });
  const record = join(out, "rodada-001.json");
  const before = readFileSync(record, "utf8");
  const rest = run("--resume");
  assert.equal(rest.status, 0, rest.stderr);
  assert.deepEqual(JSON.parse(rest.stdout), { completed: 2, total: 2 });
  assert.equal(readFileSync(record, "utf8"), before);
  const output = JSON.parse(readFileSync(join(out, "series.json"), "utf8"));
  assert.deepEqual(
    output.runs.map((entry) => entry.workers),
    [50, 100],
  );
  assert.equal(output.runs[0].samples.at(-1).timeSeconds, 60);
  const damaged = JSON.parse(before);
  damaged.run.samples[0].voidVolumeCm3 = 2;
  writeFileSync(record, JSON.stringify(damaged));
  const corrupted = run("--resume");
  assert.equal(corrupted.status, 1);
  assert.match(corrupted.stderr, /Registro da arena inválido/);
});
