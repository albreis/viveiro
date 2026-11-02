# Continuação do Viveiro

Atualizado02/11/2026. Trabalhar em G:\Projetos\viveiro, ler AGENTS.md e cronograma.
Usuário ACABA DE PRIORITIZAR P2.2B como URGENTE. Não avançar P2.3 antes de resolver.
Não iniciar executor concorrente. Pequenos módulos TypeScript, Vite, branchcodex/,
testes e QA NATIVA Cua, commit/push/PR por entrega. Preservar saves/refs/privacidade.

## Fonte, Git e Sites

Branch codex/cli-experimentos, PR https://github.com/albreis/viveiro/pull/52,
base main. Fonte/tagv0.39.0:92072e26ed9a18d9533503376fd037b183e2f4d4.
Metadados posteriores não alteram a tag. Não retag/recriar release.
Usuário integrou #50/#51 e anteriores à main043c158 em18:15UTC; branches remotas
anteriores foram removidas externamente, preservadas localmente. PR52 ainda
aberto na última consulta. Conferir novamente antes de commitar checkpoint;
se integrado, criar branch própria de metadados em vez de empurrar em PR fechado.
A tentativa de criar #52 sobrecodex/doi-036 falhou porque essa base já fora
removida após merge; consulta confirmou merges e #52 foi criado contra main.

Privado original: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
IDappgprj_6ae6364bc4488191b2757449ed3f7e94, custom/rev1, owner1/external0.
Deployappgdep_6ae8d77151c08191ba871e7a27950b0e, succeeded18:33:37UTC.
ArquivoG:\Projetos\viveiro-0.39.0.tar.gz preservado.
Público separado: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
IDappgprj_6ae80cd45fdc8191be8315696a383393, public/rev2.
EspelhoG:\Projetos\viveiro-publico, font ec3ff739657b6790f132b980acebb135be21add7d.
Deployappgdep_6ae8d7ec68bc8191a76d09ee0931a63d, succeeded18:35:38UTC, versão10,
334 arquivos/15.943.680bytes, hash8332976fe7cb2d86984a7431a0f39528435aa6c834c922c07865fb5c4f8bf5e5.
ArquivoG:\Projetos\viveiro-publico-0.39.0.tar.gz. Galeria anterior preservada.
QA pública da página experimentos:100ticks completos, console limpo. Não
repetir save/deploy; IDs emvalidacoes/deploy-0.39.0.json. HTTP viaurllib na0.38
recebeu403, não repetir para contornar; builds/hashes locais conferidos.

## P2.2A e problema urgente P2.2B

CLI: npm run experiment -- --seed SEMENTE-42 --days3 --out pasta-nova
(usar --days 3 com espaço). Ou --plan configuracao.json --out pasta-nova.
Módulos pequenos modules/experiments/{plan,run,result}, scripts/run-experiment,
scripts/lib/experiment-args e app/experiment-page +workers/experiment.worker.
experimentos.html é segunda entradaVite. Usa World real/dailyCsv, plano canônico
com perfil fixado, sem datas ou CPU no resultado. NodeCLI exige pasta nova;
JSON/BOM, limites, campos e cancelamento testados. PáginaWorker isolada não toca
IndexedDB/saves.34 testes dirigidos +4 depósito, TS/build350 módulos, cache
público inclui página/5ºWorker. Nenhum submodelo foi alterado na0.39.

PARIDADE FALHOU DE VERDADE: seedQA-CLI-039,10dias, established, generic-demo@1,
h68/l72/random28/repose36/temp24/windX.25/Z-.15. Node24.22.1 versus IABdev E
bundle compilado. CSVs coincidem atéD6, diferem emD7 (38/16 vs37/17 adultos/crias).
EmD10:Node51/8, browser56/4. RNG final4272229179 vs26050480. NodeCSV SHA
1d6b3eb7535548bf93a5e5c66dd4bbf1cf9a93e2907d2e082fe103562d0dcf24,
browser(dev=build) e3811efd9d504c729803153200adbbd4dc13d00cd7be98b32ff794d04c5180f1.
Dados brutos imutáveis tests/fixtures/cli-native-039; .gitattributes marcaCSVbinary
para preservar BOM/CRLF. Manifesto atual declara ecmascript-native-f64-v1.
Não marcar P2.2 completo ou arredondar CSV: contagens inteiras divergem também.

Diagnósticos ignorados peloGit: .runtime/cli-debug-model.ts, cli-debug.worker.ts,
cli-debug.html, cli-debug-node.ts; snapshots node emcli-trace-node.json e browser
emC:\Users\conta\Downloads\cli-trace-browser.json. Inicializaram/avançaram
World igual, snapshots não consomemRNG. Primeira diferença no tick0:predators[0].y
0.0233727329392504 vs0.023372732939250403. No tick1:soil.granular.friction
0.7265425280053608 vs0.7265425280053609. RNG igual até600, diferente em650.
Relief usaMath.exp; friction usaMath.tan. Várias funções nativas podem variar.
Busca primária iniciada em github.com/stdlib-js/math-base-special-{exp,tan,sin,hypot},
mas NENHUMA dependência foi instalada nem Math substituído até este checkpoint.
Não usar patches globais. Plano concreto sugerido: serviço numérico explícito
com funções portáteis versionadas só em workers de experimentos (Node worker_threads
+browserWorker), núcleo e exportador compartilhados. Preservar política nativa dos
saves/3D legados. Auditar tambémhypot,atan2,sin,cos,log,expm1,tanh,atan,log1p,cbrt
e expoentes fracionários **. Testar funções e trajetórias REAIS de várias seeds,
fundação/ninho/solo/gases/operárias antes de declarar paridade. Reavaliar o plano
pelas evidências, sem implementação gigante nem alegar calibração científica.

## Evidências, DOI e ambiente

ODD0.38.0/#50 entregue:8docs,7elementos; reação-difusão reimplementável com
referência sem importarprodução,7vetores/36casos.37testes+4depósito; não é
replicação externa. docs/odd.md evalidacoes/odd-0.38.0.json preservados.
DOI0.36.0/#51 PUBLICADO com autorização explícita após revisar rascunho:
https://doi.org/10.5281/zenodo.23891981 ->https://zenodo.org/records/23891981.
Não criar duplicata/republicar. Autor “Viveiro contributors”. ZIP público baixado
igual ao original:1.445.248bytes,SHA03c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2.
CFF específico docs/citacoes/v0.36.0.cff; raizCFF0.39.0 ainda semDOI próprio.
Autorização de acesso/login e depósito0.36 foi dada; não pedir de novo. Não
atribuir DOI0.36 à0.39. P0.4C/botãoGitHub ainda precisa observação após merge.
Pacote0.39 .runtime/deposits/deposit-IMjy1M/viveiro-v0.39.0-source.zip,
551arquivos/1.568.012bytes,SHA39d328ce9710a2a8f90b42be5d28701bfcbdbd626373ca7dd4d85aa8f7951e02.
EsquemaCFF oficial válido e Pythonzipfile conferiu cada hash ebytesCSV; nada
novo enviado aoZenodo. Pacotes/tags antigos preservados.

DevPID17752/G/4173 HTTP200. AbaIAB20 mantém SEMENTE-50088/D62,5/14adultos
pausados/perfil leve, reconferida apósreload0.38; aguardar inicialização seHTML
mostrarSEMENTE-42. Saves, inclusive manual-2e91b636-785f-4f66-bb84-ff832aa62547,
preservados. Vite ignora.runtime/.sites-runtime. NÃO encerrar4173.
PreviewQA4189/session23666 ainda precisa ser encerrado ao final desta entrega.
Aba30QA pública atual;31diagnóstico foi fechada. Aba28Zenodo publicada marcada
entrega. Abas4/16erro antigas não usar/despejarURLdata. Capturas0.39cli/cli-publicado,
0.38ODD,0.36Zenodopublicado na pasta de visualizações autorizada.
Override320px da páginaCLI não se confirmou (DOMcontinuou1265px); reset feito,
não declarar reflow estreito aprovado. Console limpo, erros/foco ecancelamento
validados. Só Cua documentado parabrowser, semPlaywright externo/CDP/internals.

P1.6B2 planilha/leitor/zoom/Lighthouse pendente; PageSpeed429/cota diária,
retryNotBefore2026-11-03T15:16:57UTC, não contornar. P1ensaios/avaliações reais,
P3calibração eP5clima exigem dados reais. Retomada continua útil: não desativar.
Prioridade imediata éP2.2B, depoisP2.3 e seguintes. Não anunciar cronograma concluído.
