import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  measureGautraisDevelopment,
  summarizeDevelopment,
} from "../src/modules/benchmarks/gautrais/development.ts";
import { GAUTRAIS_PROTOCOL_SHA256 } from "../src/modules/benchmarks/gautrais/protocol.ts";
import {
  loadGautraisProtocol,
  readObservedGraph,
  verifyGautraisSource,
} from "./lib/gautrais-source.ts";
import { plainParents } from "./lib/release-files.ts";

try {
  const args = process.argv.slice(2),
    options = new Map<string, string>();
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i],
      value = args[i + 1];
    if (
      !["--source", "--output", "--partition"].includes(flag) ||
      !value ||
      value.startsWith("--") ||
      options.has(flag)
    )
      throw Error(
        "Uso: node scripts/analyze-gautrais.ts --source PASTA-S12 --output PASTA-NOVA [--partition development]",
      );
    options.set(flag, value);
  }
  if (!options.has("--source") || !options.has("--output"))
    throw Error("Informe --source e --output.");
  if ((options.get("--partition") ?? "development") !== "development")
    throw Error(
      "Reserva fechada: primeiro congelar o protocolo preditivo de G3. Somente development disponível.",
    );
  const source = resolve(options.get("--source")!),
    output = resolve(options.get("--output")!);
  plainParents(source);
  plainParents(output);
  if (existsSync(output))
    throw Error(
      "A saída já existe; arquivos imutáveis não serão sobrescritos.",
    );
  const nested = relative(source, output);
  if (
    !nested ||
    (!isAbsolute(nested) && nested !== ".." && !nested.startsWith(".." + sep))
  )
    throw Error("A saída deve ficar fora dos dados brutos.");
  const checkout = fileURLToPath(new URL("..", import.meta.url));
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: checkout,
      encoding: "utf8",
      windowsHide: true,
    }).trim();
  const sourceSha = git("rev-parse", "HEAD");
  if (git("status", "--porcelain", "--untracked-files=normal"))
    throw Error("Faça commit da fonte antes da análise reproduzível.");
  const plan = loadGautraisProtocol(),
    integrity = verifyGautraisSource(source, plan);
  const replicas = measureGautraisDevelopment(plan, (path) =>
    readObservedGraph(source, path),
  );
  const report = {
    schema: "viveiro-gautrais-development-v1",
    protocolSha256: GAUTRAIS_PROTOCOL_SHA256,
    implementation: { sourceSha, node: process.version },
    integrity,
    partition: "development",
    independentEmpiricalValidation: false,
    predictionProtocolFrozen: false,
    priorExposure:
      "All graphs inventoried on 2026-11-04; topology aggregates already known.",
    units: {
      topology: "counts and degree",
      time: "nominal minutes; latency alignment unverified",
      physicalLengthAreaVolume: null,
    },
    groups: summarizeDevelopment(replicas),
    replicas,
    limitations: [
      "Data reuses Buhl 2004 experiments; cross-paper overlap with 2001/2005 unresolved.",
      "No simulation predictions, calibration, MAE or coverage in this preparation stage.",
      "No meshedness until disconnected/multigraph/peripheral conventions are verified.",
      "Final graph and last frame are separate products; not independent observations.",
    ],
  };
  mkdirSync(output, { recursive: true });
  writeFileSync(
    join(output, "development.json"),
    JSON.stringify(report, null, 2) + "\n",
    { flag: "wx" },
  );
  console.log(
    JSON.stringify({
      output,
      replicas: replicas.length,
      series: replicas.filter((r) => r.series).length,
      graphsVerified: integrity.graphsVerified,
      reservedMetricsComputed: false,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
