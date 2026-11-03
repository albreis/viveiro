import type { ExtensionReference } from "./types.ts";
import { extensionReference, requireExtension } from "./registry.ts";
interface ExtensionWorld {
  decisionExtension?: ExtensionReference;
  extensionDecisions?: number;
}
export function attachExtension(world: ExtensionWorld, value: unknown): void {
  const reference = extensionReference(value);
  requireExtension(reference);
  world.decisionExtension = reference;
  world.extensionDecisions = 0;
}
export function validateExtensionState(world: ExtensionWorld): void {
  if (
    world.decisionExtension === undefined &&
    world.extensionDecisions === undefined
  )
    return;
  requireExtension(world.decisionExtension);
  if (
    !Number.isSafeInteger(world.extensionDecisions) ||
    world.extensionDecisions! < 0
  )
    throw Error("Contagem de decisões de extensão inválida.");
}
