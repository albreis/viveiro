import {
  exampleExperiment,
  normalizeExperiment,
  type ExperimentPlan,
} from "../experiments/plan.ts";
import type { GalleryEntry, GalleryTopic } from "./types.ts";
type Parameters = Partial<ExperimentPlan["parameters"]>;
function entry(
  id: string,
  topic: GalleryTopic,
  seed: string,
  parameters: Parameters = {},
  profile = { schema: 1 as const, id: "generic-demo", version: 5 },
  startMode: ExperimentPlan["startMode"] = "established",
): GalleryEntry {
  const base = exampleExperiment();
  const plan = normalizeExperiment({
    ...base,
    seed,
    days: 3,
    startMode,
    biologicalProfile: profile,
    parameters: { ...base.parameters, ...parameters },
  });
  Object.freeze(plan.parameters);
  Object.freeze(plan.biologicalProfile);
  Object.freeze(plan);
  return Object.freeze({
    id,
    version: 1,
    topic,
    credit: Object.freeze({
      origin: "team" as const,
      name: "Viveiro contributors",
    }),
    plan,
  });
}
const soil = {
  schema: 1 as const,
  id: "generic-microclimate-demo",
  version: 3,
};
export const gallery: readonly GalleryEntry[] = Object.freeze([
  entry("trilhas-sem-vento", "signals", "GALERIA-TRILHAS-01"),
  entry("trilhas-com-vento", "signals", "GALERIA-TRILHAS-01", { windX: 1.5 }),
  entry(
    "solo-deslizante",
    "soil",
    "GALERIA-SOLO-01",
    { reposeAngle: 15 },
    soil,
  ),
  entry(
    "solo-resistente",
    "soil",
    "GALERIA-SOLO-01",
    { reposeAngle: 55 },
    soil,
  ),
  entry("prole-fria", "development", "GALERIA-PROLE-01", { temperatureC: 18 }),
  entry("prole-quente", "development", "GALERIA-PROLE-01", {
    temperatureC: 28,
  }),
  entry(
    "fundacao-claustral",
    "founding",
    "GALERIA-FUNDACAO-01",
    {},
    { schema: 1, id: "generic-demo", version: 2 },
    "founding",
  ),
  entry(
    "fundacao-semiclaustral",
    "founding",
    "GALERIA-FUNDACAO-01",
    {},
    { schema: 1, id: "generic-semiclaustral-demo", version: 1 },
    "founding",
  ),
  entry("reserva-pequena", "resources", "GALERIA-RESERVA-01", {
    initialFood: 5,
  }),
  entry("reserva-ampla", "resources", "GALERIA-RESERVA-01", {
    initialFood: 25,
  }),
]);
export const galleryKey = (item: GalleryEntry) => item.id + "@" + item.version;
export function galleryEntry(
  selection: string | null,
): GalleryEntry | undefined {
  if (!selection || !/^[a-z][a-z0-9-]{0,63}@[1-9]\d{0,5}$/.test(selection))
    return undefined;
  return gallery.find((item) => galleryKey(item) === selection);
}
/** Return an editable copy; running or editing a recipe cannot alter the catalog. */
export const galleryPlan = (item: GalleryEntry): ExperimentPlan =>
  normalizeExperiment(item.plan);
