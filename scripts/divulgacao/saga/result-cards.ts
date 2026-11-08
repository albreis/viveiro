import { C, legend, lineChart, bars, num } from "./charts.ts";
import type { Card, Facts } from "./types.ts";
import { end, series, ref } from "./story-helpers.ts";
export function resultCards(f: Facts): Card[] {
  const n100 = f.world.find((g) => g.workers === 100)!,
    n200 = f.world.find((g) => g.workers === 200)!;
  const gains = f.accessGains.map((g) => ({
    n: g.workers,
    pct: (g.ratioOfMeans - 1) * 100,
  }));
  return [
    {
      slug: "07-filtro-acesso",
      theme: "dark",
      section: "06 / A REGRA QUE MERECIA UM TESTE",
      title: "O corpo já\nlimitava o acesso.\nHavia outro filtro.",
      lead: "Além da colisão física, a arena ainda reduzia as oportunidades de acesso à frente.",
      body: '<div class="factor">0,35 <span>→</span> 1</div><p class="factor-caption">Retiramos apenas a redução adicional.</p><div class="plain-list"><p>Corpo: mantido.</p><p>Carga e velocidade: mantidas.</p><p>Fadiga de escavação: mantida.</p></div>',
      note: "Hipótese de restrição excessiva. Fator 1 remove o filtro extra, sem garantir que toda formiga consiga cavar. Não aplicamos um multiplicador ao volume.",
    },
    {
      slug: "08-melhor-curva",
      section: "07 / O ENSAIO MAIS PROMISSOR NA ARENA",
      title: "As curvas\nse aproximaram.",
      kind: "results",
      body:
        legend([
          { name: "Morfologia + acesso físico", color: C.green },
          { name: "Buhl 2001 · leitura", color: C.gold, dash: true },
        ]) +
        f.groups
          .map(
            (g, i) =>
              '<div class="mini-result"><p><strong>' +
              g.workers +
              " operárias</strong><span>" +
              num(end(g.access)) +
              " / " +
              num(end(g.reference), 0) +
              " cm³</span></p>" +
              lineChart(
                [series(g, "access", "Acesso", C.green), ref(g)],
                [30, 45, 70][i],
                188,
                true,
                true,
              ) +
              "</div>",
          )
          .join(""),
      note: "Verde: médias de cinco seeds. Dourado: curva lida e faixa de ±3 cm³. Pontos a cada 12 h. Morfologia e fadiga de escavação preservadas, sem reescalar o volume.",
    },
    {
      slug: "09-evidencia-limite",
      theme: "dark",
      section: "08 / UM RESULTADO MELHOR, COM LIMITES",
      title: "A melhora\nfoi medida.",
      body:
        '<div class="big-number">16<span>/18</span></div><p class="big-explanation">pontos médios ficaram dentro da faixa de leitura de ±3 cm³.</p><p class="gain-line">Ganho de volume: ' +
        gains.map((g) => num(g.pct, 1) + "%").join(" · ") +
        '</p><p class="gain-key">50 · 100 · 200 operárias</p><p class="takeaway">Os dois pontos fora da faixa foram do grupo de 200, em 60 e 72 h.</p>',
      note: "Faixa de leitura não é variabilidade biológica. Buhl já orientou escolhas do modelo. Este é um resultado de desenvolvimento, sem validação independente concluída.",
    },
    {
      slug: "10-motor-3d",
      section: "09 / LEVANDO A IDEIA AO VIVEIRO",
      title: "Da arena plana\npara o motor 3D.",
      lead: "O princípio virou acesso por contato, apoio e espaço livre para o corpo.",
      kind: "world",
      body:
        '<img class="world-photo" src="assets/terrario-tuneis.png" alt="Captura real do Viveiro com os túneis visíveis"/><div class="proof-line"><strong>' +
        f.tests +
        "</strong> testes <span>·</span> <strong>" +
        f.worldRuns +
        '</strong> execuções</div><p class="takeaway">Quem saiu para transportar terra deixa de ocupar uma vaga artificial na frente.</p>',
      note: "Integração Narbonne v3 testada no World. O 3D usa tempo e volumes próprios. A fadiga de escavação da arena ainda não foi transferida para esse perfil.",
    },
    {
      slug: "11-novo-gargalo",
      section: "10 / O QUE A INTEGRAÇÃO REVELOU",
      title: "Cavar e entregar\nnão são a\nmesma etapa.",
      lead: "Com 100 e 200, as frentes produziram quase igual. A entrega foi bem diferente.",
      body:
        legend([
          { name: "100 operárias", color: C.gold },
          { name: "200 operárias", color: C.green },
        ]) +
        bars(
          [
            {
              label: "Nas frentes",
              values: [
                { name: "100", value: n100.frontRemoved, color: C.gold },
                { name: "200", value: n200.frontRemoved, color: C.green },
              ],
            },
            {
              label: "Na superfície",
              values: [
                { name: "100", value: n100.deposited, color: C.gold },
                { name: "200", value: n200.deposited, color: C.green },
              ],
            },
          ],
          0.4,
          390,
          undefined,
          3,
        ) +
        '<p class="takeaway">Congestionamento é uma hipótese para investigar. Ainda precisamos medir o tempo bloqueado e controlar a posição inicial.</p>',
      note: "World 3D, duas seeds por grupo, 2.000 ticks. Volumes em unidades do modelo. Estas condições não equivalem às 72 h da arena ou do laboratório.",
    },
    {
      slug: "12-proximos-passos",
      theme: "dark",
      section: "11 / ONDE ESTAMOS AGORA",
      title: "Uma hipótese\nmais promissora.\nNovos testes.",
      lead: "Nosso melhor cenário atual na arena preserva a morfologia e a fadiga de escavação, com o acesso revisto.",
      body: '<div class="next-list"><p><span>01</span> Medir espera e transporte no 3D.</p><p><span>02</span> Controlar acesso e população inicial.</p><p><span>03</span> Avaliar com dados independentes.</p></div><p class="closing">O progresso está no código,<br/>nos dados e nos erros registrados.</p>',
      note: "Viveiro · modelo exploratório em desenvolvimento. Repositório: github.com/albreis/viveiro · Acompanhe os próximos ensaios.",
    },
  ];
}
