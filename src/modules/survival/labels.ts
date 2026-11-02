import type { DeathCause } from "./types.ts";
export const deathLabels: Readonly<Record<DeathCause, string>> = Object.freeze({
  age: "idade",
  disease: "doença",
  starvation: "fome",
  combat: "conflito",
  predation: "predação",
  reproduction: "fim do ciclo reprodutivo",
  unknown: "causa não classificada",
});
