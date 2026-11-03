import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import {
  finalMetrics,
  morrisMetrics,
} from "../src/modules/sensitivity/metrics.ts";
import { runExperimentProcess } from "./lib/experiment-process.ts";
import { prepareExtensionPlan } from "./lib/extension-module.ts";
import { sha256 } from "../src/modules/sweeps/jobs.ts";
import { csvCell } from "../src/modules/observations/csv.ts";
try {
  const args = process.argv.slice(2),
    options: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const k = args[i],
      v = args[i + 1];
    if (
      !["--extension", "--out", "--seed", "--days", "--replicates"].includes(
        k,
      ) ||
      !v ||
      Object.hasOwn(options, k)
    )
      throw Error("Argumento inválido/repetido: " + k);
    options[k] = v;
  }
  if (!options["--extension"] || !options["--out"])
    throw Error(
      "Uso: npm run compare:policy -- --extension src/extensions/balanced.ts --out nova-pasta [--days 5 --replicates 4 --seed POLICY-43]",
    );
  const replicates = Number(options["--replicates"] ?? 4),
    days = Number(options["--days"] ?? 5),
    seed = options["--seed"] ?? "POLICY-43";
  if (
    !Number.isInteger(replicates) ||
    replicates < 1 ||
    replicates > 20 ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 30
  )
    throw Error("Use 1–20 réplicas e 1–30 dias.");
  const folder = resolve(options["--out"]);
  if (existsSync(folder) || !existsSync(dirname(folder)))
    throw Error("Escolha uma pasta nova com pai existente.");
  const baseline = normalizeExperiment({
    schema: "viveiro-experiment-v1",
    seed,
    days,
    startMode: "established",
    biologicalProfile: { schema: 1, id: "generic-demo", version: 1 },
  });
  const custom = await prepareExtensionPlan(baseline, options["--extension"]);
  mkdirSync(folder);
  const rows: (string | number | null)[][] = [
    [
      "replicate",
      "policy",
      "seed",
      "decisions",
      "csv_path",
      ...Object.keys(morrisMetrics),
      "csv_sha256",
    ],
  ];
  for (let r = 1; r <= replicates; r++) {
    const runSeed =
      "POLICY-" + (await sha256(JSON.stringify(["policy-pair-v1", seed, r])));
    for (const [label, base, module] of [
      ["aco", baseline, undefined],
      ["extension", custom, resolve(options["--extension"])],
    ] as const) {
      const plan = normalizeExperiment({ ...base, seed: runSeed });
      const result = await runExperimentProcess(plan, {
        extensionModule: module,
      });
      const manifest = JSON.parse(result.manifest),
        stem = `r${String(r).padStart(3, "0")}-${label}`;
      mkdirSync(join(folder, stem));
      writeFileSync(join(folder, stem, "dados.csv"), result.csv, {
        flag: "wx",
      });
      writeFileSync(join(folder, stem, "manifesto.json"), result.manifest, {
        flag: "wx",
      });
      const metrics = finalMetrics(result.csv);
      rows.push([
        r,
        label,
        runSeed,
        manifest.extensionDiagnostics?.decisions ?? null,
        stem + "/dados.csv",
        ...Object.values(metrics),
        manifest.csv.sha256,
      ]);
      process.stdout.write(
        JSON.stringify({
          replicate: r,
          policy: label,
          decisions: manifest.extensionDiagnostics?.decisions ?? null,
        }) + "\n",
      );
    }
  }
  writeFileSync(
    join(folder, "comparacao.csv"),
    "\ufeff" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n",
    { flag: "wx" },
  );
  writeFileSync(
    join(folder, "protocolo.json"),
    JSON.stringify(
      {
        schema: "viveiro-policy-comparison-v1",
        calibrated: false,
        seed,
        replicates,
        days,
        baseline,
        custom,
        limitations: [
          "Paired model experiment; no claim of better biological accuracy.",
          "A local developer extension is trusted code, not a sandbox.",
        ],
      },
      null,
      2,
    ) + "\n",
    { flag: "wx" },
  );
} catch (e) {
  process.stderr.write((e instanceof Error ? e.message : String(e)) + "\n");
  process.exitCode = 1;
}
