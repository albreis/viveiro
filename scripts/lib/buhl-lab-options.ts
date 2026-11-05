import { parseArgs } from "node:util";
import { readSweepJson } from "./sweep-files.ts";

export function readBuhlLabOptions(program: string) {
  const { values } = parseArgs({
    options: {
      plan: { type: "string" },
      out: { type: "string" },
      jobs: { type: "string" },
      limit: { type: "string" },
      resume: { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  const usage =
    "Uso: node " +
    program +
    " --plan PLANO.json --out PASTA [--jobs 4] [--limit N] [--resume]";
  if (values.help) {
    process.stdout.write(usage + "\n");
    return null;
  }
  if (!values.plan || !values.out) throw Error(usage);
  const concurrency = Number(values.jobs ?? "4");
  const limit = values.limit === undefined ? undefined : Number(values.limit);
  if (
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    concurrency > 8 ||
    (limit !== undefined && (!Number.isInteger(limit) || limit < 1))
  )
    throw Error("Use entre 1 e 8 Workers e um limite positivo.");
  return {
    input: readSweepJson(values.plan),
    options: {
      out: values.out,
      resume: values.resume ?? false,
      concurrency,
      limit,
    },
  };
}
