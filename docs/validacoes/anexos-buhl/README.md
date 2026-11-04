# Anexos da comparação com Buhl

Este pasta guarda o material bruto das investigações que aparecem em
`../relatorio-continuidade-buhl.md`. Nada aqui é usado pelo simulador nem
pelos testes.

## `resultados/`

Cada pasta contém a saída do `run-buhl.ts` (`comparacao.json` e `serie.csv`) e,
quando ela existe, o texto impresso no terminal (`saida.log`). Todas usam o
protocolo `grupo-fixo`, exceto as rodadas de linha de base, que usam terrário.

| Pasta | Modo | Rodada | Volume 50 / 100 / 200 (u³) | Escala |
| --- | --- | --- | --- | --- |
| `runA` | projetos, terrário | 3 dias, BUHL-1 | 0 / 0 / 0 | — |
| `run30` | projetos, terrário | 30 dias, BUHL-1 | 0,27 / 0,33 / 0,46 | 0,39 |
| `run60` | projetos, terrário | 60 dias, BUHL-1 | 0,59 / 1,51 / 6,69 | 1,75 |
| `stig20` | feromônio v1, primeiro ajuste | 20 dias, 3 sementes | 0,25 / 0,38 / 1,36 | 1,21 |
| `m-est20` | feromônio v1, frentes e trânsito medidos separadamente | 20 dias, 5 sementes | 0,98 / 1,10 / 1,71 | 0,40 |
| `m-est3` | feromônio v1, idem | 3 dias, 5 sementes | 0,12 / 0,26 / 1,01 | 1,51 |
| `m-proj20` | projetos, idem | 20 dias, 5 sementes | 0,42 / 0,30 / 1,40 | 0,87 |
| `y-estigmergia`, `y-projetos` | contraprova: carregadoras ignoram ociosas (`CF_YIELD=1`) | 20 dias, 5 sementes | 0,82 / 1,26 / 1,88 e 0,33 / 0,43 / 1,69 | 0,60 e 1,17 |
| `z-y2-est`, `z-y2-proj` | contraprova: quem trabalha com solo ignora ociosas (`CF_YIELD=2`) | 20 dias, 5 sementes | 1,01 / 1,62 / 2,34 e 0,47 / 0,62 / 1,61 | 0,60 e 0,89 |
| `z-y2nw-est`, `z-y2nw-proj` | idem, e ociosas não alargam túneis (`CF_YIELD=2 CF_NOWIDEN=1`) | 20 dias, 5 sementes | 1,01 / 1,52 / 1,67 e 0,47 / 0,52 / 0,50 | 0,36 e 0,05 |
| `r-estigmergia`, `r-projetos` | primeira versão da regra realista `--ociosas cedem` | 20 dias, 5 sementes | 1,03 / 1,27 / 0,96 e 0,36 / 0,30 / 0,21 | −0,05 e −0,39 |
| `q-rest` | `--ociosas cedem`, versão final (com passagem pelas ociosas em descanso) | 20 dias, 5 sementes | 1,08 / 1,36 / 0,87 | −0,16 |
| `q-all` | contraprova: quem trabalha atravessa qualquer ociosa | 20 dias, 5 sementes | 1,18 / 1,38 / 1,23 | 0,03 |
| `v2-20d` | feromônio v2 | 20 dias, 5 sementes | 1,74 / 3,37 / 4,65 | 0,71 |
| `rt24-fome` | v2, tempo real, energia ainda não mantida | 24 h, BUHL-1 | 6,97 / 11,79 / 13,37 | 0,47 |
| `rt72-notebook-fome` | v2, tempo real, energia ainda não mantida (rodado no notebook) | 72 h, BUHL-1 | 7,88 / 13,87 / 17,30 | 0,57 |
| `rt24b` | v2, tempo real, energia mantida | 24 h, BUHL-1 | 5,63 / 8,35 / 14,46 | 0,68 |
| `sw2` | v2, tempo real, varredura do freio (n = 1 com c = 100 e com c = 30); rodadas incompletas, gravadas a cada hora | até 12 h, BUHL-1 | ver o relatório | — |
| `fluxo` | teste de fluxo por densidade num túnel | FLUXO-1 e FLUXO-2 | — | — |
| `suspeitos` | viagens de quem carrega terra, 50 e 200 operárias | BUHL-2, 8 dias | — | — |
| `proto` | protótipos de ajuste do feromônio v1 (c, evaporação, tamanho da equipe, mordida) | textos de saída | — | — |

## `scripts/`

Estes são scripts de diagnóstico descartáveis, escritos durante a
investigação. Cada um importa módulos do repositório por caminho. A maioria
recebe a raiz do repositório como primeiro argumento ou usa
`process.cwd()`, então rode a partir da raiz. Os principais:

- `suspects.mjs`, `trip.mjs`, `haul.mjs`, `haulspeed.mjs`, `mouth.mjs` e
  `stuck.mjs`: medem as viagens de quem carrega terra, as rotas e as
  formigas paradas nas câmaras.
- `blockers.mjs` e `third.mjs`: mostram quem bloqueia as carregadoras e
  quantas ociosas ficam perto das frentes.
- `chain.mjs`, `odor.mjs`, `wrongfront.mjs` e `ret.mjs`: percorrem a cadeia de
  escavação do feromônio, medindo probabilidade de entrar, recrutas perdidas,
  rotas de odor e quem volta depois de despejar.
- `flow.mjs` e `flow2.mjs`: protótipos do teste de fluxo.
- `death.mjs` e `death200.mjs`: causas de morte no modo de tempo real. Foi
  assim que se achou a fome no grupo de 200.
- `prof.mjs`: perfil de desempenho.
- `job.mjs` e `job2.mjs`: uma rodada de varredura do freio. O `job2` grava
  o resultado parcial a cada hora simulada. Use:

  ```sh
  node job2.mjs RAIZ SAIDA.json SEMENTE OPERARIAS HORAS EXPOENTE C
  ```

## `contraprova/cf.patch`

São as alterações temporárias usadas nas contraprovas, aplicadas sobre o
commit `2a4c97e`. Elas são ligadas por variáveis de ambiente:

- `CF_YIELD=1`: quem carrega terra não enxerga as ociosas;
- `CF_YIELD=2`: o mesmo vale para quem tem tarefa de solo;
- `CF_NOWIDEN=1`: só quem tem tarefa de solo alarga túnel.

Não aplique esse patch no código de produção. Ele serve só para reproduzir as
contraprovas.
