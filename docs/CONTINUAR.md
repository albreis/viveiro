# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md. O usuário autorizou continuar o cronograma com retomada horária nesta conversa após limites legítimos. Automação continuar-cronograma-do-viveiro ativa; não iniciar executor concorrente nem contornar cotas/aprovações.

## Em andamento — 8C2 pronta para publicar0.17.0

Branch codex/observacao-e-validacao, base codex/previsoes-cancelaveis9f60d10.0.17.0validada:16testes dirigidos, TypeScript/Vite e browser aprovados. Falta commit/push/PR#20(se não existir), publicarowner-only e tag/checkpoint. Nenhuma mudança biológica, nenhum pacote novo. Módulos TS pequenos83–123linhas, testes232/233. src/modules/forecast/observations/count-model/count-run + avaliação/statistics; painel próprioforecast-benchmark.ts. Censo perfeito de adultos+3dias de histórico; sem energia/prole/genes/mapa no payload parcial. OLS+bootstrap de incrementos, fallbackpersistência, limites explícitos.

Ensaio CONCLUÍDO, sessão24451 encerrada, não repetir sem mudança de modelo. CLI npm run evaluate:forecast; log.runtime/forecast-evaluation.log. RelatórioREALpublic/benchmarks/previsoes-v1.json19036bytes,3seedsEVAL-VIVEIRO-01/02/03,origens300/600,horizontes1/3/7,6futuros completos cada.18pares origem/horizonte. Nodev24.22.1/Windows,gerado15:13:33UTC,total518,45s. MAEcompleto0,83/0,33/1,17;contagem1,33/6/20,67;base6,67/21,33/35,5. Coberturacompleto83,33/100/83,33%;contagem100/50/16,67%. Médiaativo51,08s/origem completo(todos horizontes),0,44ms/horizonte contagem. Deduplicar custo completo porseed/origem; cópia por linha. Sem calibração biológica ou isolamento causal do efeito dos dados; métodos diferentes,6origens correlacionadas em3seeds,um regime/colônias pequenas. docs/avaliacao-previsoes.md registra tudo.

BrowserQA: dia267pausado,97adultos/14crias/2colônias,92%RH e4719escolhas/4607ajustes preservados apósrecarga. Parcial3dias18futuros89–97,13censos,56,5ms/1,5ms. Completo1dia6futuros terminou45,1s/17,9s. TabelaMAE/RMSE/cobertura eJSON conferidos,base sem faixa. Nenhum erro novo; doislogsHMR14:44:57anteriores à QA. Screenshot viveiro-0.17.0-avaliacao.png. Localtab2 mantida, deixada parcial3dias18futuros+relatórioaberto; Site1intocado. DevG17752HTTP200. BuildjáincluiJSONfinal. Sem teste pendente; não alegar169/169fullsuite:153/153 foi0.15,16dirigidos atuais.

Próximo após publicar0.17.0: etapa9perfis/proveniência versionada (verdocs/biologia-planejada.md ecronograma).9–14ainda pendentes. Separar hipótese de dado, genérico demonstrativo de espécie calibrada; não usar faixas de outraIA como timers científicos. Não alterar modelos para melhorar a tabela. Preservar saves/branches/tags/audiência. Publicar viahelper sourceOPENnoHEADfinal,archiveG:\Projetos\viveiro-0.17.0.tar.gzfora do checkout.

## Última entrega publicada — 8C1 previsões canceláveis (0.16.0)

Branch codex/previsoes-cancelaveis, base codex/checkpoints-e-recuperacao5ac9d83. Versão0.16.0 publicada: fonte80fc8235bafdcb16b7f63e0ec59ab1edd2294fb7, tagv0.16.0, PR#19 https://github.com/albreis/viveiro/pull/19 aberto sobre#18. Deploy appgdep_6ae7536aed448191b373f9e399ee378e succeeded em01/11/2026 14:57:59UTC. Mesmo Site privado, owner-only/zero externos. ArquivoG:\Projetos\viveiro-0.16.0.tar.gz. Módulos pequenos src/modules/forecast (model/run/types), serviços forecast-client/runner, WorkerTS e painel próprio. Controller perdeu a lógica antiga; arquivo workerJS substituído. Sem mudanças biológicas. Cálculo cooperativo8ms/pausa40ms, um tick pode exceder8ms; último pedido pendente, cancelamento e invalidação por intervenção/reset/restore/replay/cenário. Opções1/3/7dias,6/18futuros,10/30/120s ativos; orçamento incompleto explícito, não auto-reinicia, amostra<2não exibe intervalo.

Oito testes novos e dois existentes de forecast/restore passaram (41379ms regressão); TypeScript/Vite e diffcheck aprovados. Não alegar execução completa161/161:153/153 foi na0.15.0. Engine igual ao ensemble síncrono. CLI backup real97adultos:2x10passos,912,9ms,maiorfatia160,7ms. Browser seed a/dia267 pausado preservado,2colônias/97adultos/14crias. QA orçamento10s→3/6futuros,98–99,25s; completo6/6→97–99,44,9s/17,6s. Cancelamento, recálculo e92→91→92%RH descartaram resultados velhos. Nenhum erro novo na QA final; dois logs de14:44:57 vieram de HMR parcial antes da recarga final. Screenshots0.16.0-previsao e-completa. DevG PID17752. Localtab2 mantida; previsão deixada cancelada, opções1/6/120. Site tab1 intocado.

Próximo concreto: criar codex/observacao-e-validacao para8C2 para observações parciais/completas, erros por horizonte e baselines em séries reservadas, custo e métricas explícitos. Não tratar faixaP10–P90 sintética como confiança científica calibrada. Etapas9–14 ainda pendentes. Publicar com helper sourceOPEN no HEAD final, archiveG:\Projetos\viveiro-0.16.0.tar.gz fora do checkout, preservar acesso owner-only. Tags e saves antigos preservados. Push só branch/tag específicas.

## Última entrega publicada — 0.15.0 (8B)

Branch codex/checkpoints-e-recuperacao, base codex/aprendizado-local bd3b64f. Fonte0868ca68042065212163995282400205bc788d18, tagv0.15.0. PR#18 https://github.com/albreis/viveiro/pull/18 pronto, encadeado ao#17. Deploy appgdep_6ae74f5a580881919755d62158dda0c2 succeeded em01/11/2026 14:40:39UTC. Mesmo Site privado: proprietário, zero externos. ArquivoG:\Projetos\viveiro-0.15.0.tar.gz. Commits3b1f14b e0868ca6 enviados; main intocada.

IndexedDB com transação atômica,8autoslots, pontos manuais preservados, fila serial e coalescência de autosaves pendentes. Compactação do habitat compartilhado, checksumCRC para corrupção acidental, importação legada, fallback independente e proteção contra sobrescrita de dados ilegíveis. Sem colaboração multitab/garantia de encerramento brusco. docs/persistencia.md. Novos módulos focados em TypeScript, sem dependências novas. Modelo biológico inalterado.

Validação:153/153 testes em250853ms, TypeScript/Vite aprovados; não repetir sem alteração relevante. UI real: criação de ponto,92→91%RH,restauração92 com backup anterior, importação do JSON original e recarga. Dia267,4719escolhas/4607ajustes e formiga#647 com38ajustes conservados. Console vazio. Screenshot viveiro-0.15.0-checkpoints.png. Backup original C:\Users\conta\Downloads\viveiro-a-dia-267.json e cópia G:\Projetos\viveiro\.runtime\before-checkpoints-dia-267.json preservados.806285bytes checkpoint vs1847316exportformatado; decode igual à sessão normalizada, diferença inclui formatação/campos derivados.

CUA export/import tiveram latência longa do provedor mas concluíram; evitar repetir sem necessidade. Reconectar documentação após compaction. Credenciais só em memória/stdin, nunca persistir. Publicação usa site-workflow.mjs, sourceOPEN no HEAD exato e arquivo fora do checkout. Push somente branch e tag explícitas.

## Entrega anterior — 0.14.0 (8A)

Branch codex/aprendizado-local, base codex/suporte-estrutural (83f43a2). Publicada. Fonte fb2093069ee97f980746a987534746ee164b72b4, tagv0.14.0, PR#17 https://github.com/albreis/viveiro/pull/17. Deploy appgdep_6ae73d981e948191a4cc7cc2461c0860 succeeded em01/11/2026 13:24:52 UTC. Mesmo Site privado, somente proprietário/zero externos confirmados. Learning em módulos TypeScript pequenos: rede6x8→1 (65 coeficientes), SARSA semi-gradiente, políticas locais, arena/treino separado, intervenção validada. Pesos e traços próprios por formiga; template de colônia imutável. Worker compara rede, ACO e rede sem treino em64 cenários reservados. Snapshots/replay, seletorACO/neural e leitura individual. ACO sem aprendizado preserva exatamente o estado/RNG anterior.

Suíte completa: 139/139 em517632ms (log .runtime/learning-suite.log), nove dirigidos finais aprovados. TypeScript/Vite final passou após última alteração SOMENTE de UI: relatório do treino agora reaparece após recarga. Não repetir a suíte completa sem nova alteração de modelo. Sem teste pendente.

Browser: seed a, dia267 pausado, 97 adultos/14crias/duas colônias. Neural ativo:4719decisões,4607ajustes,recompensa -311,40; selecionada#647 com38ajustes. Treino a:policy: rede64/64,ACO64/64,sem treino1/64; passos6,1/6,7. Troca ACO/neural preservou pesos; recarga/relatório e primeira pessoa aprovados. Console final vazio. Screenshot viveiro-0.14.0-aprendizado.png no diretório autorizado do Codex. Conexão CUA antiga expirou após horas; reset e getTab2 reconectaram sem trocar navegador. DevG PID17752 e HTTP200. IABlocaltab2, Sitetab1 intocado.

Próximo imediato: criar branch codex/checkpoints-e-recuperacao sobre codex/aprendizado-local para8B. Implementar IndexedDB/checkpoints/migrações/compactação do habitat compartilhado;8C previsões por observação/horizonte e benchmarks. Etapas9–14 continuam planejadas ao final. Limites científicos de7/8A explicitados, sem calibração prometida.

## Entrega anterior — 0.13.0 (7C)

Branch codex/suporte-estrutural, base codex/gases-e-ventilacao (12260e7). Publicada no mesmo Site privado. Fonte 25dbe03bbc63579ee9e2ba738ef2ed025b8c2a6e, tag v0.13.0, PR #16 https://github.com/albreis/viveiro/pull/16. Deploy appgdep_6ae71342c17c8191a6fd9f5bdde06fd3 succeeded em 01/11/2026 10:24:15 UTC; audiência somente proprietário preservada. Modelo em src/modules/structure: geometria do teto no campo implícito, carga/capacidade reduzida por água/atrito/integridade, dano, volume sólido por quadratura e desprendimento conservativo. Entulho solto excluído da consulta do compacto. Desgaste antigo alimenta integridade/capacidade, mas limiar0,4 deixou de causar colapso natural por si só. Agregados caem e são recolhidos pela rotina existente. Fissuras instanciadas, painel e foco da câmera dentro da galeria. Modelo não é DEM compacto/FEM calibrado; liberação adiada perto de corpos, sem soterramento. docs/suporte-estrutural.md. Fonte e checkpoint enviados ao GitHub.

Dez testes dirigidos passaram. Um erro inicial era do fixture com revision1 (migração legada recriava o ninho), corrigido para revision2 sem alterar migração. Saída de snapshot gigante foi evitada com isDeepStrictEqual+assert.ok, preservando comparação estrita. O teste de restore foi fortalecido para conter agregado liberado e móvel e os sete estruturais finais passaram. Suíte completa limpa: 130/130 em 494952 ms (log local .runtime/structure-suite.log). TypeScript/Vite finais aprovados após a câmera; nenhum teste pendente. Não repetir sem alteração relevante.

Navegador: seed a preservada; dia240,1 pausado, duas colônias/82 adultos/10 crias, 72 amostras de teto, uma sob sobrecarga, menor margem0,95× e um desprendimento natural. Terra solta já0 no painel. Foco inicial externo pouco útil foi corrigido para inspeção no interior com luz local. Fissura visível, recarga persistiu métricas, sem erros novos (console contém apenas HMR antigos08:37 e09:42 já corrigidos). Screenshots viveiro-0.13.0-fissura.png e-suporte.png no diretório autorizado. IABlocaltab2, Sitetab1 intocado. DevG PID17752.

Próximo imediato: criar branch codex/aprendizado-local sobre codex/suporte-estrutural para etapa8A. Implementar RL pequeno com baseline, treino separado, IndexedDB/checkpoints/migrações, observação parcial/completa e erro por horizonte. Calibração de7 permanece dependente de dados; não tratar o proxy estrutural como cadeias de força reais. Etapas9–14 novas permanecem ao final, planejadas como hipóteses/dados a validar.

## Entrega anterior — 0.12.0 (7B2)

Branch codex/gases-e-ventilacao, base codex/agua-e-calor. Fonte 0e385cc10855b974581dcc3ed894bf3c95fbf4cc, tag v0.12.0, PR #15 https://github.com/albreis/viveiro/pull/15. Deploy appgdep_6ae70e5a53248191a26b2084df60fb48 succeeded em 01/11/2026 10:03:19 UTC; mesmo Site privado, somente proprietário confirmado. Módulos pequenos em src/modules/ventilation: tipos, rede, estado/balanços, pressão, transporte, respiração, sensores e update. O₂/CO₂ por nós, vento e empuxo aproximados, obstrução por entulho. Campo global único; snapshots e RNG independentes. Sensores ACO só em saídas próximas (≤1,2); custo de energia exploratório nas operárias. Desgaste/estoque usam água e temperatura locais. README, changelog e docs/gases-e-ventilacao.md atualizados. Novas etapas 9–14 continuam ao final do cronograma.

Validação: 12 testes dirigidos de gases/integração aprovados; TypeScript/Vite aprovados. Primeira suíte completa teve 122/123 em 541580 ms: único erro foi estoque inexistente em fundação sem câmaras. Corrigido com guarda de armazenamento real; teste original da falha passou isoladamente. Segunda suíte completa limpa: 123/123 em 448552 ms, TypeScript/Vite finais aprovados. Nenhum teste pendente; não repetir sem nova alteração relevante.

Navegador: seed a mantida, ar 35 °C, RH92%, repouso20°. Vento 1,5 por teclado e simulação continuada até dia229,8, depois pausada. Duas colônias/87 adultos, três entradas. Ar: O₂8,47–20,86%, CO₂0,07–9,98%; consumo0,128u. São resultados exploratórios sem calibração. Recarga conservou campo/vento/tempo; diagrama e leitura local observados. Screenshot viveiro-0.12.0-ar.png no diretório autorizado do Codex. Console tem apenas registros antigos de HMR: granular08:37 (corrigido0.10) e intervene09:42 (corrigido para intervention antes do QA). Conferência final: nenhum erro novo. Primeira pessoa mostrou O₂8,47%/CO₂9,98%; retorno à câmera externa aprovado. Dev G PID17752 HTTP200; localtab2, Sitetab1 intocado.

Próximo imediato: criar branch codex/suporte-estrutural sobre codex/gases-e-ventilacao para 7C. Integrações: soil/projects digBite/advanceFront e navigation congestion widening mudam nest.revision; soil/erosion ainda usa desgaste empírico de umidade/vão. Granular só resolve agregados soltos; compactado permanece no campo implícito. 7C deve adicionar suporte por geometria/carga local com limites explícitos, conservação e ausência de geração duplicada de massa; nunca apresentar calibração ou mecânica completa sem dados.

## Entrega anterior — 0.11.0 (7B1)

Branch codex/agua-e-calor; base codex/solo-granular. Versão 0.11.0 publicada. Fonte 22efc9cc06457f9749e6de792708d592020e0a09, tag v0.11.0. PR #14 https://github.com/albreis/viveiro/pull/14. Deploy appgdep_6ae707f3104c8191a874614f54d1b901, succeeded em 01/11/2026 09:35:59 UTC; acesso só do proprietário confirmado, sem alterar audiência. Campo 20x8x13 de água/temperatura com transporte conservativo reduzido, fontes/saídas e calor; independente de RH, controle do ar 5–45 °C. Plantas/madeira/pedras e leitura da formiga usam amostras próximas. Mapas em corte água/calor, tipos/estado/grade/transporte/fronteiras separados. Modelo não resolve Richards completo, galerias inundadas, gelo, calor advectado ou capacidades térmicas variáveis. docs/agua-e-calor.md.

Suíte completa: 111/111 em 468562 ms. TypeScript/Vite finais aprovados; oito testes de clima direcionados passaram após adicionar verificações de balanços acumulados e acessibilidade dos botões. Recarga preservou ar/solo/tempo; primeira pessoa mostrou a leitura local. Nenhum erro novo no console (o registro antigo de HMR em 08:37 foi corrigido na 0.10). Não repetir testes completos se os dirigidos passarem e não houver nova alteração do modelo.

Navegador: seed a preservada; clima inicial 53,8–63,2% nos poros e 22,3–24 °C. Mudança do ar para 35 °C manteve inicialmente solo em 22,6–24,6 °C; chuva no dia 176,7. QA pausada no dia 219,1: entorno 47,5–68,9%, 28–34,1 °C, 0,8 u. infiltrada e 4,1 evaporadas. Formiga selecionada leu 28,7 °C/61% no entorno. Mapas alternados e screenshots viveiro-0.11.0-calor.png e viveiro-0.11.0-agua.png salvos no diretório autorizado. Dev G PID 17752, IAB local tab 2; Site tab 1 intocado. Modelo em solo vizinho, não umidade do ar da câmara.

Próximo passo imediato: criar branch 7B2 codex/gases-e-ventilacao sobre codex/agua-e-calor e implementar gases/ventilação por nós, conservação e respostas locais. Erosão/perdas de estoque ainda usam heurísticas globais; acoplar ao campo local nessa próxima etapa sem alegar calibração.

## Entrega anterior — 0.10.0

- Branch codex/solo-granular; base codex/simbioses-e-mimetismo.
- Fonte d4648b88506c3fe4e9a2cd2dfe60ddb291eaacb8, tag v0.10.0.
- PR #13 https://github.com/albreis/viveiro/pull/13. PRs #1–#13 preservados e encadeados; não duplicar.
- Deploy appgdep_6ae70061e5008191bdb9dbfee64c9ffa, succeeded em 01/11/2026 09:03:43 UTC. Mesmo Site privado, acesso só do proprietário confirmado.
- Granular: agregados de terra solta com gravidade, atrito de Coulomb, contato dissipativo, grade espacial e controle/replay do repouso. Solo compacto continua implícito; depósitos externos visuais; nada calibrado. docs/granular.md.
- Suíte final completa: 103/103 em 367449 ms; TypeScript/Vite aprovados. Uma regressão de retorno foi corrigida com settleSupport também no reparo. Limpeza integral em 1688 ticks e asserção adicional de apoio dinâmico passou.
- Navegador: seed a, queda no dia 171 (0,047 u³); no dia 172,6 material acomodado e parcialmente retirado (0,025 u³). Ajuste para 20° e recarga preservaram o estado. Sem novos erros após corrigir o carregamento parcial HMR; não confundir o erro antigo de null/oninput em 08:37 com estado atual.
- Screenshots viveiro-0.10.0-terra.png e viveiro-0.10.0-bloqueio.png. IAB local tab 2 pausada no dia 172,6, duas colônias/115 formigas; view foi resetada para perspectiva pela recarga. Dev G PID 17752, porta 4173. Nenhum teste pendente.

## Entrega anterior — 0.9.0

- Branch codex/simbioses-e-mimetismo; base codex/cronograma-biologia-fundacao. Versão 0.9.0.
- Fonte 526d7ded6c0f531bbbd7677add22269e0c92524d, tag v0.9.0.
- PR #12 https://github.com/albreis/viveiro/pull/12. Base documental PR #11 https://github.com/albreis/viveiro/pull/11, que depende do PR #10. PRs #1–#12 abertos e encadeados; não duplicar nem mesclar main sem instrução.
- Deploy appgdep_6ae6f7a6ab9881918ecf7ac1e80276ef, succeeded em 01/11/2026 08:26:27 UTC.
- Site privado https://viveiro-caos-formigueiro.everaldodev.chatgpt.site ; projeto appgprj_6ae6364bc4488191b2757449ed3f7e94. Acesso só do proprietário e zero visitantes externos confirmados antes de publicar.
- Preservar versões anteriores: 0.8.0 fonte 35296be9bc4d89b4fef1c9d9eabaad8e4ca50faa; 0.7.0 e6e4790185fab8788cccdaf35dcc8f243e397c35; 0.6.0 0aec356a9a9d3ef8cbce227dae5577dd9874a34d; 0.5.0 e149fe8944b315bbff078a4f1be7a471c3297145. Tags correspondentes preservadas.

## Implementado

5B/5C: fundação física de alados com orçamento materno, naníticas, coortes reprodutivas pagas e filhas no mesmo habitat com estoques/genética/parentesco independentes. Limites: quatro registros de colônia, 450 adultos/crias, duas frentes operárias. Documentos fundacao.md e colonias-filhas.md.

6A: perfis químicos abstratos, máscaras temporárias, reconhecimento local pelo ar, postura/recuo/dano e território conservativo. Revestimento pelo solo e infiltração exploratória com transporte de estoque real. docs/odores-e-territorio.md.

6B: pulgões por seed associados a plantas, seiva debitada, melaço/assimilação/perdas contabilizados, coleta e defesa locais. Lagartas cuco de odor compatível, transporte com apoio até o berçário, deposição e alimento debitado de doadoras próximas. Snapshot conserva estados e liga habitat comum no restore. UI com instâncias e aproximação da câmera. docs/simbioses.md. Limites: pulgões agregados, população inicial de até três lagartas; sem pupa/borboleta adulta, sem calibração por espécie. Não tratar essas estratégias combinadas como universais.

## Verificação da 0.9.0

- Suíte completa: 96 testes aprovados em 366956 ms.
- Depois: 19 testes químicos/ecológicos após ajustes de saúde/normal/carga e dez ecológicos após impedir crescimento sem seiva. Um teste novo cobre a planta esgotada; total no repositório agora 97 casos, sem alegar uma execução completa de 97.
- TypeScript e Vite finais aprovados. Módulos novos do modelo com 9–64 linhas, renderer separado.
- Transporte integrado da lagarta: 125 ticks, maior passo 0,081991 e erro máximo de apoio 0,000296.
- Navegador: seed a pausada no dia 171, duas colônias, 115 formigas; 99 pulgões em seis plantas, 16,41 u. de melaço coletadas, duas adoções e 1,51 u. cedidas às lagartas. População inicial de lagartas já terminou a vida; contadores são acumulados. Zoom, corpos/gotas e console sem erros conferidos.
- Screenshots viveiro-0.9.0-pulgoes.png e viveiro-0.9.0-relacoes.png no diretório autorizado do Codex. Chrome do usuário intocado; IAB local tab 2, Site tab 1.
- Dev foi religado no G: HTTP 200; PID atual em .runtime/dev.pid. Deixar rodando. Nenhum teste pendente.

## Cronograma ampliado pelo usuário

Material de outra IA foi registrado ao final do cronograma como etapas 9–14: perfis por espécie, fundação/selamento, desenvolvimento e diapausa, clima espacial, espermateca/longevidade e relógios de anos. Detalhes em docs/biologia-planejada.md. Commit documental 46e9d8f enviado na branch codex/cronograma-biologia-fundacao, PR #11. A 6B recebeu esse commit por fast-forward, sem colocar código 6B no PR documental.

Faixas de 12–24 h, 1–7 d, 35–60 d, 15–30 anos e alegações derivadas de 52%/68% permanecem hipóteses a validar, não timers novos. Distinguir umidade relativa de água no solo e irradiância de temperatura. Longevidade, número de parceiros e trade-offs não são universais. As referências primárias e dependências estão no documento.

## Próximo passo concreto

Criar codex/agua-e-calor a partir da 7A para 7B1: campo tridimensional coarse de água nos poros e temperatura, independente da umidade relativa do ar. Proposta ainda NÃO implementada: grade de cerca de 20x8x13 amostras sob o relevo, fluxos conservativos locais de água (diferença de saturação/capilaridade reduzida + gravidade), chuva/infiltração e evaporação com balanço explícito, condução de calor e fonte solar exploratória. Novo controle independente de temperatura do ar; umidade atual passa a ser rotulada como relativa do ar. Amostrar o entorno das plantas e das formigas para leitura/resposta local. Evitar apresentar água nos poros como umidade do ar da câmara ou resolver inundação sem modelo.

Executar o campo global uma vez por tick/família, preferencialmente com subpassos e frequência reduzida para não tornar o ABM caro; conservar água e calor nos testes fechados, contabilizar fronteiras e manter valores finitos. Coeficientes exploratórios e perfil inicial explícitos, sem deduzir estado do solo de 52% de RH. Medir custo e incluir snapshots/replay e visualização observável. Não reexecutar 6/7A já publicadas.

Depois 7B2 gases O2/CO2 e ventilação no grafo com condutância dependente de geometria, respiração e balanços; 7C suporte estrutural; 8 RL/persistência/avaliação; novas 9–14 conforme dependências. Referências primárias já localizadas: Richards 1931 DOI 10.1063/1.1745010 (capilaridade/gravitacional, não confundir aproximação com solver completo); PMC8611346 (experimentos de ventilação/CO2 em Acromyrmex, efeitos de difusão, vento e convecção dependentes de arquitetura). Modelos e taxas precisam de dados para calibrar.

Dados reais continuam necessários para calibração. O Site avança no navegador; não há executor contínuo em nuvem. JSON das colônias ainda repete habitat; persistência longa/compactação é etapa 8. Previsões de populações maiores são computacionalmente caras, a medir na etapa 8.

## Ambiente e publicação

Escritas atômicas e já formatadas; normalizar CRLF antes de substituições multilinha. Código em src e dist gerado pelo Vite. Usuário pediu dev ligado no G: não encerrar. Logs .runtime/ ignorados.

Push apenas da ref da entrega e tag específica: push --all já foi rejeitado por escopo amplo. Não enviar branches alheias nem mesclar main. Cada etapa tem testes, navegador, commit/push e PR sobre a base anterior.

Sites: get_site e credencial, helper de abertura no HEAD corrente antes de empacotar. Credenciais só em memória/stdin. Arquivo tar fora do checkout; G:\Projetos\viveiro-0.9.0.tar.gz e G:\Projetos\viveiro-0.10.0.tar.gz já publicados. Guardar literalmente project_id/commit_sha/archive retornados. Fonte publicada é a tag, enquanto o checkpoint posterior contém os IDs do deploy.
