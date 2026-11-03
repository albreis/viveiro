# Continuação do Viveiro

Atualizado em 02/11/2026. Trabalhar na raiz do repositório (nesta máquina em G),
ler AGENTS.md, cronograma e conferir Git/PRs. Não iniciar executor concorrente.
Arquivos pequenos em src/TypeScript, Vite, testes adequados, QA nativa Cua,
commit/push/PR por etapa. Preservar saves, branches, tags e Site privado.

## Prioridade e regras atuais do usuário

Concluir TODOS os P2 ativos com agilidade: P2.3 e P2.4 entregues; P2.5 entregue; P2.6 validado; seguir P2.7. P2.8 e P5 foram descartados: não são pendências nem critérios de
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

P2.4 entregue: PR #65, codex/sensibilidade-morris, fonte privada 7b3b4f9,
432/432 testes. P2.5 entregue: PR #66 sobre #65, codex/extensoes-tipadas,
fonte privada f4f9a39, 438/438 testes. Ambos publicados no original owner-private,
sem tags/releases. Recibos deploy-p2.4-dev e deploy-p2.5-dev. ACO e paridade
portátil/nativa preservados. Não repetir ensaios já aceitos.

P2.6 validado: codex/editor-perfis, desenvolvimento 0.44.0, SEM TAG.
444/444 testes completos (331.082 ms), TS/build, QA Cua dev e bundle. Editor
em app/parameter-profile-editor, parameter-fields, profile-file-io e template;
model parameter-profiles/profile; service parameter-profile-store. Arquivos
pequenos. Catálogo de 12 entradas (não todos coeficientes internos), unidade,
faixa/fonte; cinco opcionais só aplicadas quando marcadas. Biblioteca local
viveiro.parameter-profiles.v1 separada de IndexedDB/saves, versões id@v
imutáveis; importação/guardar/aplicar/exportar recusam conflitos conhecidos.
Plano/manifesto preservam perfil de origem e valores efetivamente executados,
permitindo varreduras com overrides explícitos sem editar o perfil guardado.
Exportar/reimportar por seed testado em Node, dev antes/depois e bundle:
300 ticks, CSV e manifesto byte a byte iguais; dados public/experimentos/profile-044.
Evidência validacoes/perfis-0.44.0.json. PR e recibo privado serão registrados
na finalização, sem GitHub release ou depósito manual no Zenodo.

PRÓXIMO: P2.7, inglês mantendo português como padrão. Inventariar textos da UI,
centralizar mensagens/formatadores em catálogos pequenos, traduzir documentação
pública gerada (modelo/ensino), permitir troca de idioma e verificar telas reais,
acessibilidade dos rótulos, Workers/erros e preservação de seed/RNG/CSV. Não
traduzir dados internos, IDs ou texto do usuário nem alterar contratos científicos
para traduzir a apresentação. Nenhum aceite parcial como completo.

Dev 4173 PID17752 preservado; preview QA 4189 separado. Cua abas39/dev e40/bundle
ensaiaram perfil. Downloads: qa-perfis-44-v1.json, configuracao (1).json,
dados/manifesto (13) primeira, (14) reimportada, (15) compilada; CLI local
.runtime/profiles-browser-cli-044. Screenshot editor salvo nas visualizações e
mostrado ao usuário. PRs ainda encadeados, verificar estado/main antes de agir.

Nenhuma tag/release nova até TODOS os P2 ativos terminarem. Zenodo ligado
automaticamente ao GitHub; não criar depósitos manuais/duplicados. Ao final,
alinhar CFF/.zenodo e pacote antes da única próxima publicação consolidada.
P2.8/P5 descartados. Pendências externas P1/P3 continuam abertas honestamente.
