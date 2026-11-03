import balanced from "../../extensions/balanced.ts";
import type { DecisionExtension, ExtensionReference } from "./types.ts";
export const extensionId = (id: unknown): id is string =>
  typeof id === "string" && /^[a-z][a-z0-9-]{0,47}$/.test(id);
export function extensionReference(value: unknown): ExtensionReference {
  const r = value as Partial<ExtensionReference> | null;
  if (
    !r ||
    r.schema !== 1 ||
    !extensionId(r.id) ||
    !Number.isSafeInteger(r.version) ||
    r.version! < 1 ||
    typeof r.sourceSha256 !== "string" ||
    !/^[a-f0-9]{64}$/.test(r.sourceSha256) ||
    Object.keys(r).some(
      (k) => !["schema", "id", "version", "sourceSha256"].includes(k),
    )
  )
    throw Error("Referência de extensão inválida.");
  return {
    schema: 1,
    id: r.id,
    version: r.version!,
    sourceSha256: r.sourceSha256,
  };
}
const installed = new Map<
  string,
  { reference: ExtensionReference; extension: DecisionExtension }
>();
export function registerExtension(
  extension: DecisionExtension,
  value: unknown,
): ExtensionReference {
  const ref = extensionReference(value),
    key = ref.id + "@" + ref.version;
  if (
    !extension ||
    extension.id !== ref.id ||
    extension.version !== ref.version ||
    !extension.policy ||
    !extensionId(extension.policy.id) ||
    typeof extension.policy.weights !== "function"
  )
    throw Error("Contrato de política inválido.");
  for (const [systems, method] of [
    [extension.sensors ?? [], "sample"],
    [extension.submodels ?? [], "compute"],
  ] as const) {
    const ids = new Set<string>();
    if (!Array.isArray(systems) || systems.length > 16)
      throw Error("Limite de sistemas locais excedido.");
    for (const s of systems) {
      if (
        !s ||
        !extensionId(s.id) ||
        ids.has(s.id) ||
        typeof (s as unknown as Record<string, unknown>)[method] !== "function"
      )
        throw Error("Sistema local inválido ou duplicado.");
      ids.add(s.id);
    }
  }
  const prior = installed.get(key);
  if (prior && prior.reference.sourceSha256 !== ref.sourceSha256)
    throw Error("Mesma versão de extensão com fonte diferente.");
  if (!prior)
    installed.set(key, {
      reference: Object.freeze(ref),
      extension: Object.freeze({
        ...extension,
        sensors: Object.freeze(
          (extension.sensors ?? []).map((s) => Object.freeze({ ...s })),
        ),
        submodels: Object.freeze(
          (extension.submodels ?? []).map((s) => Object.freeze({ ...s })),
        ),
        policy: Object.freeze({ ...extension.policy }),
      }),
    });
  return { ...ref };
}
export function requireExtension(value: unknown): DecisionExtension {
  const ref = extensionReference(value),
    found = installed.get(ref.id + "@" + ref.version);
  if (!found || found.reference.sourceSha256 !== ref.sourceSha256)
    throw Error(
      "Extensão não instalada ou hash diferente: " + ref.id + "@" + ref.version,
    );
  return found.extension;
}

export const balancedReference = registerExtension(balanced, {
  schema: 1,
  id: balanced.id,
  version: balanced.version,
  sourceSha256:
    "0c9251693facfcc84844186a8a2f5a9d9942bcf89eb32ae53935407a962ec3fd",
});
