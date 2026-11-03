import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { registerExtension } from "../../src/modules/extensions/registry.ts";
import {
  normalizeExperiment,
  type ExperimentPlan,
} from "../../src/modules/experiments/plan.ts";
const digest = (path: string) =>
  createHash("sha256")
    .update(readFileSync(path, "utf8").replaceAll("\r\n", "\n"))
    .digest("hex");
/** Explicit developer code, not a security sandbox. Never used to load URLs or a JSON-supplied path. */
export async function loadTrustedExtension(file: string) {
  const path = resolve(file);
  if (
    !/\.(ts|js|mjs)$/.test(path) ||
    !statSync(path).isFile() ||
    statSync(path).size > 65536
  )
    throw Error("Extensão local deve ser um módulo de até 64KiB.");
  const sourceSha256 = digest(path),
    extension = (
      await import(pathToFileURL(path).href + "?sha=" + sourceSha256)
    ).default;
  if (digest(path) !== sourceSha256)
    throw Error("Fonte da extensão mudou durante a importação.");
  return registerExtension(extension, {
    schema: 1,
    id: extension?.id,
    version: extension?.version,
    sourceSha256,
  });
}
export async function prepareExtensionPlan(
  plan: ExperimentPlan,
  file?: string,
) {
  if (!file) return plan;
  const extension = await loadTrustedExtension(file);
  if (
    plan.extension &&
    JSON.stringify(plan.extension) !== JSON.stringify(extension)
  )
    throw Error("Extensão do plano difere do módulo fornecido.");
  return normalizeExperiment({ ...plan, extension });
}
