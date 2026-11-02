import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { permittedSourcePath } from "../src/modules/publication/deposit.ts";
mkdirSync(".runtime", { recursive: true });
const dir = () => mkdtempSync(resolve(".runtime/experiment-test-"));
const run = (args) =>
  spawnSync(process.execPath, ["scripts/run-experiment.ts", ...args], {
    encoding: "utf8",
    timeout: 30000,
  });
test("CLI real: flags e plano JSON/BOM produzem os mesmos arquivos sem datas ou caminhos", () => {
  const root = dir(),
    a = join(root, "flags"),
    b = join(root, "plan"),
    planFile = join(root, "input.json");
  const plan = normalizeExperiment({
    schema: "viveiro-experiment-v1",
    seed: "CLI-REAL",
    days: 2,
    startMode: "established",
    biologicalProfile: { schema: 1, id: "generic-demo", version: 1 },
    parameters: { humidity: 68, windX: -0.2 },
  });
  writeFileSync(planFile, "\ufeff" + JSON.stringify(plan));
  const r1 = run([
    "--seed",
    "CLI-REAL",
    "--days",
    "2",
    "--start",
    "established",
    "--profile",
    "generic-demo@1",
    "--humidity",
    "68",
    "--wind-x",
    "-0.2",
    "--out",
    a,
  ]);
  const r2 = run(["--plan", planFile, "--out", b]);
  assert.equal(r1.status, 0, r1.stderr);
  assert.equal(r2.status, 0, r2.stderr);
  for (const name of ["dados.csv", "manifesto.json"])
    assert.deepEqual(readFileSync(join(a, name)), readFileSync(join(b, name)));
  const m = JSON.parse(readFileSync(join(a, "manifesto.json"), "utf8"));
  assert.equal(m.clock.endTick, 200);
  assert.deepEqual(m.plan, plan);
  assert.equal(JSON.stringify(m).includes(root), false);
  assert.equal(m.createdAt, undefined);
  assert.equal(JSON.parse(r1.stdout).csvSha256, m.csv.sha256);
});
test("CLI recusa pasta existente, argumentos inválidos e plano grande sem apagar ou gravar dados", () => {
  const root = dir(),
    existing = join(root, "existing"),
    out = join(root, "new");
  mkdirSync(existing);
  writeFileSync(join(existing, "sentinel.txt"), "preservado");
  assert.notEqual(run(["--out", existing]).status, 0);
  assert.equal(
    readFileSync(join(existing, "sentinel.txt"), "utf8"),
    "preservado",
  );
  for (const args of [
    ["--days", "-1"],
    ["--days", "0.5"],
    ["--days", " "],
    ["--unknown", "1"],
    ["--days", "1", "--days", "2"],
    ["--profile", "unknown@1"],
    ["--temperature", "1000"],
    ["--plan", "x.json", "--days", "2"],
  ]) {
    const r = run([...args, "--out", out]);
    assert.notEqual(r.status, 0, args.join(" "));
    assert.equal(existsSync(out), false);
  }
  const large = join(root, "large.json");
  writeFileSync(large, " ".repeat(17000));
  assert.notEqual(run(["--plan", large, "--out", out]).status, 0);
  assert.equal(existsSync(out), false);
});
test("CLI tem ajuda e inclui só documentos públicos explícitos no depósito", () => {
  const r = run(["--help"]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /--profile/);
  assert.ok(permittedSourcePath("experimentos.html"));
  assert.ok(permittedSourcePath("docs/cli.md"));
  assert.equal(permittedSourcePath("docs/CONTINUAR.md"), false);
});
