import { join } from "node:path";
import metadata from "../package.json" with { type: "json" };
import { BUHL_SOURCE } from "../src/modules/benchmarks/buhl-2005-data.ts";
import type { DiggingRun } from "../src/modules/benchmarks/digging-run.ts";
import {
  bySource,
  compareWithBuhl,
} from "../src/modules/benchmarks/digging-compare.ts";
import { buhlArgs } from "./lib/buhl-args.ts";
import { runBuhlJobs, type BuhlResults } from "./lib/buhl-runs.ts";
import { immutableSweepFile } from "./lib/sweep-files.ts";
import { DEFAULT_STIGMERGY } from "../src/modules/soil/stigmergy.ts";
import { TICKS_PER_DAY } from "../src/modules/simulation/constants.js";

const usage = `Viveiro · comparação com Buhl et al. (escavação em Messor sancta)
Uso: npm run benchmark:buhl -- --out ./buhl-novo [--days 3] [--seeds 1]
     [--groups 50,100,200] [--sample-every 5]
     [--mode projetos|estigmergia] [--protocol terrario|grupo-fixo]
     [--ociosas original|cedem]
     [--horas 72 --segundos-por-tick 1] [--paralelo sim]
     [--semente-inicial 1] [--freio-expoente 2] [--freio-c 100]
     [--jobs 3] [--limit 1] [--resume]
Cada grupo concluído é gravado na saída. Retome com --resume e o mesmo
protocolo. --limit N permite rodar só N grupos novos.
--mode estigmergia usa a escavação recrutada por feromônio (Buhl).
--protocol grupo-fixo começa só com operárias, sem rainha, dentro do ninho.
--ociosas cedem faz operárias ociosas darem passagem a quem trabalha.
--horas lê cada tick como --segundos-por-tick segundos reais e roda as horas
pedidas (72 h a 1 s por tick = 259.200 ticks), com idade, doença e comida
congeladas. --paralelo sim usa até três Workers. --jobs ajusta o limite.
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

function writeResults({
  runs,
  total,
  config,
  sourceFingerprint,
  folder,
}: BuhlResults): void {
  if (runs.length < total) {
    process.stdout.write(
      JSON.stringify({ status: "partial", completed: runs.length, total }) +
        "\n",
    );
    return;
  }
  const comparison = compareWithBuhl(runs);
  const sources = {
    frentes: compareWithBuhl(bySource(runs, "frentes")),
    transito: compareWithBuhl(bySource(runs, "transito")),
  };
  immutableSweepFile(
    join(folder, "serie.csv"),
    csv(runs, config.realTime?.secondsPerTick),
  );
  immutableSweepFile(
    join(folder, "comparacao.json"),
    JSON.stringify(
      {
        schema: "viveiro-buhl-v1",
        modelVersion: metadata.version,
        modelSourceFingerprint: sourceFingerprint,
        source: BUHL_SOURCE,
        options: config,
        stigmergy:
          config.mode === "estigmergia"
            ? { ...DEFAULT_STIGMERGY, ...config.brake }
            : undefined,
        ...comparison,
        porOrigem: sources,
      },
      null,
      2,
    ) + "\n",
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
      ? "Esta execução passou os critérios exploratórios do relatório."
      : "Esta execução não passou todos os critérios exploratórios do relatório.") +
      "\nResultados em " +
      folder +
      "\n",
  );
}

async function main() {
  if (process.argv.slice(2).includes("--help")) {
    process.stdout.write(usage);
    return;
  }
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  try {
    const options = buhlArgs(process.argv.slice(2));
    const started = Date.now();
    const report = (
      job: { seed: string; workers: number },
      tick: number,
      total: number,
    ) =>
      process.stderr.write(
        `${job.seed} ${job.workers} operárias: ${Math.round((100 * tick) / total)}% (${Math.round((Date.now() - started) / 60000)} min)\n`,
      );
    await runBuhlJobs(options, controller.signal, report, writeResults);
  } catch (error) {
    process.stderr.write(
      (error instanceof Error ? error.message : String(error)) + "\n",
    );
    process.exitCode = controller.signal.aborted ? 130 : 1;
  } finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
  }
}

await main();
