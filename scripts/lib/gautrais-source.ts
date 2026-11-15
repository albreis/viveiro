import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { GautraisPlan } from "../../src/modules/benchmarks/gautrais/types.ts";
import {
  developmentReplicas,
  GAUTRAIS_PROTOCOL_SHA256,
} from "../../src/modules/benchmarks/gautrais/protocol.ts";
import { within, plainParents } from "./release-files.ts";

export function loadGautraisProtocol() {
  const text = readFileSync(
    new URL("../../docs/validacoes/gautrais-2014-plano.json", import.meta.url),
    "utf8",
  ).replaceAll("\r\n", "\n");
  if (
    createHash("sha256").update(text).digest("hex") !== GAUTRAIS_PROTOCOL_SHA256
  )
    throw Error("O plano congelado foi alterado; criar uma emenda versionada.");
  const plan = JSON.parse(text) as GautraisPlan;
  developmentReplicas(plan);
  return plan;
}
export function readObservedGraph(root: string, name: string) {
  const file = within(root, join(root, name));
  plainParents(file);
  const stat = lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 128 * 1024)
    throw Error("Arquivo de grafo inválido: " + name);
  return readFileSync(file, "utf8").replaceAll("\r\n", "\n");
}

/** Hashing reserved bytes is an integrity check, not a topology evaluation. */
export function hashGraphPaths(root: string, paths: readonly string[]) {
  const digest = createHash("sha256");
  for (const path of paths)
    digest.update(path + "\0" + readObservedGraph(root, path) + "\0");
  return digest.digest("hex");
}
export function verifyGautraisSource(root: string, plan: GautraisPlan) {
  developmentReplicas(plan);
  const ids = plan.groups
    .flatMap((g) => [...g.development, ...g.reserved])
    .sort();
  const files = (folder: string) => {
    plainParents(join(root, folder));
    return readdirSync(join(root, folder))
      .filter((p) => p.endsWith(".gra"))
      .sort();
  };
  if (
    JSON.stringify(files("Final")) !==
    JSON.stringify(ids.map((id) => id + ".gra"))
  )
    throw Error("Inventário de réplicas finais incompatível.");
  const paths = ids.map((id) => "Final/" + id + ".gra");
  const frames = Array.from(
    { length: 217 },
    (_, i) => "tst" + String(i + 1).padStart(3, "0") + ".gra",
  );
  for (const group of plan.groups) {
    if (!group.series) continue;
    for (const id of [...group.development, ...group.reserved].sort()) {
      const folder = "TimeSequences/" + id.slice(0, 4) + "/" + id;
      if (JSON.stringify(files(folder)) !== JSON.stringify(frames))
        throw Error("Série incompleta ou com quadros extras: " + id);
      paths.push(...frames.map((frame) => folder + "/" + frame));
    }
  }
  const sha256 = hashGraphPaths(root, paths);
  if (sha256 !== plan.graphSetSha256)
    throw Error("O hash dos grafos diverge do inventário publicado.");
  return {
    graphSetSha256: sha256,
    graphsVerified: paths.length,
    reservedBytesReadForIntegrity: true,
    reservedMetricsComputed: false,
  };
}
