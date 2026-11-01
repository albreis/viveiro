import type { BiologicalSource } from "./types.ts";
export const biologicalSources: readonly BiologicalSource[] = Object.freeze([
  {
    id: "viveiro-demo",
    title: "Escolhas demonstrativas do Viveiro",
    license: "Código do projeto; sem aferição biológica",
    accessedAt: "2026-11-01",
  },
  {
    id: "user-ai-notes",
    title: "Propostas recebidas de outra IA",
    license: "Requisitos fornecidos pelo usuário; não são dados experimentais",
    accessedAt: "2026-11-01",
  },
  {
    id: "majidifar-2024",
    title: "Majidifar et al. (2024), Functional Ecology",
    url: "https://doi.org/10.1111/1365-2435.14536",
    license: "Artigo aberto sob CC BY; consultar a fonte para reutilização",
    accessedAt: "2026-11-01",
  },
]);
