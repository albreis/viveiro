import { lessonDefinition, type LessonId } from "./catalog.ts";
export interface LessonReference {
  id: LessonId;
  version: 1;
}
export function lessonReference(value: unknown): LessonReference {
  if (!value || typeof value !== "object")
    throw Error("Referência de aula inválida.");
  const ref = value as Partial<LessonReference>;
  if (ref.version !== 1 || typeof ref.id !== "string")
    throw Error("Versão de experimento de aula não suportada.");
  return { id: lessonDefinition(ref.id).id, version: 1 };
}
