import { readCsv } from "../../src/libs/csv-reader.ts";

const susColumns = Array.from(
  { length: 10 },
  (_, index) => "sus" + String(index + 1).padStart(2, "0"),
);
const columns = ["turma", "participante", "pre", "pos", ...susColumns];

function stats(values: number[]) {
  const n = values.length;
  const mean = n ? values.reduce((sum, value) => sum + value, 0) / n : null;
  const sampleSd =
    n > 1 && mean !== null
      ? Math.sqrt(
          values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1),
        )
      : null;
  return { n, mean, sampleSd };
}

function parseScore(
  value: string,
  min: number,
  max: number,
  row: number,
  field: string,
): number | null {
  if (value === "") return null;
  if (!/^[0-9]$/.test(value) || Number(value) < min || Number(value) > max)
    throw Error("Nota inválida no registro " + row + ", campo " + field + ".");
  return Number(value);
}

/** Descriptive, complete-case SUS and paired pre/post; never emits row data. */
export function summarizePilot(csv: string) {
  const [head, ...rows] = readCsv(csv);
  if (
    head?.length !== columns.length ||
    !columns.every((name, index) => head[index] === name)
  )
    throw Error(
      "Use as colunas do modelo piloto-respostas.csv, na mesma ordem.",
    );

  const cohorts = new Set<string>();
  const seen = new Set<string>();
  const sus: number[] = [];
  const pre: number[] = [];
  const post: number[] = [];
  const delta: number[] = [];
  let preOnly = 0;
  let postOnly = 0;
  let partialSus = 0;

  for (const [index, [cohort, participant, a, b, ...items]] of rows.entries()) {
    const record = index + 1;
    if (!/^T[0-9]{2}$/.test(cohort) || !/^P[0-9]{3,4}$/.test(participant))
      throw Error("Use códigos sem nomes no registro " + record + ".");
    const key = cohort + "/" + participant;
    if (seen.has(key))
      throw Error("Participante repetido no registro " + record + ".");
    cohorts.add(cohort);
    seen.add(key);

    const before = parseScore(a, 0, 6, record, "pre");
    const after = parseScore(b, 0, 6, record, "pos");
    if (before !== null && after !== null) {
      pre.push(before);
      post.push(after);
      delta.push(after - before);
    } else if (before !== null) preOnly++;
    else if (after !== null) postOnly++;

    const scores = items.map((item, i) =>
      parseScore(item, 1, 5, record, susColumns[i]),
    );
    if (scores.every((score) => score !== null)) {
      const total = scores.reduce(
        (sum, score, i) => sum + (i % 2 === 0 ? score - 1 : 5 - score),
        0,
      );
      sus.push(2.5 * total);
    } else if (scores.some((score) => score !== null)) partialSus++;
  }

  return {
    schema: "viveiro-piloto-descritivo-v1",
    participants: seen.size,
    cohorts: cohorts.size,
    sus: {
      ...stats(sus),
      partial: partialSus,
      missing: seen.size - sus.length - partialSus,
    },
    learning: {
      pre: stats(pre),
      post: stats(post),
      gain: stats(delta),
      preOnly,
      postOnly,
      neither: seen.size - delta.length - preOnly - postOnly,
    },
  };
}
