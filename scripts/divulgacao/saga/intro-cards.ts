import { C, legend, lineChart, bars, num } from "./charts.ts";
import type { Card, Facts } from "./types.ts";
import { end, series, ref } from "./story-helpers.ts";
export function introCards(f: Facts): Card[] {
  const g = f.groups.find((g) => g.workers === 100)!;
  const fatigueLines = [
    series(g, "control", "Sem fadiga", C.gray),
    series(g, "fatigue", "Só escavação", C.green),
    ref(g),
  ];
  const morphLegend = [
    { name: "Antes", color: C.green },
    { name: "Com morfologia", color: C.purple },
  ];
  return [
    {
      slug: "01-capa",
      theme: "dark",
      section: "A SAGA DA ESCAVAÇÃO",
      title: "Mais detalhe.\nMenos terra.\nO que faltava?",
      lead: "A investigação que mudou o jeito de nossas formigas cavarem.",
      kind: "cover",
      body: '<img class="cover-photo" src="assets/terrario-isometrico.png" alt="Captura real do terrário Viveiro"/><p class="photo-caption">Imagem do próprio simulador.</p>',
      note: "Viveiro · diário de desenvolvimento · novembro de 2026",
    },
    {
      slug: "02-referencia",
      section: "01 / UMA REFERÊNCIA REAL",
      title: "A pergunta era:\nnossas formigas\ncavam parecido?",
      lead: "Usamos como referência as curvas de escavação de Buhl.",
      body:
        '<div class="population-line">50 <span>·</span> 100 <span>·</span> 200 <small>operárias</small></div>' +
        legend(
          f.groups.map((g, i) => ({
            name: g.workers + " operárias",
            color: [C.blue, C.green, C.gold][i],
          })),
        ) +
        lineChart(
          f.groups.map((g, i) => ({
            name: String(g.workers),
            points: g.reference,
            color: [C.blue, C.green, C.gold][i],
          })),
          70,
          440,
        ),
      note: "Referência: Buhl (2001), Fig. 2a. Volumes em cm³, leitura aproximada com incerteza de ±3 cm³. Grupos acompanhados por 72 h.",
    },
    {
      slug: "03-primeira-fadiga",
      section: "02 / O PRIMEIRO FREIO",
      title: "Sem fadiga,\ncavavam demais.",
      lead: "A fadiga de escavação reduziu o excesso e aproximou os grupos de 100 e 200.",
      body:
        '<p class="chart-label">100 operárias · volume de galeria em cm³</p>' +
        legend(fatigueLines) +
        lineChart(fatigueLines, 70, 470) +
        '<p class="takeaway">Com 50, o erro piorou. O primeiro freio ainda não resolvia tudo.</p>',
      note: "Arena, 72 h, médias de cinco seeds. Sem fadiga: 62,67 cm³. Só fadiga de escavação: 36,15 cm³. Curva de Buhl: cerca de 37 cm³.",
    },
    {
      slug: "04-esforco-clima",
      section: "03 / MAIS CUSTOS, NOVAS INCERTEZAS",
      title: "Andar e carregar\ntambém entraram\nna conta.",
      lead: "A versão com fadiga por ações puxou o volume ainda mais para baixo.",
      body:
        '<p class="chart-label">100 operárias · volume em 72 h (cm³)</p>' +
        legend([
          { name: "Só escavação", color: C.green },
          { name: "Ações + escavação", color: C.purple },
        ]) +
        bars(
          [
            {
              label: "Só|escavação",
              values: [
                {
                  value: f.action100.digOnly,
                  color: C.green,
                  name: "Escavação",
                },
              ],
            },
            {
              label: "Ações +|escavação",
              values: [
                { value: f.action100.actions, color: C.purple, name: "Ações" },
              ],
            },
          ],
          42,
          290,
          37,
        ) +
        '<p class="takeaway">Também testamos água, temperatura e fluxo em 48 rodadas de 2 h. Os efeitos dependiam das regras e das condições.</p>',
      note: "Fadiga por ações: três seeds. Linha dourada: Buhl 2001, 37 cm³. A triagem ambiental foi outro lote. Coeficientes ainda sem calibração independente.",
    },
    {
      slug: "05-morfologia",
      section: "04 / O CORPO MUDOU O RESULTADO",
      title: "Corpos mais\ndetalhados.\nVolumes menores.",
      lead: "Porte, contato entre corpos, marcha térmica e carga mudaram juntos.",
      body:
        legend(morphLegend) +
        bars(
          f.groups.map((g) => ({
            label: g.workers + " operárias",
            values: [
              { value: end(g.fatigue), color: C.green, name: "Antes" },
              { value: end(g.morphology), color: C.purple, name: "Morfologia" },
            ],
          })),
          70,
          390,
        ) +
        '<p class="takeaway">Chegamos a restaurar a versão anterior. Depois decidimos manter a morfologia e investigar a restrição.</p>',
      note: "Arena, 72 h, médias de cinco seeds, em cm³. O ensaio mudou vários mecanismos juntos e não isolava qual deles causava a queda.",
    },
    {
      slug: "06-velocidade-carga",
      section: "05 / A HIPÓTESE DA VELOCIDADE",
      title: "Andaram mais\nrápido. A curva\nquase não mudou.",
      lead: "Testamos velocidade, penalidade de carga e a combinação das duas.",
      body:
        '<p class="chart-label">100 operárias · volume em 72 h (cm³)</p>' +
        bars(
          [
            {
              label: "Base",
              values: [
                { name: "Base", value: f.locomotion100.base, color: C.gray },
              ],
            },
            {
              label: "Mais|velocidade",
              values: [
                {
                  name: "Velocidade",
                  value: f.locomotion100.speed,
                  color: C.green,
                },
              ],
            },
            {
              label: "Sem penalidade|de carga",
              values: [
                { name: "Carga", value: f.locomotion100.load, color: C.purple },
              ],
            },
            {
              label: "As duas",
              values: [
                { name: "Ambos", value: f.locomotion100.both, color: C.blue },
              ],
            },
          ],
          42,
          450,
          37,
        ) +
        '<p class="reference-caption">Linha dourada: Buhl, cerca de 37 cm³.</p>',
      note: "60 execuções de 72 h: quatro condições, três tamanhos de grupo e cinco seeds. A velocidade sozinha não explicava a diferença de volume.",
    },
  ];
}
