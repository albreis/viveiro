# Continuação do Viveiro

Atualizado em 02/11/2026. Ler AGENTS.md e docs/cronograma.md.
Trabalhar em G:\Projetos\viveiro; manter o dev4173 rodando a partir deG.
Não iniciar executor concorrente, contornar limites ou aprovações. Preservar
branches, tags, saves e audiência privada original. Código novo pequeno em TS.

## Estado atual

P0.3 entregue: Site público separado, com URLs por versão e sem login.
Branch codex/publicacao-por-tag; PR #41 sobre codex/licencas-e-revisao/#40.
PRs32–41 ainda abertos na última checagem; main15781d2. Conferir merges do
usuário antes da próxima etapa; ajustar a base se a anterior for integrada.

## Publicações válidas

Privado original: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/

- ID appgprj_6ae6364bc4488191b2757449ed3f7e94
- Audiência custom, somente proprietário, zero externos; revisão1 conferida.
- Fonte/tag v0.30.1: d61a439980d32dcbae61bba5d2aeb274fbb75341
- Deploy appgdep_6ae811f8a364819185b8aa71e710ac29, succeeded em02/11 04:31:02 UTC.
- Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_d7e6344067dc8191a838595a42f579d9
- Arquivo G:\Projetos\viveiro-0.30.1.tar.gz preservado.

Público separado: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/

- ID appgprj_6ae80cd45fdc8191be8315696a383393, audiência public/revisão2.
- Espelho G:\Projetos\viveiro-publico, manifesto próprio static.directory=dist.
- Fonte do espelho c98bdf7200e38fb8c07ac9665c0ab1043355055d.
- Versão1 appgprj_6ae80cd45fdc8191be8315696a383393~appgver_55042887d3a481919851baaa9d5119f6
- Deploy appgdep_6ae8141764a88191a4e271687cb7318c, succeeded em02/11 04:40:05 UTC.
- Arquivo G:\Projetos\viveiro-publico-0.30.1.tar.gz preservado.
- /releases/v0.30.0/ e /releases/v0.30.1/ válidos; origens a8c95f9 e d61a439.
- Não recriar Site, repetir save/deploy nem reescrever tags concluídas.

## Evidência e limites

18 dirigidos combinados passaram (11 novos de publicação), build310 módulos.
Biologia inalterada. A regressão anterior284 completos/18 finais da etapa14
não é uma nova execução completa desta entrega.

HTTP sem Cookie/Authorization:200 na raiz e nas duas tags;22 arquivos não HTML
com hashes exatos. Quatro HTML preservam o build e recebem JSD da Cloudflare;
307 de index.html/licencas.html são canônicos. Proteções não foram alteradas.
Relatório docs/validacoes/publicacao-0.30.1.json; detalhes em docs/publicacao-por-tag.md.

QA local/real:3D, primeira pessoa, Workers de malha/previsão/avanço, relatório,
licenças e checkpoint/reload. Origem pública nova: SEMENTE-42 avançou1dia atéD2,6
em pausa; console limpo. Capturas viveiro-0.30.1-publico.png e
viveiro-0.30.1-publico-modelo.png no diretório de visualizações autorizado.
O Site público não recebeu saves ou histórico do terrário privado.

## Ambiente preservado

Dev G/4173, PID17752, IABtab4: SEMENTE-50088/D62,5/labv5,14 adultos,
pausado, ritmo legado10s/dia a1×. Checkpoint original da QA de tempo:
manual-2e91b636-785f-4f66-bb84-ff832aa62547. Outros saves preservados.
Abas temporárias7/8 e preview4174/sessão98236 encerrados; dev mantido.
Sem teste, helper ou executor concorrente pendente. O GitHub original continua
privado. Não há calibração biológica por espécie.

A revisão automática bloqueou a atualização final por limite de uso. Nenhuma
ação dessa tentativa executou. Após o horário permitido, a revisão normal
voltou a permitir a execução; não houve contorno. A publicação já estava
concluída e foi reconciliada sem repetição.

## Próximo passo concreto: P0.4

1. Conferir Git/PRs e abrir branch codex/ própria, sobre#41 se ainda aberto.
2. Preparar CITATION.cff com título, versão/tag real, data e autoria verificável;
   conferir o esquema oficial. Não inventar nomes, ORCID ou DOI.
3. Preparar depósito/release reproduzível para Zenodo. DOI depende de conta,
   autorização e publicação reais; registrar dependências que faltarem.
   Metadados preparados não equivalem a emitir DOI ou concluir todoP0.4.
4. SeguirP1–P5, P5 por último. Dados de laboratório, revisão docente, pilotos,
   hardware escolar e publicação científica continuam dependências externas.
5. Entrega funcional: branch, testes adequados, QA, commit/push/PR e publicação
   privada. Releases públicas novas exigem fonte limpa e NOVA versão;
   scripts/build-public-release.ts preserva o espelho e as tags. Helper do
   espelho: commands:[["node","build-static.ts"]]. Não trocar identidades.

Não desativar a automação: o cronograma segue. Histórico detalhado preservado
em [índice de checkpoints](continuacao/0357f01/README.md).
