import { validatePredatorMemory } from "../predators/validation.ts";
import { validateSoilMaterial } from "../soil-material/validation.ts";
import { validateRoomStores } from "../stores/validation.ts";
import { validateChamberChoice } from "../chambers/validation.ts";
import { validateFoundressForaging } from "../semiclaustral/validation.ts";
import { validateSeason } from "../seasons/validation.ts";
import { validateCocoons } from "../development/cocoon.ts";
import { validateBroodDevelopment } from "../development/validation.ts";
import { validateSealBudget } from "../sealing/budget.ts";
import {
  validatePlugMaterials,
  validateSealTask,
} from "../sealing/validation.ts";
import { validateMaternalFounding } from "../maternal/validation.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import type { SessionState, WorldWire } from "./types.ts";
const dangerous = new Set(["__proto__", "prototype", "constructor"]);
export function assertDataTree(value: unknown) {
  let size = 0;
  const walk = (v: unknown, depth: number) => {
    if (++size > 1000000 || depth > 48)
      throw new Error("Arquivo excede os limites de estrutura.");
    if (typeof v === "number" && !Number.isFinite(v))
      throw new Error("Número inválido no experimento.");
    if (
      v === null ||
      typeof v === "string" ||
      typeof v === "boolean" ||
      typeof v === "number" ||
      v === undefined
    )
      return;
    if (typeof v !== "object") throw new Error("Tipo de dado não suportado.");
    if (Array.isArray(v)) {
      if (v.length > 100000) throw new Error("Lista muito extensa.");
      for (const x of v) walk(x, depth + 1);
      return;
    }
    for (const [key, x] of Object.entries(v)) {
      if (dangerous.has(key))
        throw new Error("Chave não permitida no experimento.");
      walk(x, depth + 1);
    }
  };
  walk(value, 0);
}
function validateWorld(value: unknown): asserts value is WorldWire {
  if (!value || typeof value !== "object") throw new Error("Mundo ausente.");
  const w = value as WorldWire;
  if (
    typeof w.seed !== "string" ||
    !w.seed.length ||
    w.seed.length > 128 ||
    !Number.isSafeInteger(w.tick) ||
    w.tick < 0 ||
    !Array.isArray(w.ants)
  )
    throw new Error("Estado do mundo inválido.");
  if (!Array.isArray(w.colonies ?? []))
    throw new Error("Registros de colônia inválidos.");
  validatePredatorMemory(w.predators);
  const colonies = [w, ...(w.colonies || [])];
  if (colonies.length > 4) throw new Error("Quantidade de colônias inválida.");
  let population = 0;
  for (const c of colonies) {
    if (
      !c ||
      !Array.isArray(c.ants) ||
      (c !== w && (c.colonies?.length ?? 0) > 0)
    )
      throw new Error("Registro de colônia inválido.");
    const profile = resolveBiologicalProfile(c.biologicalProfile);
    validateSoilMaterial(
      c,
      profile.materialModel === "relative-demo",
      w.params,
    );
    validateRoomStores(
      c,
      profile.stockModel === "rooms-demo",
      w.nest as import("../navigation/types.ts").NestState | undefined,
    );
    validateChamberChoice(c, profile.chamberModel === "local-demo");
    validateMaternalFounding(c.founding, profile.maternalModel === "pools");
    validateFoundressForaging(
      c.founding,
      profile.foundation === "semiclaustral",
    );
    validatePlugMaterials(c.nest, c.soil);
    validateSealTask(
      c.founding as import("../founding/types.ts").FoundingState | undefined,
      profile.entranceModel === "plug",
      c.nest,
    );
    validateBroodDevelopment(
      c.brood,
      profile.developmentModel === "thermal-demo",
    );
    validateSeason(c, profile.dormancyModel === "obligate-demo");
    validateCocoons(c.brood, profile.cocoon === "present");
    population += c.ants.length;
    for (const a of c.ants)
      if (
        !a ||
        !Number.isSafeInteger(a.id) ||
        !Number.isFinite(a.x) ||
        !Number.isFinite(a.z)
      )
        throw new Error("Agente inválido.");
    const nest = c.nest as
      { nodes?: unknown[]; links?: unknown[][] } | undefined;
    if (
      nest &&
      (!Array.isArray(nest.nodes) ||
        !Array.isArray(nest.links) ||
        nest.nodes.length > 1024 ||
        nest.links.length > 4096)
    )
      throw new Error("Geometria inválida.");
    for (const key of [
      "step",
      "advance",
      "snapshot",
      "random",
      "range",
      "intervene",
      "makeAnt",
      "moveSurface",
      "moveInNest",
    ])
      if (Object.hasOwn(c, key))
        throw new Error("Método não pode ser importado como estado.");
  }
  validateSealBudget(w);
  if (population > 450)
    throw new Error("O experimento excede o limite de agentes.");
}
export function normalizeSession(value: unknown): SessionState {
  assertDataTree(value);
  if (!value || typeof value !== "object") throw new Error("Sessão ausente.");
  const s = value as Partial<SessionState>;
  if (s.version !== 1) throw new Error("Versão de sessão não suportada.");
  validateWorld(s.world);
  if (s.comparison) validateWorld(s.comparison);
  const initial = s.initial ?? { seed: s.world.seed, params: {} };
  if (
    typeof initial.seed !== "string" ||
    !initial.params ||
    typeof initial.params !== "object"
  )
    throw new Error("Configuração inicial inválida.");
  resolveBiologicalProfile(initial.biologicalProfile);
  if (
    !Array.isArray(s.interventions ?? []) ||
    (s.interventions?.length ?? 0) > 20000
  )
    throw new Error("Histórico de intervenções inválido.");
  const replayIndex = s.replayIndex ?? 0;
  if (
    !Number.isInteger(replayIndex) ||
    replayIndex < 0 ||
    replayIndex > (s.interventions?.length ?? 0)
  )
    throw new Error("Posição de replay inválida.");
  return {
    version: 1,
    world: s.world,
    comparison: s.comparison ?? null,
    scenario: s.scenario === "b" && s.comparison ? "b" : "a",
    initial,
    interventions: s.interventions ?? [],
    replaying: !!s.replaying,
    replayIndex,
    running: s.running !== false,
  };
}
