import { requireExtension } from "./registry.ts";
import type { ExtensionReference, LocalInput, DecisionFrame } from "./types.ts";
import type { RouteOption } from "../navigation/local-route-policy.ts";
/** Copies and freezes the narrow observation boundary. No World or agent reference escapes. */
export function localInput(
  agent: {
    energy: number;
    carrying?: number;
    carryingBrood?: number;
    carryingSoil?: number;
  },
  exits: readonly RouteOption[],
): LocalInput {
  const input = Object.freeze({
    agent: Object.freeze({
      energy: agent.energy,
      hasLoad: !!(agent.carrying || agent.carryingBrood || agent.carryingSoil),
    }),
    exits: Object.freeze(
      exits.map((e) =>
        Object.freeze({
          id: e.id,
          signal: e.signal,
          comfort: e.comfort ?? 1,
          visited: e.visited,
          visits: e.visits ?? 0,
          backtrack: e.backtrack,
          goalVisible: e.goalVisible,
        }),
      ),
    ),
  });
  if (
    input.exits.length > 128 ||
    new Set(input.exits.map((e) => e.id)).size !== input.exits.length ||
    !Number.isFinite(input.agent.energy) ||
    input.exits.some(
      (e) =>
        !Number.isSafeInteger(e.id) ||
        e.id < 0 ||
        [e.signal, e.comfort, e.visits].some((n) => !Number.isFinite(n)),
    )
  )
    throw Error("Observação local inválida.");
  return input;
}
export function extensionChoice(
  reference: ExtensionReference,
  input: LocalInput,
  random: () => number,
): number | null {
  const extension = requireExtension(reference);
  if (!input.exits.length) return null;
  let signals: Readonly<Record<string, number>> = Object.freeze({});
  const frame = (): DecisionFrame => Object.freeze({ input, signals });
  const append = (prefix: string, values: Readonly<Record<string, number>>) => {
    if (
      !values ||
      typeof values !== "object" ||
      Array.isArray(values) ||
      Object.keys(values).length > 32
    )
      throw Error("Sinais locais inválidos.");
    const next = { ...signals };
    for (const [key, value] of Object.entries(values)) {
      if (
        !/^[a-z][a-z0-9_]{0,31}$/.test(key) ||
        ["constructor", "prototype"].includes(key) ||
        !Number.isFinite(value) ||
        Math.abs(value) > 1e6
      )
        throw Error("Sinal local fora do contrato.");
      const name = prefix + "." + key;
      if (Object.hasOwn(next, name)) throw Error("Sinal local duplicado.");
      next[name] = value;
    }
    signals = Object.freeze(next);
  };
  for (const sensor of extension.sensors ?? [])
    append("sensor." + sensor.id, sensor.sample(input));
  for (const model of extension.submodels ?? [])
    append("model." + model.id, model.compute(frame()));
  const weights = extension.policy.weights(frame());
  if (
    !Array.isArray(weights) ||
    weights.length !== input.exits.length ||
    weights.some((w) => !Number.isFinite(w) || w < 0 || w > 1e6)
  )
    throw Error("Pesos de política fora do contrato.");
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw Error("Política sem peso positivo.");
  const u = random();
  if (!Number.isFinite(u) || u < 0 || u >= 1)
    throw Error("RNG deve produzir [0,1).");
  let roll = u * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return input.exits[i].id;
  }
  return input.exits.at(-1)!.id;
}
