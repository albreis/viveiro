import type { MorrisDesign } from "../../src/modules/sensitivity/design.ts";
import { analyzeMorris } from "../../src/modules/sensitivity/analyze.ts";
import { parameterDetails } from "../../src/modules/experiments/parameters.ts";
import { csvCell } from "../../src/modules/observations/csv.ts";
import { immutableSweepFile } from "./sweep-files.ts";
import { join } from "node:path";
export function writeMorrisOutput(
  folder: string,
  design: MorrisDesign,
  result: ReturnType<typeof analyzeMorris>,
  sourceFingerprint: string,
): void {
  const csv = (rows: (string | number | null)[][]) =>
    "\ufeff" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
  immutableSweepFile(
    join(folder, "indices.csv"),
    csv([
      ["metric", "parameter", "n", "mu", "mu_star", "sigma"],
      ...Object.entries(result.rankings).flatMap(([m, rs]) =>
        rs.map((r) => [m, r.parameter, r.n, r.mu, r.muStar, r.sigma]),
      ),
    ]),
  );
  const metrics = Object.keys(result.responses[0].metrics);
  immutableSweepFile(
    join(folder, "respostas.csv"),
    csv([
      ["id", "trajectory", "point", "replicate", ...metrics],
      ...result.responses.map((r) => [
        r.id,
        r.trajectory,
        r.point,
        r.replicate,
        ...metrics.map((m) => r.metrics[m as keyof typeof r.metrics]),
      ]),
    ]),
  );
  immutableSweepFile(
    join(folder, "entradas.csv"),
    csv([
      ["id", "trajectory", "point", "replicate", "seed", ...design.dimensions],
      ...design.jobs.map((j) => [
        j.id,
        j.trajectory,
        j.point,
        j.replicate,
        j.plan.seed,
        ...design.dimensions.map((k) => j.plan.parameters[k]!),
      ]),
    ]),
  );
  immutableSweepFile(
    join(folder, "resultados.json"),
    JSON.stringify({ ...result, sourceFingerprint }, null, 2) + "\n",
  );
  const rows = result.rankings.population
    .slice(0, 10)
    .map(
      (r, i) =>
        `| ${i + 1} | ${r.parameter} | ${r.muStar?.toFixed(4) ?? "ausente"} | ${r.sigma?.toFixed(4) ?? "ausente"} |`,
    );
  const text = [
    "# Sensibilidade do modelo: Morris",
    "",
    `Versão ${design.modelVersion}; ${design.options.trajectories} trajetórias, ${design.options.replicates} réplicas pareadas, ${design.options.days} dias, ${design.dimensions.length} entradas e ${design.jobs.length} execuções.`,
    "",
    "Ranking por população adulta final (µ*). Efeitos por unidade normalizada da faixa, não por unidade física. Valores maiores dependem do horizonte, perfil e faixas escolhidos. Empates não indicam uma ordem causal distinta.",
    "",
    "| Ordem | Parâmetro | µ* | sigma |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    `Perfil ${design.jobs[0].plan.biologicalProfile.id}@${design.jobs[0].plan.biologicalProfile.version}, ninho estabelecido. A janela de triagem é uma escolha exploratória dentro dos limites do catálogo, não uma faixa de confiança biológica. Todas as entradas e faixas são hipóteses/aproximações do modelo; não incertezas calibradas. Sigma combina não linearidade/interações e ruído residual. Quatro trajetórias não dão precisão de calibração; zeros podem significar mecanismo inativo nesse cenário.`,
    "",
    "Conservamos entradas, respostas de cada réplica, CSVs/manifestos de cada World e índices de todos os parâmetros, inclusive os fora do top 10. Réplicas são promediadas por ponto antes de calcular cada efeito elementar. Dados ausentes permanecem ausentes.",
    "",
    "## Interpretação dos dez primeiros",
    "",
    "O top 10 é uma ordenação de triagem das 12 entradas, não a descoberta de dez efeitos não nulos. Nesta execução, apenas cinco entradas alteraram a população final. Empates em zero são ordenados pelo identificador, sem prioridade científica. P3.2 deve também considerar outras métricas, horizontes e dados reais antes de escolher ajustes.",
    "",
    "## Proveniência das entradas",
    "",
    ...design.dimensions.map(
      (k) =>
        `- ${k}: ${parameterDetails[k].unit}; faixa [${design.bounds[k][0]}, ${design.bounds[k][1]}]; ${parameterDetails[k].kind}; src/modules/${parameterDetails[k].source}.`,
    ),
    "",
    "## Método e reprodução",
    "",
    "EE = (Y_depois − Y_antes)/(x_depois − x_antes), com x normalizado em [0,1]. µ é a média dos efeitos, µ* a média dos módulos e sigma o desvio amostral (n−1). Cada entrada tem quatro efeitos, após promediar as duas réplicas pareadas por ponto.",
    "",
    "Vanilla Morris, grid par, passo p/[2(p-1)], uma entrada por passo. Seeds comuns entre pontos de uma trajetória/réplica; outras trajetórias/réplicas recebem outras seeds. Não há otimização Campolongo ou bootstrap de confiança nesta implementação.",
    "",
    "Referências primárias: [Morris 1991](https://doi.org/10.1080/00401706.1991.10484804), [SALib amostragem](https://salib.readthedocs.io/en/stable/_modules/SALib/sample/morris/morris.html) e [SALib análise](https://salib.readthedocs.io/en/stable/_modules/SALib/analyze/morris.html). A implementação do Viveiro usa seu próprio RNG de desenho; não promete amostras iguais às do NumPy.",
    "",
    "`npm run sensitivity -- --out nova-pasta --jobs 4` reproduz o protocolo padrão. `--resume` verifica os arquivos existentes e a identidade da fonte antes de reutilizá-los. Mesmo modelo, versão, fonte, plano e seeds são necessários.",
    "",
    `Identidade de desenho: ${design.id}. Fonte normalizada: ${sourceFingerprint}.`,
    "",
  ];
  immutableSweepFile(join(folder, "relatorio.md"), text.join("\n"));
}
