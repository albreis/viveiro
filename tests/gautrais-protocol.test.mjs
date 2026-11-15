import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  existsSync,
  readdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  loadGautraisProtocol,
  hashGraphPaths,
  readObservedGraph,
} from "../scripts/lib/gautrais-source.ts";
import {
  developmentReplicas,
  GAUTRAIS_PROTOCOL_SHA256,
} from "../src/modules/benchmarks/gautrais/protocol.ts";
import {
  measureGautraisDevelopment,
  summarizeDevelopment,
} from "../src/modules/benchmarks/gautrais/development.ts";
const plan = loadGautraisProtocol();
const tree = "noeud 1 peripheral 0 0 1\nnoeud 2 front 1 0 1\narc 1 2 1\n";

test("frozen plan is outcome-independent by replica and all frames stay on one side", () => {
  const raw = readFileSync(
    "docs/validacoes/gautrais-2014-plano.json",
    "utf8",
  ).replaceAll("\r\n", "\n");
  assert.equal(
    createHash("sha256").update(raw).digest("hex"),
    GAUTRAIS_PROTOCOL_SHA256,
  );
  const selected = developmentReplicas(plan),
    reserved = plan.groups.flatMap((g) => g.reserved);
  assert.equal(selected.length, 15);
  assert.equal(reserved.length, 13);
  assert.equal(selected.filter((r) => r.series).length, 12);
  assert.ok(
    selected.every(
      (r) => !reserved.includes(r.id) && Number(r.id.slice(-2)) % 2 === 1,
    ),
  );
  for (const mutate of [
    (p) => p.groups[0].reserved.push(p.groups[0].development[0]),
    (p) => p.groups[1].development.reverse(),
    (p) => (p.groups[2].workers = 100),
    (p) => p.measurements.frames.push(216),
    (p) => (p.evaluation.reservedMetricsMayBeComputed = true),
  ]) {
    const copy = structuredClone(plan);
    mutate(copy);
    assert.throws(() => developmentReplicas(copy));
  }
});

test("measurement callback never opens reserved graph metrics or fabricates the missing 50-worker series", () => {
  const calls = [],
    reserved = plan.groups.flatMap((g) => g.reserved);
  const measured = measureGautraisDevelopment(plan, (path) => {
    assert.ok(!reserved.some((id) => path.includes(id)));
    calls.push(path);
    return tree;
  });
  assert.equal(calls.length, 99);
  assert.equal(measured.length, 15);
  assert.ok(
    measured
      .filter((r) => r.workers === 50)
      .every((r) => r.samples.length === 0),
  );
  assert.deepEqual(
    measured
      .find((r) => r.workers === 100)
      .samples.map((s) => s.nominalMinutes),
    [0, 720, 1440, 2160, 2880, 3600, 4320],
  );
  assert.equal(measured[0].final.nodes, 2);
  for (const group of summarizeDevelopment(measured))
    for (const m of group.final) {
      assert.equal(m.sampleSD, 0);
      assert.equal(m.n, group.replicas);
    }
});

test("replica summaries use sample SD and retain missing uncertainty instead of treating frames as replicas", () => {
  const measured = measureGautraisDevelopment(plan, () => tree);
  const two = measured.filter((r) => r.workers === 50).slice(0, 2);
  two[0].final.nodes = 2;
  two[1].final.nodes = 4;
  const summary = summarizeDevelopment(two)[0].final.find(
    (m) => m.metric === "nodes",
  );
  assert.equal(summary.n, 2);
  assert.equal(summary.mean, 3);
  assert.equal(summary.sampleSD, Math.sqrt(2));
  const one = summarizeDevelopment(two.slice(0, 1))[0].final[0];
  assert.equal(one.sampleSD, null);
  const missing = summarizeDevelopment([])[0].final[0];
  assert.equal(missing.mean, null);
  assert.equal(missing.sampleSD, null);
});

test("raw integrity hashes canonical paths and normalized bytes without parsing topology", () => {
  const folder = mkdtempSync(join(tmpdir(), "viveiro-gautrais-hash-"));
  writeFileSync(join(folder, "first.gra"), "unparsed\r\n");
  const expected = createHash("sha256")
    .update("first.gra\0unparsed\n\0")
    .digest("hex");
  assert.equal(hashGraphPaths(folder, ["first.gra"]), expected);
  assert.throws(() => readObservedGraph(folder, "../outside.gra"), /fora/);
  writeFileSync(join(folder, "large.gra"), " ".repeat(128 * 1024 + 1));
  assert.throws(() => readObservedGraph(folder, "large.gra"), /inválido/);
  writeFileSync(join(folder, "first.gra"), "changed");
  assert.notEqual(hashGraphPaths(folder, ["first.gra"]), expected);
});

test("CLI blocks reserved access, duplicate flags and overwrites before touching input", () => {
  const source = mkdtempSync(join(tmpdir(), "viveiro-gautrais-cli-")),
    output = join(source, "out");
  for (const args of [
    ["--source", source, "--output", output, "--partition", "reserved"],
    ["--source", source, "--source", source, "--output", output],
    ["--source", source, "--output", output],
    ["--unknown", "x"],
  ]) {
    assert.throws(() =>
      execFileSync(process.execPath, ["scripts/analyze-gautrais.ts", ...args], {
        stdio: "pipe",
      }),
    );
    assert.equal(existsSync(output), false);
    assert.deepEqual(readdirSync(source), []);
  }
  const protectedFile = join(source, "protected.json");
  writeFileSync(protectedFile, "preserve");
  assert.throws(() =>
    execFileSync(
      process.execPath,
      [
        "scripts/analyze-gautrais.ts",
        "--source",
        source,
        "--output",
        protectedFile,
      ],
      { stdio: "pipe" },
    ),
  );
  assert.equal(readFileSync(protectedFile, "utf8"), "preserve");
});
