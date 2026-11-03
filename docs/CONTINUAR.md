# Continuação do Viveiro

Atualizado em 02/11/2026. Trabalhar na raiz do repositório (nesta máquina em G),
ler AGENTS.md, cronograma e conferir Git/PRs. Não iniciar executor concorrente.
Arquivos pequenos em src/TypeScript, Vite, testes adequados, QA nativa Cua,
commit/push/PR por etapa. Preservar saves, branches, tags e Site privado.

## Prioridade e regras atuais do usuário

Concluir TODOS os P2 ativos com agilidade: P2.3 entregue; seguir P2.4, P2.5,
P2.6 e P2.7. P2.8 e P5 foram descartados: não são pendências nem critérios de
conclusão; não retomar propostas históricas sem novo pedido explícito.

NÃO CRIAR/ENVIAR novas tags ou GitHub Releases até concluir todos os P2 ativos.
A v0.41.0 já havia sido enviada antes dessa orientação: preservar, sem retag.
O usuário vinculou GitHub ao Zenodo e não quer versões intermediárias ali.
Não publicar depósitos manuais/duplicados nem uma versão por etapa no Zenodo.
Antes da única próxima tag consolidada, alinhar versão e metadados para que
uma integração automática não arquive metadados antigos. Durante as etapas,
manter branches/PRs e dev disponíveis, sem releases intermediárias.

O público agora é GitHub Pages: https://viveiro.ersolucoesweb.com.br/.
NÃO atualizar o antigo Site público do ChatGPT. Não apagar o histórico.
O Site original continua privado; dev 4173 deve continuar rodando em G.

## P2.3 entregue — 0.41.0

Branch codex/varreduras-retomaveis, PR https://github.com/albreis/viveiro/pull/63
(base main), integrado pelo usuário em ba71e4d. Fonte/tag v0.41.0:
0edcf234dfdf3bef8b40bd1312c6bf3f0c71229f. Branch também recebeu a main com
correção do workflow do usuário; merge local 1a71dc9, só workflow/docs.

Módulos sweeps/{plan,jobs,checkpoint,run,summary}; CLI scripts/run-sweep.ts,
adaptadores sweep-{args,files,directory}; controles app/sweep-page e Workers.
Um comando executa 5 valores × 10 réplicas; --limit/--resume conserva execuções
completas. Resultados atômicos por pasta, hash/plano/versão conferidos, lock por
pasta. Após morte abrupta do SO, .sweep.lock pode exigir remoção manual depois
de confirmar ausência de executor; não apagar bloqueios incertos.

419/419 testes completos (162.256 ms), mais 4 testes de depósito. TS estrito,
build privado 360 módulos, cache offline incluído. CLI real 50 em um comando,
retomada 7+43 e importação. IAB dev 49+1, download/importação/retomada; bundle
compilado 50, em 2 Workers. CSV, manifesto, checkpoint e índice idênticos byte a
byte em todos os 50 casos. Dados brutos tests/fixtures/sweep-041; evidências
validacoes/varreduras-0.41.0.json. Seeds pareadas por réplica entre valores;
resultados internos do modelo, não observações naturais ou calibração.

Privado publicado: appgprj_6ae6364bc4488191b2757449ed3f7e94, owner-only,
custom/rev1/external0. Deploy appgdep_6ae91980319c81918c44f6f8805ab846,
succeeded 23:15:26 UTC. Arquivo ../viveiro-0.41.0.tar.gz, fonte da tag 0edcf23.
Público Pages: run https://github.com/albreis/viveiro/actions/runs/41544523508
concluído com sucesso, --ref main, tag=v0.41.0.

O run inicial da tag 41543216838 falhou antes do build porque o ambiente
aceitava apenas main. Usuário corrigiu no PR #64; revisão/CodeQL aprovados,
PR integrado com merge 76c01783828bbf6ad4ce876bf2854a3ae2426875. Proteções
mantidas. O novo workflow grava a tag no espelho e despacha publicação na main.
Não duplicar correção, não afrouxar regras do ambiente. #63 antigo vermelho era
esse run histórico, não falha do simulador. Recibo deploy-0.41.0.json.

## Citação e limites externos

Somente a 0.36.0 foi enviada manualmente ao Zenodo por este agente após aceite:
https://doi.org/10.5281/zenodo.23891981. Não duplicar nem atribuir esse DOI à 0.41.
Autoria/ORCID do usuário recebidos da main preservados nos metadados atuais.
CFF 0.41.0 validado pelo esquema oficial; ZIP somente LOCAL em
.runtime/deposits/deposit-bIkp0h/viveiro-v0.41.0-source.zip, 1.097 arquivos,
2.610.967 bytes, SHA 5a220b704c8369d19d86ee9bddb3547d1126f81df5088cdb4c880dfce37f9108.
Todos os hashes e 150 CSVs brutos conferidos. Não enviado ao Zenodo.
Não repetir empacotamento/deposito por etapa; seguir nova política acima.

P1.6B2: planilha real/leitor/zoom/Lighthouse ainda pendentes. PageSpeed teve
HTTP429/cota: não repetir antes de 2026-11-03T15:16:57 UTC nem contornar.
P1 ensaios escolares/docentes e P3 calibração/JOSS dependem de dados reais.
Nenhuma conformidade/calibração externa pode ser inventada para encerrar fases.

## Ambiente e próximo passo concreto

P2.4 implementado em codex/sensibilidade-morris, versão de desenvolvimento
0.42.0, SEM TAG. 432/432 testes completos (402.131 ms), TS/build, QA Cua do
relatório compilado e download de índices com hash exato. 104 World reais,
4 trajetórias × 13 pontos × 2 réplicas, 10 dias, 12 entradas. Triagem final
em .runtime/morris-042-final; bytes individuais idênticos à janela anterior.
Dados públicos em public/experimentos/morris-042, fonte/planos/hashes e
relatório docs/sensibilidade.md. Cinco efeitos populacionais não nulos;
empates de zero no top 10 não significam influência demonstrada. Nenhuma
calibração por espécie ou depósito Zenodo. Próximo: P2.5, depois P2.6–P2.7.

Dev 4173 PID17752 preservado; preview de QA 4189 separado. Não encerrar o dev.
Preparação do P2.5 em .runtime/p2-5-stage: contratos, registry, decisão,
exemplo local e CLI pareada. NÃO estão instalados em src nem entregues ainda.
Criar codex/extensoes-tipadas a partir da entrega P2.4, manter arquivos curtos,
validar sensores locais, seleção passável, reprodução, restore e comparação
real com ACO. Abrir PR encadeado se o anterior ainda não tiver sido integrado.

PR https://github.com/albreis/viveiro/pull/65 aberto contra main; CodeQL verde.
Privado publicado com sucesso em 2026-11-03T00:07:26 UTC, fonte 7b3b4f9,
recibo validacoes/deploy-p2.4-dev.json. Audiência custom/rev1, só proprietário. Não há tag/release 0.42; preservar a política consolidada do usuário.
