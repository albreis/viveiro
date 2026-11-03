import type { lessons } from "../modules/lessons/catalog.ts";
import type { MessageKey } from "./catalogs.ts";
import { t } from "./runtime.ts";
/** Copy labels at the presentation boundary; never mutate the lesson recipe. */
export function presentLesson(definition: (typeof lessons)[number]) {
  const text = (field: string) =>
    t(("lessons." + definition.id + "." + field) as MessageKey);
  return {
    ...definition,
    title: text("title"),
    a: text("a"),
    b: text("b"),
    question: text("question"),
    setup: text("setup"),
  };
}
