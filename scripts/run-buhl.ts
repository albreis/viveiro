import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import metadata from "../package.json" with { type: "json" };
import { BUHL_SOURCE } from "../src/modules/benchmarks/buhl-2005-data.ts";
import {
  runDigging,
  type DiggingRun,
} from "../src/modules/benchmarks/digging-run.ts";
import { compareWithBuhl } from "../src/modules/benchmarks/digging-compare.ts";
import { buhlArgs } from "./lib/buhl-args.ts";
import { DEFAULT_STIGMERGY } from "../src/modules/soil/stigmergy.ts";
import { TICKS_PER_DAY } from "../src/modules/simulation/constants.js";

const usage = `Viveiro · comparação com Buhl et al. (escavação em Messor sancta)
Uso: npm run benchmark:buhl -- --out ./buhl-novo [--days 3] [--seeds 1]
     [--groups 50,100,200] [--sample-every 5]
     [--mode projetos|estigmergia] [--protocol terrario|grupo-fixo]
--mode estigmergia usa a escavação recrutada por feromônio (Buhl).
--protocol grupo-fixo começa só com operárias, sem rainha, dentro do ninho.
Roda grupos preparados de operárias e compara a forma da curva de escavação
e a escala do volume final com os dados publicados. Unidades do modelo não
são convertidas para cm³ nem horas. Modelo exploratório, não calibrado.
Saída: serie.csv e comparacao.json numa pasta nova.
`;

function csv(runs: DiggingRun[]) {
  const head =
    "semente,operarias_iniciais,tick,dia_modelo,volume_removido_u3,operarias,frentes_ativas,nos_do_ninho";
  const rows = runs.flatMap((r) =>
    r.samples.map((s) =>
      [
        '"' + r.seed + '"',
        r.workers,
        s.tick,
        s.tick / TICKS_PER_DAY,
        s.removed,
        s.workers,
        s.activeProjects,
        s.nestNodes,
      ].join(","),
    ),
  );
  return [head, ...rows].join("\r\n") + "\r\n";
}

if (process.argv.slice(2).includes("--help")) process.stdout.write(usage);
else
  try {
    const options = buhlArgs(process.argv.slice(2)),
      output = resolve(options.out);
    if (existsSync(output))
      throw Error("A pasta de saída já existe; escolha outra.");
    if (
      !existsSync(dirname(output)) ||
      !statSync(dirname(output)).isDirectory()
    )
      throw Error("A pasta pai da saída deve existir.");
    const runs: DiggingRun[] = [];
    for (let s = 1; s <= options.seeds; s++)
      for (const workers of options.groups) {
        const seed = "BUHL-" + s;
        process.stderr.write(`Rodando ${seed} com ${workers} operárias...\n`);
        runs.push(
          runDigging({
            seed,
            workers,
            days: options.days,
            sampleEvery: options.sampleEvery,
            setup: {
              mode: options.mode,
              workersOnly: options.protocol === "grupo-fixo",
              insideNest: options.protocol === "grupo-fixo",
            },
          }),
        );
      }
    const comparison = compareWithBuhl(runs);
    mkdirSync(output);
    writeFileSync(resolve(output, "serie.csv"), csv(runs), { flag: "wx" });
    writeFileSync(
      resolve(output, "comparacao.json"),
      JSON.stringify(
        {
          schema: "viveiro-buhl-v1",
          modelVersion: metadata.version,
          source: BUHL_SOURCE,
          options: { ...options, out: undefined },
          stigmergy:
            options.mode === "estigmergia" ? DEFAULT_STIGMERGY : undefined,
          ...comparison,
        },
        null,
        2,
      ) + "\n",
      { flag: "wx" },
    );
    for (const c of comparison.criteria)
      process.stdout.write(
        `${c.passed ? "OK  " : "FALHA"} ${c.id}: modelo ${c.model} | referência ${c.reference}\n`,
      );
    process.stdout.write(
      (comparison.reproduced
        ? "O modelo reproduziu os três padrões nesta configuração."
        : "O modelo não reproduziu todos os padrões nesta configuração.") +
        "\nResultados em " +
        output +
        "\n",
    );
  } catch (error) {
    process.stderr.write(
      (error instanceof Error ? error.message : String(error)) + "\n",
    );
    process.exitCode = 1;
  }
