import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { Worker } from "node:worker_threads";
import { dirname, resolve } from "node:path";
import metadata from "../package.json" with { type: "json" };
import { BUHL_SOURCE } from "../src/modules/benchmarks/buhl-2005-data.ts";
import {
  runDigging,
  type DiggingRun,
} from "../src/modules/benchmarks/digging-run.ts";
import {
  bySource,
  compareWithBuhl,
} from "../src/modules/benchmarks/digging-compare.ts";
import { buhlArgs } from "./lib/buhl-args.ts";
import { DEFAULT_STIGMERGY } from "../src/modules/soil/stigmergy.ts";
import { TICKS_PER_DAY } from "../src/modules/simulation/constants.js";

const usage = `Viveiro · comparação com Buhl et al. (escavação em Messor sancta)
Uso: npm run benchmark:buhl -- --out ./buhl-novo [--days 3] [--seeds 1]
     [--groups 50,100,200] [--sample-every 5]
     [--mode projetos|estigmergia] [--protocol terrario|grupo-fixo]
     [--ociosas original|cedem]
     [--horas 72 --segundos-por-tick 1] [--paralelo sim]
     [--semente-inicial 1] [--freio-expoente 2] [--freio-c 100]
--mode estigmergia usa a escavação recrutada por feromônio (Buhl).
--protocol grupo-fixo começa só com operárias, sem rainha, dentro do ninho.
--ociosas cedem faz operárias ociosas darem passagem a quem trabalha.
--horas lê cada tick como --segundos-por-tick segundos reais e roda as horas
pedidas (72 h a 1 s por tick = 259.200 ticks), com idade, doença e comida
congeladas. --paralelo sim roda cada grupo numa thread.
--semente-inicial escolhe a primeira semente (BUHL-N), para separar sementes
de ajuste e de teste. --freio-expoente e --freio-c mudam o freio por
densidade do modo por feromônio (padrão 2 e 100).
Roda grupos preparados de operárias e compara a forma da curva de escavação
e a escala do volume final com os dados publicados. Unidades do modelo não
são convertidas para cm³ nem horas. Modelo exploratório, não calibrado.
Saída: serie.csv e comparacao.json numa pasta nova.
`;

function csv(runs: DiggingRun[], secondsPerTick?: number) {
  const head =
    "semente,operarias_iniciais,tick,dia_modelo,horas_reais,volume_removido_u3,volume_transito_u3,operarias,frentes_ativas,nos_do_ninho";
  const rows = runs.flatMap((r) =>
    r.samples.map((s) =>
      [
        '"' + r.seed + '"',
        r.workers,
        s.tick,
        s.tick / TICKS_PER_DAY,
        secondsPerTick === undefined ? "" : (s.tick * secondsPerTick) / 3600,
        s.removed,
        s.traffic,
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
    const jobs = [];
    for (let s = options.firstSeed; s < options.firstSeed + options.seeds; s++)
      for (const workers of options.groups)
        jobs.push({
          seed: "BUHL-" + s,
          workers,
          days: options.days,
          ticks: options.realTime?.ticks,
          sampleEvery: options.sampleEvery,
          setup: {
            mode: options.mode,
            workersOnly: options.protocol === "grupo-fixo",
            insideNest: options.protocol === "grupo-fixo",
            idleYield: options.idle === "cedem",
            freezeDaily: !!options.realTime,
            noPredators: !!options.realTime,
            stigmergy: options.brake,
          },
        });
    const started = Date.now();
    const report = (job: (typeof jobs)[number], tick: number, total: number) =>
      process.stderr.write(
        `${job.seed} ${job.workers} operárias: ${Math.round((100 * tick) / total)}% (${Math.round((Date.now() - started) / 60000)} min)\n`,
      );
    const runOne = (job: (typeof jobs)[number]) =>
      new Promise<DiggingRun>((done, fail) => {
        const worker = new Worker(
          new URL("./lib/buhl-worker.ts", import.meta.url),
          { workerData: job },
        );
        worker.on("message", (m) =>
          m.type === "progress" ? report(job, m.tick, m.total) : done(m.run),
        );
        worker.on("error", fail);
      });
    const runs: DiggingRun[] = [];
    if (options.parallel) runs.push(...(await Promise.all(jobs.map(runOne))));
    else
      for (const job of jobs) {
        process.stderr.write(
          `Rodando ${job.seed} com ${job.workers} operárias...\n`,
        );
        runs.push(
          runDigging({
            ...job,
            onProgress: (tick, total) => report(job, tick, total),
            progressEvery: Math.max(1000, Math.round((job.ticks ?? 0) / 20)),
          }),
        );
      }
    const comparison = compareWithBuhl(runs);
    const sources = {
      frentes: compareWithBuhl(bySource(runs, "frentes")),
      transito: compareWithBuhl(bySource(runs, "transito")),
    };
    mkdirSync(output);
    writeFileSync(
      resolve(output, "serie.csv"),
      csv(runs, options.realTime?.secondsPerTick),
      { flag: "wx" },
    );
    writeFileSync(
      resolve(output, "comparacao.json"),
      JSON.stringify(
        {
          schema: "viveiro-buhl-v1",
          modelVersion: metadata.version,
          source: BUHL_SOURCE,
          options: { ...options, out: undefined },
          stigmergy:
            options.mode === "estigmergia"
              ? { ...DEFAULT_STIGMERGY, ...options.brake }
              : undefined,
          ...comparison,
          porOrigem: sources,
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
    for (const [name, c] of Object.entries(sources))
      process.stdout.write(
        `Só ${name === "frentes" ? "frentes" : "trânsito"}: volume ${c.groups
          .map((g) => g.workers + "=" + g.meanFinal.toFixed(2))
          .join(" ")} | ` +
          c.criteria
            .map((k) => (k.passed ? "OK " : "FALHA ") + k.id + " " + k.model)
            .join(" | ") +
          "\n",
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
