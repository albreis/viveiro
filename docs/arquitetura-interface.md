# Interface e renderização em TypeScript

Desenvolvimento0.46.0: todos os13JS legados de src/app e src/modules/renderer
foram migrados para TypeScript estrito. A simulação legada fora dessas pastas
continua no fluxo de migração gradual; não se desativou allowJs para fingir
que o repositório inteiro já foi convertido.

## Interface

| Módulo em src/app | Responsabilidade |
| --- | --- |
| controller.ts | Inicialização ordenada, fábrica de cena, aulas e tour |
| runtime-state.ts | Estado da sessão, captura e armazenamento |
| runtime-world.ts | Ponte guardada para o inicializador/restaurador legado |
| session-controller.ts | Aplicação atômica de sessão, reset e intervenções |
| view-controller.ts | Sincronização dos controles, indicadores e previsão |
| controller-frame.ts | Crédito do relógio, passos, render e eventos de visibilidade |
| controller-controls.ts | Ordem de instalação dos quatro grupos de controles |
| controls-environment.ts | Ambiente, checkpoints e avanço cooperativo |
| controls-experiments.ts | Pausa, ferramentas, seed, replay e A/B |
| controls-help.ts | Diálogo e propriedade dos atalhos |
| controls-export.ts | Exportação do estado observado |
| dom-elements.ts | IDs próprios, existência e tipo dos elementos |
| chart-view.ts / status-view.ts | Apresentação dos mesmos dados observados |

AppState, SessionController e ViewController compartilham uma única sessão;
FrameController acrescenta o loop e Controller instala os componentes. As
funções guardadas como callbacks são propriedades arrow para conservar o dono.
A fábrica WebGL é injetada: captura, aplicação e replay podem ser testados sem
criar canvas. O relógio recebe seu instante inicial na mesma posição da
sequência de instalação anterior, sem creditar o tempo de carregamento como dia.

## Renderer

scene.ts compõe as vistas existentes; scene-core.ts concentra câmera/luzes e
primitivas; scene-input.ts trata ponteiro/duplo clique; scene-dispose.ts libera
geometrias, materiais e texturas compartilhadas uma vez. render-types.ts usa os
contratos biológicos existentes com os agregados efetivamente lidos pela vista.
Plantas têm campos tipados para seus materiais, sem metadados implícitos.

Os novos módulos ficam abaixo de210linhas. Sem any amplo ou ts-nocheck. Não se
alteraram decisões, forças, equações, consumo de recursos ou RNG. A única mudança
em colonies/presentation.ts preserva o tipo genérico do mundo, sem código novo
na execução. O build continua gerado pelo Vite, sem editar dist.

## Verificação

Três regressões novas cobrem interpolação, restauração das quatro câmeras e
descarte compartilhado. Quatro regressões novas cobrem fronteira do mundo,
callbacks de replay A/B, sessão/relógio e IDs de DOM. QA nativa conferiu save
anterior, reset por seed, checkpoint/chuva/restore, A/B, aula, idiomas, câmera,
avanço de um dia e exportação real. O snapshot exportado foi reconstruído
exatamente pelo restaurador de produção. Builds estritos aprovados.

A suíte longa inicialmente encontrou104manifestos Morris convertidos paraCRLF.
A recuperação só foi feita após os hashesLF coincidirem com os publicados, e
-text agora impede essa conversão. Nenhum resultado foi recalculado para fazer
o teste passar. Uma execução Morris também detectou edição de fonte durante o
teste; a repetição com fonte estável passou. Evidências da rodada final ficam
em validacoes/typescript-0.46.0.json.
